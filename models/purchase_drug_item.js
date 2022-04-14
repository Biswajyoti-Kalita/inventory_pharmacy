
				module.exports = function(sequelize, DataTypes) {
				    const purchase_drug_item = sequelize.define("purchase_drug_item", {
				    	
				        id: {
				            type: DataTypes.INTEGER,
				            autoIncrement: true,
				            primaryKey: true,
				        },
					drug_code: {
						type: DataTypes.STRING,
												
					},
					quantity: {
						type: DataTypes.INTEGER,
												
					},
					returned: {
						type: DataTypes.INTEGER,
												
					},
				    });
				    purchase_drug_item.associate = function(models) {
					purchase_drug_item.belongsTo(models.purchase_drug, {
						foreignKey: "purchase_drug_id",
						as: "purchase_drug",
			            constraints: false
					});

				
					purchase_drug_item.belongsTo(models.user, {
						foreignKey: "user_id",
						as: "user",
			            constraints: false
					});

				};

					return purchase_drug_item;
				}
			