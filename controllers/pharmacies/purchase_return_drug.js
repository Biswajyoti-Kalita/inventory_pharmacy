
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


const role = 1;
					app.post("/pharmacies/addpurchase_return_drug",roleService.verifyRole(role),   async function(req, res) {
					    try {

							
							  if(req.body.quantity === null || req.body.quantity === undefined)
								  return res.send({status  : "error", message : " Quantity is required " })
						  
							  if(req.body.return_date === null || req.body.return_date === undefined)
								  return res.send({status  : "error", message : " Return Date is required " })
						  


					        await db.purchase_return_drug.create({
		
			quantity : req.body.quantity,
		
			return_date : req.body.return_date,
		
			
		
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
				
					app.post("/pharmacies/updatepurchase_return_drug",  roleService.verifyRole(role),  async function(req, res) {
					    try {
					        await db.purchase_return_drug.update({
		
			quantity : req.body.quantity,
		
			return_date : req.body.return_date,
		
			
		
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
				
					app.post("/pharmacies/deletepurchase_return_drug",  roleService.verifyRole(role),  async function(req, res) {

					    try {
					        await db.purchase_return_drug.destroy({
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
				
					app.post("/pharmacies/bulkdeletepurchase_return_drug", roleService.verifyRole(role),  async function(req, res) {

						if(!req.body.ids || !Array.isArray(req.body.ids)){
							return res.send({
								status : "error",
								message: "Please send ids as array"

							})
						}


					    try {
					        await db.purchase_return_drug.destroy({
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
				
				app.post("/pharmacies/getpurchase_return_drugs",  roleService.verifyRole(role),  async function(req, res) {


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

					
			
			if(req.body.quantity != null)
				where['quantity'] =  req.body.quantity;
		
			if(req.body.return_date != null)
				where['return_date'] =  req.body.return_date;
		
	;

				    try {
					        const purchase_return_drugs = await db.purchase_return_drug.findAndCountAll({
					        where: where,
				        	offset : req.body.offset ? +req.body.offset : null,
				        	limit : req.body.limit ? +req.body.limit : 25,
				        	order : order_arr,
				        	include : [
				        		
		
	
				        	]
				        });
				        res.send(purchase_return_drugs);
				    } catch (error) {
				        console.log(error);
				        res.send({
				            status: "error",
				            message: "Something went wrong"
				        })
				    }
				});
				
				app.post("/pharmacies/getpurchase_return_drug",  roleService.verifyRole(role),  async function(req, res) {
				    try {
				        const purchase_return_drug = await db.purchase_return_drug.findOne({
				        	where : {
				        		id : req.body.id
				        	},
				        	include : [
				        		
		
	
				        	],				        	
				        	attributes: ['id','quantity','return_date']
				        });
				        res.send(purchase_return_drug);
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

