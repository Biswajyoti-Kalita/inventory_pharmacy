
				module.exports = function(sequelize, DataTypes) {
				    const insurance_company = sequelize.define("insurance_company", {
				    	
				        id: {
				            type: DataTypes.INTEGER,
				            autoIncrement: true,
				            primaryKey: true,
				        },
					company_name: {
						type: DataTypes.STRING,
												
					},
					company_id: {
						type: DataTypes.STRING,
												
					},
					email: {
						type: DataTypes.STRING,
												
					},
					phone: {
						type: DataTypes.STRING,
												
					},
					street_address_1: {
						type: DataTypes.TEXT,
												
					},
					street_address_2: {
						type: DataTypes.TEXT,
												
					},
					city: {
						type: DataTypes.STRING,
												
					},
					state: {
						type: DataTypes.STRING,
												
					},
					zip: {
						type: DataTypes.STRING,
												
					},
					country: {
						type: DataTypes.STRING,
												
					},
				    });
				    insurance_company.associate = function(models) {
					insurance_company.hasMany(models.order, {
						foreignKey: "insurance_company_id",
						as: "orders",
			            constraints: false
					});

				
					insurance_company.belongsTo(models.user, {
						foreignKey: "user_id",
						as: "user",
			            constraints: false
					});

				};

					return insurance_company;
				}
			