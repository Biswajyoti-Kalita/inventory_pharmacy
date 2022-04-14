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
    const hospital_prefix = 110000;
    const toLowerCase = (string) => {
      return string.toLowerCase();
    };
    app.post("/emr/adduser", async function (req, res) {
      try {
        if (
          req.body.hospital_id === null ||
          req.body.hospital_id === undefined
        ) {
          return res.send({
            status: "error",
            message: " Hospital Id is required ",
          });
        }

        const role_id = 1,
          is_owner = 0,
          pharmacy_user_id = hospital_prefix + parseInt(req.body.hospital_id);

        if (req.body.first_name === null || req.body.first_name === undefined)
          return res.send({
            status: "error",
            message: " First Name is required ",
          });

        if (req.body.email === null || req.body.email === undefined)
          return res.send({
            status: "error",
            message: " Email is required ",
          });

        if (req.body.password === null || req.body.password === undefined)
          return res.send({
            status: "error",
            message: " Password is required ",
          });

        const lastIndexUser = await db.user.findAll({});

        //           id: lastIndexUser ? lastIndexUser.id + 1 : 1,
        console.log(lastIndexUser);
        await db.user.create({
          id: lastIndexUser[0]
            ? lastIndexUser[lastIndexUser.length - 1].id + 1
            : 1,
          first_name: req.body.first_name,
          last_name: req.body.last_name ? req.body.last_name : "",
          phone: req.body.phone ? req.body.phone : "",
          email: req.body.email,
          role_id: role_id,
          permissions: "4",
          is_owner: is_owner,
          pharmacy_user_id: pharmacy_user_id,
          username: randomstring.generate(),
          password: await passwordService.hashPassword(req.body.password),
        });
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
    });
    app.post("/pharmacy/addmanager", async function (req, res) {
      try {
        const role_id = 1,
          is_owner = 1;

        if (req.body.first_name === null || req.body.first_name === undefined)
          return res.send({
            status: "error",
            message: " First Name is required ",
          });

        if (req.body.email === null || req.body.email === undefined)
          return res.send({
            status: "error",
            message: " Email is required ",
          });

        if (req.body.password === null || req.body.password === undefined)
          return res.send({
            status: "error",
            message: " Password is required ",
          });

        const lastIndexUser = await db.user.findAll({});

        //           id: lastIndexUser ? lastIndexUser.id + 1 : 1,
        console.log(lastIndexUser);
        await db.user.create({
          id: lastIndexUser[0]
            ? lastIndexUser[lastIndexUser.length - 1].id + 1
            : 1,
          first_name: req.body.first_name,
          last_name: req.body.last_name ? req.body.last_name : "",
          phone: req.body.phone ? req.body.phone : "",
          email: req.body.email,
          role_id: role_id,
          permissions: "3",
          is_owner: is_owner,
          username: randomstring.generate(),
          password: await passwordService.hashPassword(req.body.password),
        });
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
    });
    app.post("/pharmacy/getmanagers", async function (req, res) {
      try {
        const list = await db.user.findAll({
          where: {
            is_owner: 1,
            role_id: 1,
          },
          attributes: ["id", "first_name", "last_name", "phone", "email"],
        });

        res.send(list);
      } catch (error) {
        console.log(error);
        res.send({
          status: "error",
          message: error,
        });
      }
    });
    app.post("/pharmacy/deletemanager", async function (req, res) {
      try {
        if (req.body.id === null || req.body.id === undefined) {
          return res.send({
            status: "error",
            message: "Id is required",
          });
        }

        await db.user.destroy({
          where: {
            id: req.body.id,
            role_id: 1,
          },
        });

        res.send({
          status: "success",
          message: "Done",
        });
      } catch (error) {
        console.log(error);
        res.send({
          status: "error",
          message: error,
        });
      }
    });

    app.post("/emr/inventory/:offset", async function (req, res) {
      try {
        const offset = req.params.offset ? req.params.offset : 0;
        const { code, name, limit, category, hospital_id } = req.body;
        console.log({ code, name, limit });

        let where = {
          user_id: hospital_prefix + parseInt(hospital_id),
        };
        let where2 = {};

        if (category) {
          where2 = {
            [Op.and]: [
              Sequelize.literal(
                "lower(name) like '%" + toLowerCase(req.body.category) + "%' "
              ),
            ],
          };
        }

        if (code) {
          where = {
            ...where,
            [Op.and]: [
              Sequelize.literal(
                "lower(drug_code) like '%" + toLowerCase(req.body.code) + "%' "
              ),
            ],
          };
        }

        if (name) {
          where = {
            ...where,
            [Op.and]: [
              Sequelize.literal(
                "lower(drug_name) like '%" + toLowerCase(req.body.name) + "%' "
              ),
            ],
          };
        }
        console.log(where);

        const data = await db.drug.findAndCountAll({
          where,
          offset: offset,
          limit: limit ? +limit : 25,
          attributes: [
            "id",
            "medication",
            "ingredient",
            "description",
            "brand",
            "available_quantity",
            "reorder_quantity",
            ["drug_code", "code"],
            ["drug_name", "name"],
            "expiration_date",
            "semantic_brand_name",
            ["selling_price", "price"],
          ],
          include: [
            {
              model: db.category,
              as: "category",
              where: where2,
              attributes: ["name"],
            },
          ],
        });
        return res.send({
          total_item: data.count,
          current_page: offset,
          data: data.rows,
        });
      } catch (error) {
        console.log(error);
        res.send({
          status: "error",
          message: error,
        });
      }
    });
    app.post("/emr/addorder", async function (req, res) {
      try {
        let total_price = 0;
        let status = 3;
        let inventory_drugs = {};
        let hospital_department_id = null;

        const { hospital_id, hospital_name, drugs, department, requested_by } =
          req.body;
        let user_id = hospital_prefix + parseInt(hospital_id);

        if (department) {
          let checkExist1 = await db.hospital_department.findOne({
            where: {
              name: department,
            },
          });
          if (checkExist1) hospital_department_id = checkExist1.id;
          else {
            let createNew1 = await db.hospital_department.create({
              name: department,
            });
            hospital_department_id = createNew1.id;
          }
        }

        for (let item in drugs) {
          let drug_item = drugs[item];
          let checkExist = await db.drug.findOne({
            where: {
              user_id,
              drug_code: drug_item.code,
            },
          });

          if (!checkExist) {
            return res.send({
              status: "error",
              message:
                "Code " + drug_item.code + "  does not exist in inventory",
            });
          }
          total_price +=
            parseFloat(checkExist.selling_price) * parseInt(drug_item.quantity);

          inventory_drugs[drug_item.code] = {
            drug_name: checkExist.drug_name,
            drug_code: checkExist.drug_code,
            drug_id: checkExist.id,
          };
          inventory_drugs[drug_item.code]["total_price"] =
            parseFloat(checkExist.selling_price) * parseInt(drug_item.quantity);
          inventory_drugs[drug_item.code]["quantity"] = parseInt(
            drug_item.quantity
          );

          checkExist.available_quantity =
            checkExist.available_quantity - parseInt(drug_item.quantity);
          await checkExist.save();
        }

        console.log("inventory_drugs ", inventory_drugs);

        const data2 = await db.order.create({
          user_id,
          hospital_id: hospital_id ? hospital_id : null,
          hospital_name: hospital_name,
          discount: 0,
          amount: total_price,
          hospital_department_id,
          requested_by,
          status: status,
          order_type: 1,
        });

        for (let item in drugs) {
          let drug_item = inventory_drugs[drugs[item].code];

          console.log("\n\n=>", {
            user_id,
            drug_code: drug_item.drug_code,
            drug_name: drug_item.drug_name,
            price: drug_item.total_price,
            quantity: drug_item.quantity,
            order_id: data2.id,
            returned: 0,
          });
          await db.order_item.create({
            user_id,
            drug_code: drug_item.drug_code,
            drug_name: drug_item.drug_name,
            drug_id: drug_item.drug_id,
            price: drug_item.total_price,
            quantity: drug_item.quantity,
            order_id: data2.id,
            returned: 0,
          });
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
    });

    app.post("/emr/orders/:offset", async function (req, res) {
      try {
        const offset = req.params.offset ? +req.params.offset : 0;
        const {
          hospital_id,
          limit,
          department,
          status,
          category,
          order_date,
          requested_by,
        } = req.body;
        let user_id = hospital_prefix + parseInt(hospital_id);
        let where = {
          user_id,
          hospital_id,
        };

        if (requested_by) {
          where = {
            ...where,
            [Op.and]: [
              Sequelize.literal(
                ` lower(requested_by) like '%${toLowerCase(requested_by)}%' `
              ),
            ],
          };
        }
        if (order_date) {
          let datecheck = new Date(order_date);
          var timestamp = Date.parse(datecheck);
          if (isNaN(timestamp)) {
            return res.send({
              status: "error",
              message: "Please provide order_date in format yyyy-mm-dd",
            });
          }

          where = {
            ...where,
            [Op.and]: [
              Sequelize.literal(`DATE("order"."createdAt") = '${order_date}' `),
            ],
          };
        }

        if (status) {
          switch (toLowerCase(status)) {
            case "ordered":
              where["status"] = 0;
              break;
            case "delivered":
              where["status"] = 1;
              break;
            case "cancelled":
              where["status"] = 2;
              break;
            case "requested":
              where["status"] = 3;
              break;
            case "accepted":
              where["status"] = 4;
              break;
            case "preparing":
              where["status"] = 5;
              break;
            case "shipped":
              where["status"] = 6;
              break;
            case "fulfilled":
              where["status"] = 7;
              break;
          }
        }

        let where2 = {};
        let where3 = {};
        if (category) {
          where3 = {
            [Op.and]: [
              Sequelize.literal(
                "lower(name) like '%" + toLowerCase(category) + "%' "
              ),
            ],
          };
        }

        if (department) {
          const departments = await db.hospital_department.findAll({
            where: {
              [Op.and]: [
                Sequelize.literal(
                  "lower(name) like '%" +
                    toLowerCase(req.body.department) +
                    "%' "
                ),
              ],
            },
          });
          let arr = [];
          console.log(departments);
          if (departments && departments[0]) {
            departments.map((d) => {
              arr.push(d.id);
            });

            where["hospital_department_id"] = {
              [Op.in]: arr,
            };
          }
          console.log(arr);
        }

        if (!hospital_id) {
          return res.send({
            status: "error",
            message: "Hospital Id is required",
          });
        }
        const countData = await db.order.findAll({
          where,
        });

        console.log(
          "\n\nwhere 1 ",
          where,
          " \nwhere 2",
          where2,
          "\nwhere3",
          where3
        );

        const data = await db.order.findAndCountAll({
          where: where,
          order: [["id", "DESC"]],
          offset,
          limit: limit ? +limit : 25,
          attributes: [
            "id",
            "amount",
            "status",
            "createdAt",
            "comments",
            "requested_by",
          ],
          include: [
            {
              model: db.hospital_department,
              as: "hospital_department",
              attributes: ["name"],
              required: false,
            },
            {
              model: db.order_item,
              as: "order_items",
              attributes: [
                "id",
                ["drug_code", "code"],
                ["drug_name", "name"],
                "quantity",
                ["price", "total_price"],
              ],
              include: [
                {
                  model: db.drug,
                  as: "drug",
                  required: false,
                  include: [
                    {
                      model: db.category,
                      as: "category",
                      where: where3,
                    },
                  ],
                },
              ],
            },
          ],
        });

        console.log(data);
        let rows = data.rows?.map((item) => {
          let oi = item.order_items?.map((i) => {
            console.log("\n\n values ", i.dataValues.code);
            return {
              id: i.id,
              code: i.dataValues.code,
              name: i.dataValues.name,
              quantity: i.dataValues.quantity,
              total_price: i.dataValues.total_price,
              category: i.drug
                ? i.drug.category
                  ? i.drug.category.name
                  : ""
                : "",
            };
          });
          return {
            id: item.id,
            amount: item.amount,
            createdAt: item.createdAt,
            requested_by: item.requested_by,
            department: item.hospital_department
              ? item.hospital_department.name
              : "",
            status: [
              "Ordered",
              "Delivered",
              "Cancelled",
              "Requested",
              "Accepted",
              "Preparing",
              "Shipped",
              "Fulfilled",
            ][item.status],
            cancelled_message: item.comments ? item.comments : "",
            order_items: oi,
          };
        });
        res.send({
          total_item: countData.length,
          current_page: offset,
          data: rows,
        });
      } catch (error) {
        console.log(error);
        res.send({
          status: "error",
          message: error,
        });
      }
    });
    app.post("/emr/order", async function (req, res) {
      try {
        const { hospital_id, order_id } = req.body;
        let user_id = hospital_prefix + parseInt(hospital_id);
        let where = {
          user_id,
          hospital_id,
          id: order_id,
        };

        if (!order_id) {
          return res.send({
            status: "error",
            message: "Order Id is required",
          });
        }
        if (!hospital_id) {
          return res.send({
            status: "error",
            message: "Hospital Id is required",
          });
        }
        const item = await db.order.findOne({
          where: where,
          attributes: ["id", "amount", "status", "createdAt", "comments"],
          include: [
            {
              model: db.hospital_department,
              as: "hospital_department",
              attributes: ["name"],
              required: false,
            },
            {
              model: db.order_item,
              as: "order_items",
              attributes: [
                "id",
                ["drug_code", "code"],
                ["drug_name", "name"],
                "quantity",
                ["price", "total_price"],
              ],
              include: [
                {
                  model: db.drug,
                  as: "drug",
                  required: false,
                  include: [
                    {
                      model: db.category,
                      as: "category",
                    },
                  ],
                },
              ],
            },
          ],
        });

        let oi = item.order_items?.map((i) => {
          return {
            id: i.id,
            code: i.dataValues.code,
            name: i.dataValues.name,
            quantity: i.dataValues.quantity,
            total_price: i.dataValues.total_price,
            category: i.drug
              ? i.drug.category
                ? i.drug.category.name
                : ""
              : "",
          };
        });
        return res.send({
          id: item.id,
          amount: item.amount,
          cancelled_message: item.comments ? item.comments : "",
          createdAt: item.createdAt,
          department: item.hospital_department
            ? item.hospital_department.name
            : "",
          status: [
            "Ordered",
            "Delivered",
            "Cancelled",
            "Requested",
            "Accepted",
            "Preparing",
            "Shipped",
            "Fulfilled",
          ][item.status],
          order_items: oi,
        });
      } catch (error) {
        console.log(error);
        res.send({
          status: "error",
          message: error,
        });
      }
    });

    app.post("/emr/fulfillorderitem", async function (req, res) {
      try {
        const { order_id, hospital_id } = req.body;
        let user_id = hospital_prefix + parseInt(hospital_id);

        const checkExist = await db.order.findOne({
          where: {
            id: order_id,
            user_id,
          },
        });

        if (!checkExist) {
          return res.send({
            status: "error",
            message: "Order not found",
          });
        }

        await db.order.update(
          {
            status: 7,
          },
          {
            where: {
              id: order_id,
              user_id,
            },
          }
        );

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
    });
    app.post("/emr/cancelorder", async function (req, res) {
      try {
        const { order_id, message, hospital_id } = req.body;
        let user_id = hospital_prefix + parseInt(hospital_id);

        const checkExist = await db.order.findOne({
          where: {
            id: order_id,
            user_id,
          },
          include: [
            {
              model: db.order_item,
              as: "order_items",
            },
          ],
        });

        if (!checkExist) {
          return res.send({
            status: "error",
            message: "Order not found",
          });
        }

        console.log("\n\n\n cancel order ", checkExist);

        await db.order.update(
          {
            status: 2,
            comments: message,
          },
          {
            where: {
              id: order_id,
              user_id,
            },
          }
        );
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
    });

    app.post("/emr/getcategories", async function (req, res) {
      let where = {};

      try {
        const categorys = await db.category.findAll({
          where: where,
          attributes: ["id", "name"],
        });
        res.send(categorys);
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
