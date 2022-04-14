
				module.exports = function(sequelize, DataTypes) {
				    const purchase_return_drug = sequelize.define("purchase_return_drug", {
				    	
				        id: {
				            type: DataTypes.INTEGER,
				            autoIncrement: true,
				            primaryKey: true,
				        },
					quantity: {
						type: DataTypes.INTEGER,
												
					},
					return_date: {
						type: DataTypes.DATEONLY,
												
					},
				    });
				    purchase_return_drug.associate = function(models) {
					purchase_return_drug.belongsTo(models.purchase_drug_item, {
						foreignKey: "purchase_drug_item_id",
						as: "purchase_drug_item",
			            constraints: false
					});

				
					purchase_return_drug.belongsTo(models.user, {
						foreignKey: "user_id",
						as: "user",
			            constraints: false
					});

				};

					return purchase_return_drug;
				}
			