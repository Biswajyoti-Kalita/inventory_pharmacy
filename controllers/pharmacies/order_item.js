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
      "/pharmacies/addorder_item",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          if (req.body.drug_code === null || req.body.drug_code === undefined)
            return res.send({
              status: "error",
              message: " Drug Code is required ",
            });

          if (req.body.quantity === null || req.body.quantity === undefined)
            return res.send({
              status: "error",
              message: " Quantity is required ",
            });

          if (req.body.returned === null || req.body.returned === undefined)
            return res.send({
              status: "error",
              message: " Returned is required ",
            });

          await db.order_item.create({
            drug_code: req.body.drug_code,

            quantity: req.body.quantity,

            returned: req.body.returned,
          });
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
      "/pharmacies/updateorder_item",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          await db.order_item.update(
            {
              drug_code: req.body.drug_code,

              quantity: req.body.quantity,

              returned: req.body.returned,
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
      "/pharmacies/deleteorder_item",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          await db.order_item.destroy({
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
      "/pharmacies/bulkdeleteorder_item",
      roleService.verifyRole(role),
      async function (req, res) {
        if (!req.body.ids || !Array.isArray(req.body.ids)) {
          return res.send({
            status: "error",
            message: "Please send ids as array",
          });
        }

        try {
          await db.order_item.destroy({
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
      "/pharmacies/get_all_order_items",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          const order_items = await db.order_item.findAll({
            where: {
              order_id: +req.body.order_id,
            },
          });
          res.send(order_items);
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
      "/pharmacies/accept_order_items",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          const { order_id } = req.body;

          await db.order.update(
            {
              status: 4,
            },
            {
              where: {
                id: order_id,
              },
            }
          );

          return res.send({
            status: "success",
            message: "",
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
      "/pharmacies/dispense_order_items",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          const {
            order_id,
            payment_type,
            cheque_no,
            bank_name,
            account_holder_name,
            cheque_date,
            transaction_id,
            additional_information,
          } = req.body;

          if (cheque_date) {
            let datecheck2 = new Date(cheque_date);
            var timestamp2 = Date.parse(datecheck2);
            if (isNaN(timestamp2)) {
              return res.send({
                status: "error",
                message: "Please provide cheque date in format yyyy-mm-dd",
              });
            }
          }

          await db.order.update(
            {
              payment_type: +payment_type,
              cheque_no,
              bank_name,
              account_holder_name,
              cheque_date: cheque_date ? cheque_date : null,
              transaction_id,
              additional_information,
              status: 1,
            },
            {
              where: {
                id: order_id,
              },
            }
          );

          return res.send({
            status: "success",
            message: "",
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
      "/pharmacies/getorder_items",
      roleService.verifyRole(role),
      async function (req, res) {
        let where = {};
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
          const order_items = await db.order_item.findAndCountAll({
            where: where,
            offset: req.body.offset ? +req.body.offset : null,
            limit: req.body.limit ? +req.body.limit : 25,
            order: order_arr,
            include: [],
          });
          res.send(order_items);
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
      "/pharmacies/getorder_item",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          const order_item = await db.order_item.findOne({
            where: {
              id: req.body.id,
            },
            include: [],
            attributes: ["id", "drug_code", "quantity", "returned"],
          });
          res.send(order_item);
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
