
				module.exports = function(sequelize, DataTypes) {
				    const category = sequelize.define("category", {
				    	
				        id: {
				            type: DataTypes.INTEGER,
				            autoIncrement: true,
				            primaryKey: true,
				        },
					name: {
						type: DataTypes.STRING,
												
					},
				    });
				    category.associate = function(models) {
					category.belongsTo(models.user, {
						foreignKey: "user_id",
						as: "user",
			            constraints: false
					});

				};

					return category;
				}
			