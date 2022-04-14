
				module.exports = function(sequelize, DataTypes) {
				    const patient_details = sequelize.define("patient_details", {
				    	
				        id: {
				            type: DataTypes.INTEGER,
				            autoIncrement: true,
				            primaryKey: true,
				        },
					hospital_id: {
						type: DataTypes.INTEGER,
												
					},
					hospital_patient_id: {
						type: DataTypes.INTEGER,
												
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
					dob: {
						type: DataTypes.DATEONLY,
												
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
				    patient_details.associate = function(models) {
					patient_details.belongsTo(models.user, {
						foreignKey: "user_id",
						as: "user",
			            constraints: false
					});

				};

					return patient_details;
				}
			