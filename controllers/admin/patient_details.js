
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
var file_upload = require('./../../services/upload');
var roleService = require('./../../services/roleService');
var passwordService = require('./../../services/passwordService');


module.exports = {
    initializeApi: function(app) {
        const basic_attributes = ["createdAt","updatedAt"];


const role = 0;
					app.post("/admin/addpatient_details",roleService.verifyRole(role),   async function(req, res) {
					    try {

							
							  if(req.body.first_name === null || req.body.first_name === undefined)
								  return res.send({status  : "error", message : " First Name is required " })
						  
							  if(req.body.middle_name === null || req.body.middle_name === undefined)
								  return res.send({status  : "error", message : " Middle Name is required " })
						  
							  if(req.body.last_name === null || req.body.last_name === undefined)
								  return res.send({status  : "error", message : " Last Name is required " })
						  
							  if(req.body.dob === null || req.body.dob === undefined)
								  return res.send({status  : "error", message : " Dob is required " })
						  
							  if(req.body.email === null || req.body.email === undefined)
								  return res.send({status  : "error", message : " Email is required " })
						  
							  if(req.body.phone === null || req.body.phone === undefined)
								  return res.send({status  : "error", message : " Phone is required " })
						  
							  if(req.body.street_address_1 === null || req.body.street_address_1 === undefined)
								  return res.send({status  : "error", message : " Street Address 1 is required " })
						  
							  if(req.body.street_address_2 === null || req.body.street_address_2 === undefined)
								  return res.send({status  : "error", message : " Street Address 2 is required " })
						  
							  if(req.body.city === null || req.body.city === undefined)
								  return res.send({status  : "error", message : " City is required " })
						  
							  if(req.body.state === null || req.body.state === undefined)
								  return res.send({status  : "error", message : " State is required " })
						  
							  if(req.body.zip === null || req.body.zip === undefined)
								  return res.send({status  : "error", message : " Zip is required " })
						  
							  if(req.body.country === null || req.body.country === undefined)
								  return res.send({status  : "error", message : " Country is required " })
						  


					        await db.patient_details.create({
		
			first_name : req.body.first_name,
		
			middle_name : req.body.middle_name,
		
			last_name : req.body.last_name,
		
			dob : req.body.dob,
		
			email : req.body.email,
		
			phone : req.body.phone,
		
			street_address_1 : req.body.street_address_1,
		
			street_address_2 : req.body.street_address_2,
		
			city : req.body.city,
		
			state : req.body.state,
		
			zip : req.body.zip,
		
			country : req.body.country,
		
			
		
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
					});
				
					app.post("/admin/updatepatient_details",  roleService.verifyRole(role),  async function(req, res) {
					    try {
					        await db.patient_details.update({
		
			first_name : req.body.first_name,
		
			middle_name : req.body.middle_name,
		
			last_name : req.body.last_name,
		
			dob : req.body.dob,
		
			email : req.body.email,
		
			phone : req.body.phone,
		
			street_address_1 : req.body.street_address_1,
		
			street_address_2 : req.body.street_address_2,
		
			city : req.body.city,
		
			state : req.body.state,
		
			zip : req.body.zip,
		
			country : req.body.country,
		
			
		
	}, {
					            where: {
					                id: req.body.id,
					            },
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
					});
				
					app.post("/admin/deletepatient_details",  roleService.verifyRole(role),  async function(req, res) {

					    try {
					        await db.patient_details.destroy({
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
					});
				
					app.post("/admin/bulkdeletepatient_details", roleService.verifyRole(role),  async function(req, res) {

						if(!req.body.ids || !Array.isArray(req.body.ids)){
							return res.send({
								status : "error",
								message: "Please send ids as array"

							})
						}


					    try {
					        await db.patient_details.destroy({
					            where: {
					                id: {
					                	[Op.in] : req.body.ids
					                }
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
					});
				
				app.post("/admin/getpatient_details",  roleService.verifyRole(role),  async function(req, res) {


					let where = {};
					const order = req.body.order ? req.body.order : 'id';
					const order_by = req.body.order_by ? req.body.order_by : "DESC";
					let order_arr = [];

					if(order.indexOf(".")>=0)
					{
						const tempArr = order.split(".");
						tempArr.push(order_by);
						order_arr =[tempArr];
					}
					else{
						order_arr = [[order,order_by]];
					}

					
			
			if(req.body.first_name != null)
				where['first_name'] =  req.body.first_name;
		
			if(req.body.middle_name != null)
				where['middle_name'] =  req.body.middle_name;
		
			if(req.body.last_name != null)
				where['last_name'] =  req.body.last_name;
		
			if(req.body.dob != null)
				where['dob'] =  req.body.dob;
		
			if(req.body.email != null)
				where['email'] =  req.body.email;
		
			if(req.body.phone != null)
				where['phone'] =  req.body.phone;
		
			if(req.body.street_address_1 != null)
				where['street_address_1'] =  req.body.street_address_1;
		
			if(req.body.street_address_2 != null)
				where['street_address_2'] =  req.body.street_address_2;
		
			if(req.body.city != null)
				where['city'] =  req.body.city;
		
			if(req.body.state != null)
				where['state'] =  req.body.state;
		
			if(req.body.zip != null)
				where['zip'] =  req.body.zip;
		
			if(req.body.country != null)
				where['country'] =  req.body.country;
		
	;

				    try {
					        const patient_detailss = await db.patient_details.findAndCountAll({
					        where: where,
				        	offset : req.body.offset ? +req.body.offset : null,
				        	limit : req.body.limit ? +req.body.limit : 25,
				        	order : order_arr,
				        	include : [
				        		
		
	
				        	]
				        });
				        res.send(patient_detailss);
				    } catch (error) {
				        console.log(error);
				        res.send({
				            status: "error",
				            message: "Something went wrong"
				        })
				    }
				});
				
				app.post("/admin/getpatient_details",  roleService.verifyRole(role),  async function(req, res) {
				    try {
				        const patient_details = await db.patient_details.findOne({
				        	where : {
				        		id : req.body.id
				        	},
				        	include : [
				        		
		
	
				        	],				        	
				        	attributes: ['id','first_name','middle_name','last_name','dob','email','phone','street_address_1','street_address_2','city','state','zip','country']
				        });
				        res.send(patient_details);
				    } catch (error) {
				        console.log(error);
				        res.send({
				            status: "error",
				            message: "Something went wrong"
				        })
				    }
				});
				


	}
}

