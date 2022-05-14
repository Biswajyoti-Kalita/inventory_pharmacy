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

          res.send({
            status: "success",
            message: "done",
          });
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
          const orders = await db.order.findAndCountAll({
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
          res.send(orders);
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
