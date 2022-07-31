"use strict";
var express = require("express");
var router = express.Router();
var passport = require("passport");
var app = express();
app.use(passport.initialize());
app.use(passport.session());
var randomstring = require("randomstring");
var jwt = require("jsonwebtoken");
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
var db = require("./../../models");
var file_upload = require("./../../services/upload");
var roleService = require("./../../services/roleService");
var passwordService = require("./../../services/passwordService");
const axiosService = require("../../services/axiosService");
const Stripe = require("stripe");
module.exports = {
  initializeApi: function (app) {
    const basic_attributes = ["createdAt", "updatedAt"];
    const emr_admin_token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWRtaW4iLCJhZG1pbl90eXBlIjowLCJpZCI6MiwiaWF0IjoxNjQzMjY1Mzg4fQ.DOWxeIL5HgsV5MRqwgSJV5KjqfkcBoeJeW-TM1kjDVI";
    const emr_url = process.env.EMR_API_URL;

    const role = 1;
    app.post(
      "/pharmacies/addorder",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          let patient_id = 0;
          const {
            hospital_type,
            hospital_id,
            hospital_prescription_id,
            patient,
            drugs,
            discount,
            total_price,
            status,
            payment_type,
            additional_information,
            cheque_no,
            bank_name,
            account_holder_name,
            cheque_date,
            transaction_id,
            patient_insurance_id,
            insurance_company_id,
          } = req.body;
          console.log("payment type");
          const pharmacy_profile = await db.pharmacy_profile.findOne({
            where: {
              id: req.pharmacy_user_id,
            },
          });

          if (payment_type == 4) {
            // check
            if (!pharmacy_profile.stripe_id) {
              return res.send({
                status: "error",
                message: "Please update stripe on profile",
              });
            }
          }

          if (cheque_date) {
            let datecheck5 = new Date(cheque_date);
            var timestamp5 = Date.parse(datecheck5);
            if (isNaN(timestamp5)) {
              return res.send({
                status: "error",
                message: "Please provide cheque in format yyyy-mm-dd",
              });
            }
          }

          if (patient.id) {
            patient_id = patient.id;

            if (patient.dob) {
              let datecheck2 = new Date(patient.dob);
              var timestamp2 = Date.parse(datecheck2);
              if (isNaN(timestamp2)) {
                return res.send({
                  status: "error",
                  message: "Please provide dob in format yyyy-mm-dd",
                });
              }
            }

            await db.patient_details.update(
              {
                hospital_id: hospital_id ? hospital_id : null,
                hospital_patient_id: patient.hospital_patient_id
                  ? patient.hospital_patient_id
                  : null,
                first_name: patient.first_name,
                middle_name: patient.middle_name,
                last_name: patient.last_name,
                street_address_1: patient.street_address_1,
                dob: patient.dob ? patient.dob : null,
                phone: patient.phone,
                email: patient.email,
                city: patient.city,
                state: patient.state,
                zip: patient.zip,
              },
              {
                where: {
                  id: patient.id,
                },
              }
            );
          } else {
            if (patient.dob) {
              let datecheck2 = new Date(patient.dob);
              var timestamp2 = Date.parse(datecheck2);
              if (isNaN(timestamp2)) {
                return res.send({
                  status: "error",
                  message: "Please provide dob in format yyyy-mm-dd",
                });
              }
            }

            if (
              patient.first_name ||
              patient.middle_name ||
              patient.last_name ||
              patient.phone ||
              patient.email
            ) {
              const data1 = await db.patient_details.create({
                user_id: req.pharmacy_user_id,
                hospital_id: hospital_id ? hospital_id : null,
                hospital_patient_id: patient.hospital_patient_id
                  ? patient.hospital_patient_id
                  : null,
                first_name: patient.first_name,
                middle_name: patient.middle_name,
                last_name: patient.last_name,
                street_address_1: patient.street_address_1,
                dob: patient.dob ? patient.dob : null,
                phone: patient.phone,
                email: patient.email,
                city: patient.city,
                state: patient.state,
                zip: patient.zip,
              });
              console.log("\n\n\n data 1: ", data1);
              patient_id = data1.id;
            } else patient_id = null;
          }

          const data2 = await db.order.create({
            user_id: req.pharmacy_user_id,
            hospital_id: hospital_id ? +hospital_id : null,
            hospital_prescription_id: hospital_prescription_id
              ? +hospital_prescription_id
              : null,
            discount: discount ? +discount : 0,
            payment_type: payment_type ? payment_type : null,
            additional_information,
            amount: +total_price,
            status: +status,
            patient_details_id: patient_id,
            cheque_no,
            bank_name,
            account_holder_name,
            cheque_date: cheque_date ? cheque_date : null,
            transaction_id,
            patient_insurance_id,
            insurance_company_id: insurance_company_id
              ? insurance_company_id
              : null,
          });
          console.log(data2);
          for (let item in drugs) {
            let drug_item = drugs[item];
            await db.order_item.create({
              user_id: req.pharmacy_user_id,
              drug_code: item,
              drug_name: drug_item.drug_name,
              price: drug_item.total_price,
              quantity: drug_item.quantity,
              order_id: data2.id,
              returned: 0,
            });
            const current_drug = await db.drug.findOne({
              where: {
                drug_code: item,
                user_id: req.pharmacy_user_id,
              },
            });
            if (current_drug) {
              current_drug.available_quantity =
                current_drug.available_quantity - parseInt(drug_item.quantity);
              await current_drug.save();
            }
            if (status == 1) {
              const headers = {
                token: emr_admin_token,
              };

              const result = await axiosService.postRequest(
                emr_url + "/pharmacy/reducerefill",
                {
                  token: emr_admin_token,
                  hospital_id,
                  hospital_prescription_id,
                  reduce_count: 1,
                  drug_code: item,
                },
                headers
              );
              console.log("\n\n\n reduce refill ", result);
            }
          }

          if (payment_type == 4) {
            let stripe = Stripe(pharmacy_profile.stripe_id);
            let price_id = "";
            // const checkPriceExist = await stripe.prices.search({
            //   query: `unit_amount : ${+total_price}`,
            // });

            // if (
            //   checkPriceExist &&
            //   checkPriceExist.data &&
            //   checkPriceExist.data.length
            // ) {
            //   price_id = checkPriceExist.data[0].id;
            // } else {
            //   const price = await stripe.prices.create({
            //     unit_amount: +total_price,
            //     currency: "usd",
            //     product: "prod_" + total_price,
            //   });
            //   price_id = price.id;
            // }
            let am = +total_price - (discount ? discount : 0);
            const product = await stripe.products.create({
              name: "prod_" + am,
            });
            const price = await stripe.prices.create({
              unit_amount: am * 100,
              currency: process.env.CURRENCY,
              product: product.id,
            });
            price_id = price.id;

            const session = await stripe.checkout.sessions.create({
              line_items: [
                {
                  price: price_id,
                  quantity: 1,
                },
              ],
              mode: "payment",
              success_url: `${process.env.BASE_URL}/pharmacies/stripe/paymentsuccess/${data2.id}`,
              cancel_url: `${process.env.BASE_URL}/pharmacies/stripe/paymentfailed/${data2.id}`,
            });
            console.log(session);
            await db.transaction.create({
              order_id: data2.id,
            });
            return res.send({
              status: "success",
              message: "done",
              url: session.url,
            });
          } else {
            return res.send({
              status: "success",
              message: "done",
              url: "",
            });
          }
        } catch (error) {
          console.log(error);
          res.send({
            status: "error",
            message: error,
          });
        }
      }
    );
    /**
 *               const headers = {
                token: emr_admin_token,
              };

              const result = await axiosService.postRequest(
                emr_url + "/pharmacy/reducerefill",
                {
                  token: emr_admin_token,
                  hospital_id,
                  hospital_prescription_id,
                  reduce_count: 1,
                  drug_code: item,
                },
                headers
              );
              console.log("\n\n\n reduce refill ", result);

 */

    app.post(
      "/pharmacies/stripe/retrypayment",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          const { order_id } = req.body;

          await db.transaction.destroy({
            where: {
              order_id,
            },
          });
          await db.transaction.create({
            order_id,
          });
          const pharmacy_profile = await db.pharmacy_profile.findOne({
            where: {
              id: req.pharmacy_user_id,
            },
          });
          if (!pharmacy_profile.stripe_id) {
            return res.send({
              status: "error",
              message: "Striped ID missing",
            });
          }
          const order = await db.order.findByPk(order_id);
          if (!order) {
            return res.send({
              status: "error",
              message: "Order does not exist",
            });
          }

          let stripe = Stripe(pharmacy_profile.stripe_id);
          let price_id = "";
          // const checkPriceExist = await stripe.prices.search({
          //   query: `unit_amount : ${+order.amount}`,
          // });

          // if (
          //   checkPriceExist &&
          //   checkPriceExist.data &&
          //   checkPriceExist.data.length
          // ) {
          //   price_id = checkPriceExist.data[0].id;
          // } else {
          //   const price = await stripe.prices.create({
          //     unit_amount: +order.amount,
          //     currency: "usd",
          //     product: "prod_" + order.amount,
          //   });
          //   price_id = price.id;
          // }
          let am = order.amount - order.discount;

          const product = await stripe.products.create({
            name: "prod_" + am,
          });
          const price = await stripe.prices.create({
            unit_amount: am * 100,
            currency: process.env.CURRENCY,
            product: product.id,
          });
          price_id = price.id;

          const session = await stripe.checkout.sessions.create({
            line_items: [
              {
                price: price_id,
                quantity: 1,
              },
            ],
            mode: "payment",
            success_url: `${process.env.BASE_URL}/pharmacies/stripe/paymentsuccess/${order_id}`,
            cancel_url: `${process.env.BASE_URL}/pharmacies/stripe/paymentfailed/${order_id}`,
          });
          return res.send({
            status: "success",
            message: "done",
            url: session.url,
          });
        } catch (err) {
          return res.send({
            status: "error",
            message: err,
          });
        }
      }
    );

    app.get(
      "/pharmacies/stripe/paymentsuccess/:order_id",
      async function (req, res) {
        try {
          console.log("payment success ", req.params.order_id);
          const transaction = await db.transaction.findOne({
            where: {
              order_id: req.params.order_id,
            },
          });
          console.log(transaction);
          if (!transaction) {
            return res.send({
              status: "error",
              message: "Transaction does not exist",
            });
          }
          if (transaction.payment_status == 1) {
            return res.send({
              status: "error",
              message: "Payment status already updated",
            });
          }
          await db.transaction.update(
            {
              payment_status: 1,
            },
            {
              where: {
                order_id: req.params.order_id,
              },
            }
          );
          res.redirect("/pharmacies/patient_order.html");
        } catch (err) {}
      }
    );

    app.get(
      "/pharmacies/stripe/paymentfailed/:order_id",
      async function (req, res) {
        try {
          const transaction = await db.transaction.findOne({
            order_id: req.params.order_id,
          });
          if (!transaction) {
            return res.send({
              status: "error",
              message: "Transaction does not exist",
            });
          }
          if (transaction.payment_status == 2) {
            return res.send({
              status: "error",
              message: "Payment status already updated",
            });
          }
          transaction.payment_status = 2;
          await transaction.save();
          res.redirect("/pharmacies/patient_order.html");
        } catch (err) {}
      }
    );

    app.post(
      "/pharmacies/dispenseorder",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          const { id } = req.body;
          let msg = "";
          const order = await db.order.findOne({
            where: {
              id,
            },
          });
          order.status = 1;
          order.save();
          const orderItems = await db.order_item.findAll({
            where: {
              order_id: id,
            },
          });
          for (let i = 0; i < orderItems.length; i++) {
            const headers = {
              token: emr_admin_token,
            };

            const result = await axiosService.postRequest(
              emr_url + "/pharmacy/reducerefill",
              {
                token: emr_admin_token,
                hospital_id: order.hospital_id,
                hospital_prescription_id: order.hospital_prescription_id,
                reduce_count: 1,
                drug_code: orderItems[i].drug_code,
              },
              headers
            );
            console.log("\n\n\n reduce refill ", result);

            msg += "Success";
          }

          return res.send({
            status: "success",
            message: msg,
          });
        } catch (error) {
          res.send({
            status: "error",
            message: error,
          });
        }
      }
    );

    app.post(
      "/pharmacies/updateorder",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          await db.order.update(
            {
              uuid: req.body.uuid,

              has_prescription: req.body.has_prescription,

              hospital_id: req.body.hospital_id,

              hospital_prescription_id: req.body.hospital_prescription_id,

              hospital_patient_id: req.body.hospital_patient_id,

              discount: req.body.discount,

              status: req.body.status,

              order_date: req.body.order_date,
            },
            {
              where: {
                id: req.body.id,
              },
            }
          );
          res.send({
            status: "success",
            message: "done",
          });
        } catch (error) {
          res.send({
            status: "error",
            message: error,
          });
        }
      }
    );

    app.post(
      "/pharmacies/deleteorder",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          await db.order.destroy({
            where: {
              id: req.body.id,
            },
          });
          res.send({
            status: "success",
            message: "Deleted Successfully",
          });
        } catch (error) {
          res.send({
            status: "error",
            message: error,
          });
        }
      }
    );

    app.post(
      "/pharmacies/bulkdeleteorder",
      roleService.verifyRole(role),
      async function (req, res) {
        if (!req.body.ids || !Array.isArray(req.body.ids)) {
          return res.send({
            status: "error",
            message: "Please send ids as array",
          });
        }

        try {
          await db.order.destroy({
            where: {
              id: {
                [Op.in]: req.body.ids,
              },
            },
          });
          res.send({
            status: "success",
            message: "Deleted Successfully",
          });
        } catch (error) {
          res.send({
            status: "error",
            message: error,
          });
        }
      }
    );

    app.post(
      "/pharmacies/getorders",
      roleService.verifyRole(role),
      async function (req, res) {
        let where = {
          user_id: +req.pharmacy_user_id,
        };
        const order = req.body.order ? req.body.order : "id";
        const order_by = req.body.order_by ? req.body.order_by : "DESC";
        let order_arr = [];

        if (order.indexOf(".") >= 0) {
          const tempArr = order.split(".");
          tempArr.push(order_by);
          order_arr = [tempArr];
        } else {
          order_arr = [[order, order_by]];
        }

        if (req.body.uuid != null) where["uuid"] = req.body.uuid;

        if (req.body.has_prescription != null)
          where["has_prescription"] = req.body.has_prescription;

        if (req.body.hospital_id != null)
          where["hospital_id"] = req.body.hospital_id;

        if (req.body.order_type != null)
          where["order_type"] = +req.body.order_type;

        if (req.body.hospital_department_id != null)
          where["hospital_department_id"] = +req.body.hospital_department_id;

        if (req.body.hospital_prescription_id != null)
          where["hospital_prescription_id"] = req.body.hospital_prescription_id;

        if (req.body.hospital_patient_id != null)
          where["hospital_patient_id"] = req.body.hospital_patient_id;

        if (req.body.discount != null) where["discount"] = req.body.discount;

        if (req.body.status != null) where["status"] = req.body.status;

        if (req.body.order_date != null)
          where["order_date"] = req.body.order_date;

        try {
          let { rows, count } = await db.order.findAndCountAll({
            where: where,
            offset: req.body.offset ? +req.body.offset : null,
            limit: req.body.limit ? +req.body.limit : 25,
            order: order_arr,
            include: [
              {
                model: db.patient_details,
                as: "patient_details",
              },
              {
                model: db.insurance_company,
                as: "insurance_company",
              },
              {
                model: db.hospital_department,
                as: "hospital_department",
              },
            ],
          });
          const transaction = await db.transaction.findAll();
          let transactionObj = {};

          for (let i = 0; i < transaction.length; i++) {
            transactionObj[transaction[i].order_id] = transaction[i].dataValues;
          }

          for (let i = 0; i < rows.length; i++) {
            if (transactionObj[rows[i].id]) {
              rows[i]["dataValues"]["trans"] = transactionObj[rows[i].id];
            }
          }

          res.send({ rows, count });
        } catch (error) {
          console.log(error);
          res.send({
            status: "error",
            message: "Something went wrong",
          });
        }
      }
    );

    app.post(
      "/pharmacies/updateorderstatus",
      roleService.verifyRole(role),
      async function (req, res) {
        const { order_id, status, message } = req.body;

        try {
          await db.order.update(
            {
              status: +status,
              comments: message,
            },
            {
              where: {
                id: order_id,
                user_id: +req.pharmacy_user_id,
              },
            }
          );

          if (status == 2) {
            const checkExist = await db.order.findOne({
              where: {
                id: order_id,
                user_id: +req.pharmacy_user_id,
              },
              include: [
                {
                  model: db.order_item,
                  as: "order_items",
                },
              ],
            });

            if (checkExist.order_items) {
              for (let i = 0; i < checkExist.order_items.length; i++) {
                let oi = checkExist.order_items[i];
                if (oi.drug_code) {
                  const drug_item = await db.drug.findOne({
                    where: {
                      user_id,
                      drug_code: oi.drug_code,
                    },
                  });
                  drug_item.available_quantity =
                    drug_item.available_quantity + parseInt(oi.quantity);
                  await drug_item.save();
                }
              }
            }
          }
          return res.send({
            status: "success",
            message: "done",
          });
        } catch (error) {
          console.log(error);
          res.send({
            status: "error",
            message: "Something went wrong",
          });
        }
      }
    );
    app.post(
      "/pharmacies/getorder",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          const order = await db.order.findOne({
            where: {
              id: req.body.id,
              user_id: req.pharmacy_user_id,
            },
            include: [],
            attributes: [
              "id",
              "uuid",
              "has_prescription",
              "hospital_id",
              "hospital_prescription_id",
              "hospital_patient_id",
              "discount",
              "status",
              "order_date",
            ],
          });
          res.send(order);
        } catch (error) {
          console.log(error);
          res.send({
            status: "error",
            message: "Something went wrong",
          });
        }
      }
    );
  },
};
