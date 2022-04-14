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
const csvService = require("../../services/csvService");

module.exports = {
  initializeApi: function (app) {
    const basic_attributes = ["createdAt", "updatedAt"];

    const role = 1;
    app.post(
      "/pharmacies/adddrug",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          if (req.body.drug_code === null || req.body.drug_code === undefined)
            return res.send({
              status: "error",
              message: " Drug Code/Product Code is required ",
            });

          if (req.body.drug_name === null || req.body.drug_name === undefined)
            return res.send({
              status: "error",
              message: " Drug Name/Product Name is required ",
            });

          if (
            req.body.available_quantity === null ||
            req.body.available_quantity === undefined
          )
            return res.send({
              status: "error",
              message: " Available Quantity is required ",
            });

          if (req.body.cost_price === null || req.body.cost_price === undefined)
            return res.send({
              status: "error",
              message: " Cost Price is required ",
            });

          if (
            req.body.selling_price === null ||
            req.body.selling_price === undefined
          )
            return res.send({
              status: "error",
              message: " Selling Price is required ",
            });

          if (+req.body.category_id === 0) {
            if (
              req.body.medication === null ||
              req.body.medication === undefined
            )
              return res.send({
                status: "error",
                message: " Medication is required ",
              });

            if (
              req.body.ingredient === null ||
              req.body.ingredient === undefined
            )
              return res.send({
                status: "error",
                message: " Ingredient is required ",
              });

            if (req.body.batch_no === null || req.body.batch_no === undefined)
              return res.send({
                status: "error",
                message: " Batch No is required ",
              });

            if (
              req.body.reorder_quantity === null ||
              req.body.reorder_quantity === undefined
            )
              return res.send({
                status: "error",
                message: " Reorder Quantity is required ",
              });

            if (
              req.body.expiration_date === null ||
              req.body.expiration_date === undefined
            )
              return res.send({
                status: "error",
                message: " Expiration Date is required ",
              });

            if (
              req.body.semantic_brand_name === null ||
              req.body.semantic_brand_name === undefined
            )
              return res.send({
                status: "error",
                message: " Semantic Brand Name is required ",
              });
          }

          if (req.body.expiration_date) {
            var timestamp = Date.parse(new Date(req.body.expiration_date));

            if (isNaN(timestamp)) {
              return res.send({
                status: "error",
                message: "Please provide date in format yyyy-mm-dd",
              });
            }
          }

          // const checkExist = await db.drug.findOne({
          //   drug_code: req.body.drug_code,
          // });

          // if (checkExist) {
          //   return res.send({
          //     status: "error",
          //     message: "Drug/Product code already exist",
          //   });
          // }
          await db.drug.create({
            user_id: req.pharmacy_user_id,
            medication: req.body.medication,
            description: req.body.description,
            category_id: req.body.category_id,
            brand: req.body.brand,
            ingredient: req.body.ingredient,
            drug_code: req.body.drug_code,
            drug_name: req.body.drug_name,
            available_quantity: req.body.available_quantity,
            batch_no: req.body.batch_no,
            reorder_quantity: req.body.reorder_quantity,
            expiration_date: req.body.expiration_date
              ? req.body.expiration_date
              : null,
            semantic_brand_name: req.body.semantic_brand_name,
            cost_price: req.body.cost_price,
            selling_price: req.body.selling_price,
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
      }
    );

    app.post(
      "/pharmacies/updatedrug",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          if (req.body.expiration_date) {
            var timestamp = Date.parse(new Date(req.body.expiration_date));

            if (isNaN(timestamp)) {
              return res.send({
                status: "error",
                message: "Please provide date in format yyyy-mm-dd",
              });
            }
          }
          await db.drug.update(
            {
              medication: req.body.medication,
              description: req.body.description,
              brand: req.body.brand,
              category_id: +req.body.category_id,
              ingredient: req.body.ingredient,
              drug_code: req.body.drug_code,
              drug_name: req.body.drug_name,
              available_quantity: req.body.available_quantity,
              batch_no: req.body.batch_no,
              reorder_quantity: req.body.reorder_quantity,
              expiration_date: req.body.expiration_date
                ? req.body.expiration_date
                : null,
              semantic_brand_name: req.body.semantic_brand_name,
              cost_price: req.body.cost_price,
              selling_price: req.body.selling_price,
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
          console.log(error);
          res.send({
            status: "error",
            message: error,
          });
        }
      }
    );

    app.post(
      "/pharmacies/deletedrug",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          await db.drug.destroy({
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
      "/pharmacies/bulkdeletedrug",
      roleService.verifyRole(role),
      async function (req, res) {
        if (!req.body.ids || !Array.isArray(req.body.ids)) {
          return res.send({
            status: "error",
            message: "Please send ids as array",
          });
        }

        try {
          await db.drug.destroy({
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
      "/pharmacies/getdrugs",
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

        if (req.body.medication != null)
          where["medication"] = req.body.medication;

        if (req.body.brand != null) where["brand"] = req.body.brand;

        if (req.body.category_id != null) {
          where["category_id"] = +req.body.category_id;
        }

        if (req.body.ingredient != null)
          where["ingredient"] = req.body.ingredient;

        if (req.body.drug_code != null) where["drug_code"] = req.body.drug_code;

        if (req.body.drug_name != null)
          where["drug_name"] = {
            [Op.like]: "%" + req.body.drug_name + "%",
          };
        if (req.body.available_quantity != null)
          where["available_quantity"] = req.body.available_quantity;

        if (req.body.batch_no != null) where["batch_no"] = req.body.batch_no;

        if (req.body.reorder_quantity != null)
          where["reorder_quantity"] = req.body.reorder_quantity;

        if (req.body.expiration_date != null)
          where["expiration_date"] = req.body.expiration_date;

        if (req.body.semantic_brand_name != null)
          where["semantic_brand_name"] = req.body.semantic_brand_name;

        if (req.body.cost_price != null)
          where["cost_price"] = req.body.cost_price;

        if (req.body.selling_price != null)
          where["selling_price"] = req.body.selling_price;

        try {
          const drugs = await db.drug.findAndCountAll({
            where: where,
            offset: req.body.offset ? +req.body.offset : null,
            limit: req.body.limit ? +req.body.limit : 25,
            order: order_arr,
            include: [
              {
                model: db.category,
                as: "category",
              },
            ],
          });
          res.send(drugs);
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
      "/pharmacies/getdrug",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          console.log("find drug code ", req.body.drug_code);
          const drug = await db.drug.findOne({
            where: {
              drug_code: req.body.drug_code,

              user_id: req.pharmacy_user_id,
            },
            include: [
              {
                model: db.category,
                as: "category",
              },
            ],
            attributes: [
              "id",
              "medication",
              "brand",
              "description",
              "category_id",
              "ingredient",
              "drug_code",
              "drug_name",
              "available_quantity",
              "batch_no",
              "reorder_quantity",
              "expiration_date",
              "semantic_brand_name",
              "cost_price",
              "selling_price",
            ],
          });
          console.log("=>", drug);
          if (drug) res.send(drug);
          else res.send({});
        } catch (error) {
          console.log(error);
          res.send({
            status: "error",
            message: "Something went wrong",
          });
        }
      }
    );

    app.get("/pharmacies/drugcsvformat", async function (req, res) {
      const csv =
        "category_id,medication,ingredient,drug_code,drug_name,brand,available_quantity,batch_no,reorder_quantity,expiration_date,semantic_brand_name,cost_price,selling_price,description\n";
      return res
        .set({
          "Content-Type": "text/csv",
          "Content-Disposition": 'attachment; filename="export.csv"',
        })
        .send(csv);
    });

    app.post(
      "/pharmacies/importdrug",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          let drugsObj = {};
          const existingDrugs = await db.drug.findAll({
            where: {
              user_id: req.pharmacy_user_id,
            },
          });
          const { data } = req.body;
          existingDrugs?.map((item) => {
            drugsObj[item.drug_code] = 1;
          });

          for (let i = 0; i < data.length; i++) {
            let x = data[i];
            var timestamp = Date.parse(new Date(x.expiration_date));
            console.log(" timestamp ", timestamp, "  ", x);
            if (isNaN(timestamp)) {
              return res.send({
                status: "error",
                message: "Please provide date in format yyyy-mm-dd",
              });
            }
          }

          for (let i = 0; i < data.length; i++) {
            if (!data[i]) return;

            if (drugsObj[data[i].drug_code]) {
              let newObject = {
                user_id: req.pharmacy_user_id,
                ...data[i],
              };
              if (data[i].category_id) {
                newObject["category_id"] = +data[i].category_id;
              } else {
                newObject["category_id"] = null;
              }
              let drug_code = newObject["drug_code"];
              delete newObject["drug_code"];
              delete newObject["available_quantity"];
              newObject.expiration_date = new Date(newObject.expiration_date);
              await db.drug.update(newObject, {
                where: {
                  drug_code,
                  user_id: req.pharmacy_user_id,
                },
              });
            } else {
              let newObject = {
                user_id: req.pharmacy_user_id,
                ...data[i],
              };

              newObject["category_id"] = +data[i].category_id;
              newObject.expiration_date = new Date(newObject.expiration_date);
              await db.drug.create(newObject);
            }
          }

          res.send({
            status: "success",
            message: "Imported successfully",
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
  },
};
