
				module.exports = function(sequelize, DataTypes) {
				    const order_return = sequelize.define("order_return", {
				    	
				        id: {
				            type: DataTypes.INTEGER,
				            autoIncrement: true,
				            primaryKey: true,
				        },
					quantity: {
						type: DataTypes.INTEGER,
												
					},
				    });
				    order_return.associate = function(models) {
					order_return.belongsTo(models.order_item, {
						foreignKey: "order_item_id",
						as: "order_item",
			            constraints: false
					});

				
					order_return.belongsTo(models.user, {
						foreignKey: "user_id",
						as: "user",
			            constraints: false
					});

				};

					return order_return;
				}
			