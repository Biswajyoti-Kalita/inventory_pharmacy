
				module.exports = function(sequelize, DataTypes) {
				    const order = sequelize.define("order", {
				    	
				        id: {
				            type: DataTypes.INTEGER,
				            autoIncrement: true,
				            primaryKey: true,
				        },
					uuid: {
						type: DataTypes.STRING,
												
					},
					has_prescription: {
						type: DataTypes.INTEGER,
												
					},
					hospital_id: {
						type: DataTypes.INTEGER,
												
					},
					hospital_prescription_id: {
						type: DataTypes.INTEGER,
												
					},
					hospital_patient_id: {
						type: DataTypes.INTEGER,
												
					},
					patient_id: {
						type: DataTypes.INTEGER,
												
					},
					discount: {
						type: DataTypes.INTEGER,
												
					},
					payment_type: {
						type: DataTypes.INTEGER,
												
					},
					patient_insurance_id: {
						type: DataTypes.STRING,
												
					},
					additional_information: {
						type: DataTypes.STRING,
												
					},
					transaction_id: {
						type: DataTypes.STRING,
												
					},
					cheque_no: {
						type: DataTypes.STRING,
												
					},
					bank_name: {
						type: DataTypes.STRING,
												
					},
					account_holder_name: {
						type: DataTypes.STRING,
												
					},
					cheque_date: {
						type: DataTypes.DATEONLY,
												
					},
					amount: {
						type: DataTypes.DOUBLE,
												
					},
					status: {
						type: DataTypes.INTEGER,
												
					},
					order_date: {
						type: DataTypes.DATEONLY,
												
					},
					order_type: {
						type: DataTypes.INTEGER,
						"defaultValue":0						
					},
					hospital_name: {
						type: DataTypes.STRING,
												
					},
					comments: {
						type: DataTypes.STRING,
												
					},
					requested_by: {
						type: DataTypes.STRING,
												
					},
				    });
				    order.associate = function(models) {
					order.belongsTo(models.patient_details, {
						foreignKey: "patient_details_id",
						as: "patient_details",
			            constraints: false
					});

				
					order.hasMany(models.order_item, {
						foreignKey: "order_id",
						as: "order_items",
			            constraints: false
					});

				
					order.belongsTo(models.user, {
						foreignKey: "user_id",
						as: "user",
			            constraints: false
					});

				
					order.belongsTo(models.insurance_company, {
						foreignKey: "insurance_company_id",
						as: "insurance_company",
			            constraints: false
					});

				
					order.belongsTo(models.hospital_department, {
						foreignKey: "hospital_department_id",
						as: "hospital_department",
			            constraints: false
					});

				};

					return order;
				}
			