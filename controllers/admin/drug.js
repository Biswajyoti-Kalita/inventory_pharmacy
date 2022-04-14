
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
					app.post("/admin/adddrug",roleService.verifyRole(role),   async function(req, res) {
					    try {

							
							  if(req.body.medication === null || req.body.medication === undefined)
								  return res.send({status  : "error", message : " Medication is required " })
						  
							  if(req.body.ingredient === null || req.body.ingredient === undefined)
								  return res.send({status  : "error", message : " Ingredient is required " })
						  
							  if(req.body.drug_code === null || req.body.drug_code === undefined)
								  return res.send({status  : "error", message : " Drug Code is required " })
						  
							  if(req.body.drug_name === null || req.body.drug_name === undefined)
								  return res.send({status  : "error", message : " Drug Name is required " })
						  
							  if(req.body.available_quantity === null || req.body.available_quantity === undefined)
								  return res.send({status  : "error", message : " Available Quantity is required " })
						  
							  if(req.body.batch_no === null || req.body.batch_no === undefined)
								  return res.send({status  : "error", message : " Batch No is required " })
						  
							  if(req.body.reorder_quantity === null || req.body.reorder_quantity === undefined)
								  return res.send({status  : "error", message : " Reorder Quantity is required " })
						  
							  if(req.body.expiration_date === null || req.body.expiration_date === undefined)
								  return res.send({status  : "error", message : " Expiration Date is required " })
						  
							  if(req.body.semantic_brand_name === null || req.body.semantic_brand_name === undefined)
								  return res.send({status  : "error", message : " Semantic Brand Name is required " })
						  
							  if(req.body.cost_price === null || req.body.cost_price === undefined)
								  return res.send({status  : "error", message : " Cost Price is required " })
						  
							  if(req.body.selling_price === null || req.body.selling_price === undefined)
								  return res.send({status  : "error", message : " Selling Price is required " })
						  


					        await db.drug.create({
		
			medication : req.body.medication,
		
			ingredient : req.body.ingredient,
		
			drug_code : req.body.drug_code,
		
			drug_name : req.body.drug_name,
		
			available_quantity : req.body.available_quantity,
		
			batch_no : req.body.batch_no,
		
			reorder_quantity : req.body.reorder_quantity,
		
			expiration_date : req.body.expiration_date,
		
			semantic_brand_name : req.body.semantic_brand_name,
		
			cost_price : req.body.cost_price,
		
			selling_price : req.body.selling_price,
		
			
		
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
				
					app.post("/admin/updatedrug",  roleService.verifyRole(role),  async function(req, res) {
					    try {
					        await db.drug.update({
		
			medication : req.body.medication,
		
			ingredient : req.body.ingredient,
		
			drug_code : req.body.drug_code,
		
			drug_name : req.body.drug_name,
		
			available_quantity : req.body.available_quantity,
		
			batch_no : req.body.batch_no,
		
			reorder_quantity : req.body.reorder_quantity,
		
			expiration_date : req.body.expiration_date,
		
			semantic_brand_name : req.body.semantic_brand_name,
		
			cost_price : req.body.cost_price,
		
			selling_price : req.body.selling_price,
		
			
		
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
				
					app.post("/admin/deletedrug",  roleService.verifyRole(role),  async function(req, res) {

					    try {
					        await db.drug.destroy({
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
				
					app.post("/admin/bulkdeletedrug", roleService.verifyRole(role),  async function(req, res) {

						if(!req.body.ids || !Array.isArray(req.body.ids)){
							return res.send({
								status : "error",
								message: "Please send ids as array"

							})
						}


					    try {
					        await db.drug.destroy({
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
				
				app.post("/admin/getdrugs",  roleService.verifyRole(role),  async function(req, res) {


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

					
			
			if(req.body.medication != null)
				where['medication'] =  req.body.medication;
		
			if(req.body.ingredient != null)
				where['ingredient'] =  req.body.ingredient;
		
			if(req.body.drug_code != null)
				where['drug_code'] =  req.body.drug_code;
		
			if(req.body.drug_name != null)
				where['drug_name'] =  req.body.drug_name;
		
			if(req.body.available_quantity != null)
				where['available_quantity'] =  req.body.available_quantity;
		
			if(req.body.batch_no != null)
				where['batch_no'] =  req.body.batch_no;
		
			if(req.body.reorder_quantity != null)
				where['reorder_quantity'] =  req.body.reorder_quantity;
		
			if(req.body.expiration_date != null)
				where['expiration_date'] =  req.body.expiration_date;
		
			if(req.body.semantic_brand_name != null)
				where['semantic_brand_name'] =  req.body.semantic_brand_name;
		
			if(req.body.cost_price != null)
				where['cost_price'] =  req.body.cost_price;
		
			if(req.body.selling_price != null)
				where['selling_price'] =  req.body.selling_price;
		
	;

				    try {
					        const drugs = await db.drug.findAndCountAll({
					        where: where,
				        	offset : req.body.offset ? +req.body.offset : null,
				        	limit : req.body.limit ? +req.body.limit : 25,
				        	order : order_arr,
				        	include : [
				        		
		
	
				        	]
				        });
				        res.send(drugs);
				    } catch (error) {
				        console.log(error);
				        res.send({
				            status: "error",
				            message: "Something went wrong"
				        })
				    }
				});
				
				app.post("/admin/getdrug",  roleService.verifyRole(role),  async function(req, res) {
				    try {
				        const drug = await db.drug.findOne({
				        	where : {
				        		id : req.body.id
				        	},
				        	include : [
				        		
		
	
				        	],				        	
				        	attributes: ['id','medication','ingredient','drug_code','drug_name','available_quantity','batch_no','reorder_quantity','expiration_date','semantic_brand_name','cost_price','selling_price']
				        });
				        res.send(drug);
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

