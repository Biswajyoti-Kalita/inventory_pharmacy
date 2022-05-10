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
const axiosService = require("./../../services/axiosService");

module.exports = {
  initializeApi: function (app) {
    const basic_attributes = ["createdAt", "updatedAt"];
    const hospital_prefix = 110000;
    const toLowerCase = (string) => {
      return string.toLowerCase();
    };
    const emr_admin_token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWRtaW4iLCJhZG1pbl90eXBlIjowLCJpZCI6MiwiaWF0IjoxNjQzMjY1Mzg4fQ.DOWxeIL5HgsV5MRqwgSJV5KjqfkcBoeJeW-TM1kjDVI";
    const emr_url = process.env.EMR_API_URL;

    const role = 0;
    app.post(
      "/admin/adduser",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          if (req.body.first_name === null || req.body.first_name === undefined)
            return res.send({
              status: "error",
              message: " First Name is required ",
            });

          if (req.body.last_name === null || req.body.last_name === undefined)
            return res.send({
              status: "error",
              message: " Last Name is required ",
            });

          if (req.body.email === null || req.body.email === undefined)
            return res.send({
              status: "error",
              message: " Email is required ",
            });

          if (req.body.role_id === null || req.body.role_id === undefined)
            return res.send({
              status: "error",
              message: " Role Id is required ",
            });

          await db.user.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            phone: req.body.phone ? req.body.phone : "",
            email: req.body.email,
            is_owner: 1,
            role_id: 1,
            username: randomstring.generate(),
            password: await passwordService.hashPassword(req.body.password),
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
      "/admin/updateuser",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          await db.user.update(
            {
              first_name: req.body.first_name,

              last_name: req.body.last_name,

              phone: req.body.phone,

              email: req.body.email,

              role_id: req.body.role_id,

              password: await passwordService.hashPassword(req.body.password),
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
      "/admin/deleteuser",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          await db.user.destroy({
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
      "/admin/bulkdeleteuser",
      roleService.verifyRole(role),
      async function (req, res) {
        if (!req.body.ids || !Array.isArray(req.body.ids)) {
          return res.send({
            status: "error",
            message: "Please send ids as array",
          });
        }

        try {
          await db.user.destroy({
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
      "/admin/getusers",
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

        if (req.body.first_name != null)
          where["first_name"] = req.body.first_name;

        if (req.body.last_name != null) where["last_name"] = req.body.last_name;

        if (req.body.phone != null) where["phone"] = req.body.phone;

        if (req.body.email != null) where["email"] = req.body.email;

        if (req.body.password != null) where["password"] = req.body.password;

        if (req.body.role_id != null) where["role_id"] = req.body.role_id;

        try {
          const users = await db.user.findAndCountAll({
            where: where,
            offset: req.body.offset ? +req.body.offset : null,
            limit: req.body.limit ? +req.body.limit : 25,
            order: order_arr,
            include: [],
          });
          res.send(users);
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
      "/admin/getuser",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          const user = await db.user.findOne({
            where: {
              id: req.body.id,
            },
            include: [],
            attributes: [
              "id",
              "first_name",
              "last_name",
              "phone",
              "email",
              "password",
              "role_id",
            ],
          });
          res.send(user);
        } catch (error) {
          console.log(error);
          res.send({
            status: "error",
            message: "Something went wrong",
          });
        }
      }
    );

    // MANAGER API

    app.post(
      "/admin/addmanager",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          const role_id = 1,
            is_owner = 1;

          if (
            req.body.pharmacy_id === null ||
            req.body.pharmacy_id === undefined
          )
            return res.send({
              status: "error",
              message: " pharmacy Id is required ",
            });

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

          const lastIndexUser = await db.user.findOne({
            order: [["id", "DESC"]],
          });
          //           id: lastIndexUser ? lastIndexUser.id + 1 : 1,
          console.log(lastIndexUser);
          await db.user.create({
            id: lastIndexUser ? lastIndexUser.id + 1 : 1,
            first_name: req.body.first_name,
            last_name: req.body.last_name ? req.body.last_name : "",
            phone: req.body.phone ? req.body.phone : "",
            email: req.body.email,
            role_id: role_id,
            permissions: "3",
            is_owner: is_owner,
            pharmacy_user_id: req.body.pharmacy_id,
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
      }
    );
    app.post(
      "/admin/getmanagers",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          let where = {
            is_owner: 1,
            role_id: 1,
          };

          const { first_name, last_name, phone, email } = req.body;

          if (first_name) {
            where = {
              ...where,
              first_name: {
                [Op.like]: "%" + first_name + "%",
              },
            };
          }
          if (last_name) {
            where = {
              ...where,
              last_name: {
                [Op.like]: "%" + last_name + "%",
              },
            };
          }

          if (phone) {
            where = {
              ...where,
              phone: {
                [Op.like]: "%" + phone + "%",
              },
            };
          }
          if (email) {
            where = {
              ...where,
              email: {
                [Op.like]: "%" + email + "%",
              },
            };
          }
          console.log(where);
          const list = await db.user.findAll({
            where,
            attributes: [
              "id",
              "first_name",
              "last_name",
              "phone",
              "email",
              ["pharmacy_user_id", "pharmacy_id"],
            ],
            include: [
              {
                model: db.pharmacy_profile,
                as: "pharmacy_profile",
                attributes: ["id", "name", "regn_no", "owner_name"],
              },
            ],
          });

          res.send(list);
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
      "/admin/deletemanager",
      roleService.verifyRole(role),
      async function (req, res) {
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
              is_owner: 1,
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
      }
    );

    // INVENTORY ADMIN API

    app.post(
      "/admin/addinventoryadmin",
      roleService.verifyRole(role),
      async function (req, res) {
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
            is_owner: 0,
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
      }
    );

    app.post(
      "/admin/getinventoryadmins",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          const role_id = 1;
          let where = {
            role_id: role_id,
            is_owner: 0,
          };
          let hospitals = {};

          const { first_name, last_name, phone, email } = req.body;

          if (first_name) {
            where = {
              ...where,
              first_name: {
                [Op.like]: "%" + first_name + "%",
              },
            };
          }
          if (last_name) {
            where = {
              ...where,
              last_name: {
                [Op.like]: "%" + last_name + "%",
              },
            };
          }

          if (phone) {
            where = {
              ...where,
              phone: {
                [Op.like]: "%" + phone + "%",
              },
            };
          }
          if (email) {
            where = {
              ...where,
              email: {
                [Op.like]: "%" + email + "%",
              },
            };
          }
          console.log(where);

          const hospitalList = await axiosService.postRequest(
            emr_url + "/admin/gethospitals",
            {},
            { token: emr_admin_token }
          );

          if (hospitalList && hospitalList.data) {
            hospitalList.data.map((item) => {
              hospitals[item.id] = item;
            });
          }

          let data = await db.user.findAll({
            where,
            attributes: [
              "id",
              "first_name",
              "last_name",
              "phone",
              "email",
              "pharmacy_user_id",
            ],
          });

          data = data.map((i) => {
            return {
              id: i.id,
              first_name: i.first_name,
              last_name: i.last_name,
              email: i.email,
              phone: i.phone,
              hospital_id: i.pharmacy_user_id
                ? parseInt(i.pharmacy_user_id) > hospital_prefix
                  ? parseInt(i.pharmacy_user_id) - hospital_prefix
                  : -1
                : null,
            };
          });

          data = data.map((i) => {
            return {
              ...i,
              hospital: i.hospital_id ? hospitals[i.hospital_id] : null,
            };
          });

          res.send(data);
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
      "/admin/deleteinventoryadmin",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          const role_id = 1;

          if (req.body.id == null || req.body.id == undefined) {
            return res.send({
              status: "error",
              message: "Id is required",
            });
          }
          const data = await db.user.destroy({
            where: {
              id: +req.body.id,
              role_id: role_id,
              is_owner: 0,
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
      }
    );
  },
};
