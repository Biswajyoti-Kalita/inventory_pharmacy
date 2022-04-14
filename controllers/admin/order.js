
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
					app.post("/admin/addorder",roleService.verifyRole(role),   async function(req, res) {
					    try {

							
							  if(req.body.uuid === null || req.body.uuid === undefined)
								  return res.send({status  : "error", message : " Uuid is required " })
						  
							  if(req.body.has_prescription === null || req.body.has_prescription === undefined)
								  return res.send({status  : "error", message : " Has Prescription is required " })
						  
							  if(req.body.hospital_id === null || req.body.hospital_id === undefined)
								  return res.send({status  : "error", message : " Hospital Id is required " })
						  
							  if(req.body.hospital_prescription_id === null || req.body.hospital_prescription_id === undefined)
								  return res.send({status  : "error", message : " Hospital Prescription Id is required " })
						  
							  if(req.body.hospital_patient_id === null || req.body.hospital_patient_id === undefined)
								  return res.send({status  : "error", message : " Hospital Patient Id is required " })
						  
							  if(req.body.discount === null || req.body.discount === undefined)
								  return res.send({status  : "error", message : " Discount is required " })
						  
							  if(req.body.status === null || req.body.status === undefined)
								  return res.send({status  : "error", message : " Status is required " })
						  
							  if(req.body.order_date === null || req.body.order_date === undefined)
								  return res.send({status  : "error", message : " Order Date is required " })
						  


					        await db.order.create({
		
			uuid : req.body.uuid,
		
			has_prescription : req.body.has_prescription,
		
			hospital_id : req.body.hospital_id,
		
			hospital_prescription_id : req.body.hospital_prescription_id,
		
			hospital_patient_id : req.body.hospital_patient_id,
		
			discount : req.body.discount,
		
			status : req.body.status,
		
			order_date : req.body.order_date,
		
			
		
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
				
					app.post("/admin/updateorder",  roleService.verifyRole(role),  async function(req, res) {
					    try {
					        await db.order.update({
		
			uuid : req.body.uuid,
		
			has_prescription : req.body.has_prescription,
		
			hospital_id : req.body.hospital_id,
		
			hospital_prescription_id : req.body.hospital_prescription_id,
		
			hospital_patient_id : req.body.hospital_patient_id,
		
			discount : req.body.discount,
		
			status : req.body.status,
		
			order_date : req.body.order_date,
		
			
		
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
				
					app.post("/admin/deleteorder",  roleService.verifyRole(role),  async function(req, res) {

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
					});
				
					app.post("/admin/bulkdeleteorder", roleService.verifyRole(role),  async function(req, res) {

						if(!req.body.ids || !Array.isArray(req.body.ids)){
							return res.send({
								status : "error",
								message: "Please send ids as array"

							})
						}


					    try {
					        await db.order.destroy({
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
				
				app.post("/admin/getorders",  roleService.verifyRole(role),  async function(req, res) {


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

					
			
			if(req.body.uuid != null)
				where['uuid'] =  req.body.uuid;
		
			if(req.body.has_prescription != null)
				where['has_prescription'] =  req.body.has_prescription;
		
			if(req.body.hospital_id != null)
				where['hospital_id'] =  req.body.hospital_id;
		
			if(req.body.hospital_prescription_id != null)
				where['hospital_prescription_id'] =  req.body.hospital_prescription_id;
		
			if(req.body.hospital_patient_id != null)
				where['hospital_patient_id'] =  req.body.hospital_patient_id;
		
			if(req.body.discount != null)
				where['discount'] =  req.body.discount;
		
			if(req.body.status != null)
				where['status'] =  req.body.status;
		
			if(req.body.order_date != null)
				where['order_date'] =  req.body.order_date;
		
	;

				    try {
					        const orders = await db.order.findAndCountAll({
					        where: where,
				        	offset : req.body.offset ? +req.body.offset : null,
				        	limit : req.body.limit ? +req.body.limit : 25,
				        	order : order_arr,
				        	include : [
				        		
		
	
				        	]
				        });
				        res.send(orders);
				    } catch (error) {
				        console.log(error);
				        res.send({
				            status: "error",
				            message: "Something went wrong"
				        })
				    }
				});
				
				app.post("/admin/getorder",  roleService.verifyRole(role),  async function(req, res) {
				    try {
				        const order = await db.order.findOne({
				        	where : {
				        		id : req.body.id
				        	},
				        	include : [
				        		
		
	
				        	],				        	
				        	attributes: ['id','uuid','has_prescription','hospital_id','hospital_prescription_id','hospital_patient_id','discount','status','order_date']
				        });
				        res.send(order);
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

