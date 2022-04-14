
				module.exports = function(sequelize, DataTypes) {
				    const order_item = sequelize.define("order_item", {
				    	
				        id: {
				            type: DataTypes.INTEGER,
				            autoIncrement: true,
				            primaryKey: true,
				        },
					drug_code: {
						type: DataTypes.STRING,
												
					},
					drug_name: {
						type: DataTypes.STRING,
												
					},
					quantity: {
						type: DataTypes.INTEGER,
												
					},
					price: {
						type: DataTypes.INTEGER,
												
					},
					returned: {
						type: DataTypes.INTEGER,
												
					},
					status: {
						type: DataTypes.INTEGER,
						"defaultValue":0						
					},
				    });
				    order_item.associate = function(models) {
					order_item.belongsTo(models.order, {
						foreignKey: "order_id",
						as: "order",
			            constraints: false
					});

				
					order_item.belongsTo(models.user, {
						foreignKey: "user_id",
						as: "user",
			            constraints: false
					});

				
					order_item.belongsTo(models.drug, {
						foreignKey: "drug_id",
						as: "drug",
			            constraints: false
					});

				};

					return order_item;
				}
			