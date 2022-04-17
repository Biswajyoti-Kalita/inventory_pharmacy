
				module.exports = function(sequelize, DataTypes) {
				    const pharmacy_profile = sequelize.define("pharmacy_profile", {
				    	
				        id: {
				            type: DataTypes.INTEGER,
				            autoIncrement: true,
				            primaryKey: true,
				        },
					name: {
						type: DataTypes.STRING,
												
					},
					regn_no: {
						type: DataTypes.STRING,
												
					},
					address_1: {
						type: DataTypes.STRING,
												
					},
					address_2: {
						type: DataTypes.STRING,
												
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
					email: {
						type: DataTypes.STRING,
												
					},
					phone: {
						type: DataTypes.STRING,
												
					},
					owner_name: {
						type: DataTypes.STRING,
												
					},
					owner_email: {
						type: DataTypes.STRING,
												
					},
					owner_contact: {
						type: DataTypes.STRING,
												
					},
				    });
				    

					return pharmacy_profile;
				}
			