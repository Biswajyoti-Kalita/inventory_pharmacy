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

module.exports = {
  initializeApi: function (app) {
    const basic_attributes = ["createdAt", "updatedAt"];

    const role = 1;
    app.post(
      "/pharmacies/addpurchase_drug_item",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          let { bill_id, vendor_id, purchase_date, items } = req.body;
          console.log("\n\n\n\n\n purchase add ");

          for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let datecheck = new Date(item.expiration_date);
            var timestamp = Date.parse(datecheck);
            if (isNaN(timestamp)) {
              return res.send({
                status: "error",
                message: "Please provide date in format yyyy-mm-dd",
              });
            }
          }

          console.log(bill_id, vendor_id, purchase_date, items);

          if (bill_id === null || bill_id === undefined) {
            return res.send({
              status: "error",
              message: "Please send bill id",
            });
          }

          if (vendor_id === null || vendor_id === undefined) {
            return res.send({
              status: "error",
              message: "Please send vendor id",
            });
          }

          if (purchase_date === null || purchase_date === undefined) {
            return res.send({
              status: "error",
              message: "Please send purchase_date",
            });
          }
          let datecheck2 = new Date(purchase_date);
          var timestamp2 = Date.parse(datecheck2);
          if (isNaN(timestamp2)) {
            return res.send({
              status: "error",
              message: "Please provide purchase date in format yyyy-mm-dd",
            });
          }

          let existingDrugs = {};

          const drugArr = await db.drug.findAll();

          drugArr?.map((item) => {
            existingDrugs[item.drug_code] = 1;
          });

          items.map((item) => {
            if (!existingDrugs[item.drug_code]) {
              return res.send({
                status: "error",
                message: "Drug Code " + item.drug_code + " does not exist",
              });
            }
          });

          const data1 = await db.purchase_drug.create({
            user_id: req.pharmacy_user_id,
            vendor_id: vendor_id,
            bill_id: bill_id,
            purchase_date: purchase_date,
          });
          console.log(data1);
          let newItemList = [];

          for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let item_obj = {
              ...item,
              purchase_drug_id: data1.id,
              user_id: req.pharmacy_user_id,
            };
            item_obj["expiration_date"] = new Date(item.expiration_date);
            newItemList.push(item_obj);
          }

          console.log("new items ", newItemList);
          const data2 = await db.purchase_drug_item.bulkCreate(newItemList);

          for (let i = 0; i < items.length; i++) {
            console.log("\n find drug ", items[i].drug_code);
            const tempDrug = await db.drug.findOne({
              where: {
                drug_code: items[i].drug_code,
                user_id: req.pharmacy_user_id,
              },
            });

            console.log("\n found ", tempDrug);
            if (tempDrug) {
              console.log(
                "\n quan ",
                tempDrug.available_quantity,
                " cp ",
                tempDrug.cost_price,
                tempDrug.selling_price,
                tempDrug.expiration_date
              );

              tempDrug.available_quantity =
                tempDrug.available_quantity + parseInt(items[i].quantity);
              tempDrug.cost_price = parseFloat(items[i].cost_price);
              tempDrug.selling_price = parseFloat(items[i].selling_price);
              if (items[i].expiration_date) {
                tempDrug.expiration_date = items[i].expiration_date;
              }
              await tempDrug.save();
            }
          }
          console.log(data2);
          /*
            purchase_drug_id: req.body.purchase_drug_id,
            drug_code: req.body.drug_code,
            quantity: req.body.quantity,
            returned: 0,
*/

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

    app.post(
      "/pharmacies/updatepurchase_drug_item",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          await db.purchase_drug_item.update(
            {
              drug_code: req.body.drug_code,

              quantity: req.body.quantity,

              returned: req.body.returned,
            },
            {
              where: {
                id: req.body.id,

                user_id: req.pharmacy_user_id,
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
      "/pharmacies/deletepurchase_drug_item",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          const purchase_drug_item = await db.purchase_drug_item.findOne({
            id: req.body.id,
            user_id: req.pharmacy_user_id,
          });

          if (!purchase_drug_item) {
            return res.send({
              status: "error",
              message: "Purchase Drug Item not found",
            });
          }

          if (
            purchase_drug_item.quantity &&
            parseInt(purchase_drug_item.quantity)
          ) {
            const drugItem = await db.drug.findOne({
              where: {
                drug_code: purchase_drug_item.drug_code,
              },
            });

            if (drugItem) {
              drugItem.available_quantity =
                drugItem.available_quantity -
                parseInt(purchase_drug_item.quantity);
            }
            drugItem.save();
          }

          await db.purchase_drug_item.destroy({
            where: {
              id: req.body.id,
              user_id: req.pharmacy_user_id,
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
      "/pharmacies/bulkdeletepurchase_drug_item",
      roleService.verifyRole(role),
      async function (req, res) {
        if (!req.body.ids || !Array.isArray(req.body.ids)) {
          return res.send({
            status: "error",
            message: "Please send ids as array",
          });
        }

        try {
          await db.purchase_drug_item.destroy({
            where: {
              id: {
                [Op.in]: req.body.ids,
              },

              user_id: req.pharmacy_user_id,
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
      "/pharmacies/getpurchase_drug_items",
      roleService.verifyRole(role),
      async function (req, res) {
        let where = {
          user_id: req.pharmacy_user_id,
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

        if (req.body.drug_code != null) where["drug_code"] = req.body.drug_code;

        if (req.body.quantity != null) where["quantity"] = req.body.quantity;

        if (req.body.returned != null) where["returned"] = req.body.returned;

        try {
          const purchase_drug_items =
            await db.purchase_drug_item.findAndCountAll({
              where: where,
              offset: req.body.offset ? +req.body.offset : null,
              limit: req.body.limit ? +req.body.limit : 25,
              order: order_arr,
              include: [
                {
                  model: db.purchase_drug,
                  as: "purchase_drug",
                  include: [
                    {
                      model: db.vendor,
                      as: "vendor",
                    },
                  ],
                },
              ],
            });
          res.send(purchase_drug_items);
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
      "/pharmacies/getpurchase_drug_item",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          const purchase_drug_item = await db.purchase_drug_item.findOne({
            where: {
              id: req.body.id,

              user_id: req.pharmacy_user_id,
            },
            include: [
              {
                model: db.purchase_drug,
                as: "purchase_drug",
              },
            ],
            attributes: ["id", "drug_code", "quantity", "returned"],
          });
          res.send(purchase_drug_item);
        } catch (error) {
          console.log(error);
          res.send({
            status: "error",
            message: "Something went wrong",
          });
        }
      }
    );

    app.get("/pharmacies/purchaseCSVformat", async function (req, res) {
      try {
        const csv =
          "drug_code,quantity,expiration_date,cost_price,selling_price\n";
        return res
          .set({
            "Content-Type": "text/csv",
            "Content-Disposition": 'attachment; filename="export.csv"',
          })
          .send(csv);
      } catch (error) {
        console.log(error);
        res.send({
          status: "error",
          message: "Something went wrong",
        });
      }
    });
  },
};
