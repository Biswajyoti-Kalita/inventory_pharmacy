
				module.exports = function(sequelize, DataTypes) {
				    const user = sequelize.define("user", {
				    	
				        id: {
				            type: DataTypes.INTEGER,
				            autoIncrement: true,
				            primaryKey: true,
				        },
					username: {
						type: DataTypes.STRING,
						"allowNull":false,
"unique":true						
					},
					first_name: {
						type: DataTypes.STRING,
												
					},
					middle_name: {
						type: DataTypes.STRING,
												
					},
					last_name: {
						type: DataTypes.STRING,
												
					},
					gender: {
						type: DataTypes.INTEGER,
												
					},
					email: {
						type: DataTypes.STRING,
												
					},
					phone: {
						type: DataTypes.STRING,
						"limit":20						
					},
					referer: {
						type: DataTypes.STRING,
												
					},
					address: {
						type: DataTypes.STRING,
												
					},
					city: {
						type: DataTypes.STRING,
												
					},
					state: {
						type: DataTypes.STRING,
						"limit":20						
					},
					pincode: {
						type: DataTypes.STRING,
						"limit":7						
					},
					location: {
						type: DataTypes.STRING,
												
					},
					password: {
						type: DataTypes.STRING,
												
					},
					role_id: {
						type: DataTypes.INTEGER,
												
					},
					permissions: {
						type: DataTypes.TEXT,
						"defaultValue":""						
					},
					is_owner: {
						type: DataTypes.INTEGER,
												
					},
					pharmacy_user_id: {
						type: DataTypes.INTEGER,
												
					},
				    });
				    user.associate = function(models) {
					user.belongsTo(models.pharmacy_profile, {
						foreignKey: "pharmacy_user_id",
						as: "pharmacy_profile",
			            constraints: false
					});

				};

					return user;
				}
			