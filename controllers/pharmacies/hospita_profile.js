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
    const hospital_prefix = 110000;

    const role = 1;
    const emr_admin_token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWRtaW4iLCJhZG1pbl90eXBlIjowLCJpZCI6MiwiaWF0IjoxNjQzMjY1Mzg4fQ.DOWxeIL5HgsV5MRqwgSJV5KjqfkcBoeJeW-TM1kjDVI";
    const emr_url = process.env.EMR_API_URL;

    app.post(
      "/pharmacies/gethospital_profile",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          const userDetails = await db.user.findOne({
            where: {
              id: req.user_id,
            },
          });
          console.log(userDetails);
          if (userDetails) {
            let hospital_id =
              parseInt(userDetails.pharmacy_user_id) - hospital_prefix;
            const headers = {
              token: emr_admin_token,
            };

            const result = await axiosService.postRequest(
              emr_url + "/admin/gethospital",
              {
                token: emr_admin_token,
                id: hospital_id,
              },
              headers
            );

            res.send({ status: "success", data: result?.data });
          } else {
            res.send({
              status: "error",
              message: "User not found",
            });
          }
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
