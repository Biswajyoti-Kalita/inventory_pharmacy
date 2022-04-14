
				module.exports = function(sequelize, DataTypes) {
				    const purchase_drug = sequelize.define("purchase_drug", {
				    	
				        id: {
				            type: DataTypes.INTEGER,
				            autoIncrement: true,
				            primaryKey: true,
				        },
					bill_id: {
						type: DataTypes.STRING,
												
					},
					purchase_date: {
						type: DataTypes.DATEONLY,
												
					},
				    });
				    purchase_drug.associate = function(models) {
					purchase_drug.belongsTo(models.vendor, {
						foreignKey: "vendor_id",
						as: "vendor",
			            constraints: false
					});

				
					purchase_drug.belongsTo(models.user, {
						foreignKey: "user_id",
						as: "user",
			            constraints: false
					});

				};

					return purchase_drug;
				}
			