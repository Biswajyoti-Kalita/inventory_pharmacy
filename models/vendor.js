
				module.exports = function(sequelize, DataTypes) {
				    const vendor = sequelize.define("vendor", {
				    	
				        id: {
				            type: DataTypes.INTEGER,
				            autoIncrement: true,
				            primaryKey: true,
				        },
					name: {
						type: DataTypes.STRING,
												
					},
					vendor_code: {
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
					country: {
						type: DataTypes.STRING,
												
					},
					zip: {
						type: DataTypes.STRING,
												
					},
				    });
				    vendor.associate = function(models) {
					vendor.belongsTo(models.user, {
						foreignKey: "user_id",
						as: "user",
			            constraints: false
					});

				};

					return vendor;
				}
			