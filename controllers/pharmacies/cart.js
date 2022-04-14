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

    const role = 1;
    const emr_admin_token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWRtaW4iLCJhZG1pbl90eXBlIjowLCJpZCI6MiwiaWF0IjoxNjQzMjY1Mzg4fQ.DOWxeIL5HgsV5MRqwgSJV5KjqfkcBoeJeW-TM1kjDVI";
    const emr_url = "https://emrapi.jajirx.com";
    app.get(
      "/pharmacies/gethospitals",
      roleService.verifyRole(role),
      async function (req, res) {
        try {
          const data = {};
          const headers = {
            token: emr_admin_token,
          };
          const result = await axiosService.postRequest(
            emr_url + "/admin/gethospitals",
            data,
            headers
          );
          return res.send({
            status: "success",
            data: result.data,
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
    app.post("/pharmacies/getprescriptions", async function (req, res) {
      try {
        const data = {
          token: emr_admin_token,
          hospital_id: req.body.hospital_id,
        };
        const headers = {
          token: emr_admin_token,
        };

        if (req.body.hospital_prescription_id)
          data["hospital_prescription_id"] = req.body.hospital_prescription_id;
        //          if (req.body.hospital_id) data["hospital_id"] = req.body.hospital_id;
        let num = req.body.offset;

        const result = await axiosService.postRequest(
          emr_url + "/admin/getprescriptions/" + num,
          data,
          headers
        );
        console.log(result);
        return res.send(result.data);
      } catch (error) {
        console.log(error);
        res.send({
          status: "error",
          message: error,
        });
      }
    });

    app.post("/pharmacies/getprescription", async function (req, res) {
      try {
        const data = {
          token: emr_admin_token,
          hospital_prescription_id: +req.body.hospital_prescription_id,
          hospital_id: +req.body.hospital_id,
        };
        const headers = {
          token: emr_admin_token,
        };

        const result = await axiosService.postRequest(
          emr_url + "/pharmacy/getprescription",
          data,
          headers
        );
        console.log(result);
        return res.send(result.data);
      } catch (error) {
        console.log(error);
        res.send({
          status: "error",
          message: error,
        });
      }
    });
  },
};
