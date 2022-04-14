
				module.exports = function(sequelize, DataTypes) {
				    const drug = sequelize.define("drug", {
				    	
				        id: {
				            type: DataTypes.INTEGER,
				            autoIncrement: true,
				            primaryKey: true,
				        },
					medication: {
						type: DataTypes.STRING,
												
					},
					ingredient: {
						type: DataTypes.TEXT,
												
					},
					description: {
						type: DataTypes.TEXT,
												
					},
					brand: {
						type: DataTypes.STRING,
												
					},
					drug_code: {
						type: DataTypes.STRING,
												
					},
					drug_name: {
						type: DataTypes.STRING,
												
					},
					available_quantity: {
						type: DataTypes.INTEGER,
												
					},
					batch_no: {
						type: DataTypes.STRING,
												
					},
					reorder_quantity: {
						type: DataTypes.INTEGER,
												
					},
					expiration_date: {
						type: DataTypes.DATEONLY,
												
					},
					semantic_brand_name: {
						type: DataTypes.STRING,
												
					},
					cost_price: {
						type: DataTypes.DOUBLE,
												
					},
					selling_price: {
						type: DataTypes.DOUBLE,
												
					},
				    });
				    drug.associate = function(models) {
					drug.belongsTo(models.user, {
						foreignKey: "user_id",
						as: "user",
			            constraints: false
					});

				
					drug.belongsTo(models.category, {
						foreignKey: "category_id",
						as: "category",
			            constraints: false
					});

				};

					return drug;
				}
			