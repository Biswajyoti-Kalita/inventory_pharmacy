
				module.exports = function(sequelize, DataTypes) {
				    const hospital_department = sequelize.define("hospital_department", {
				    	
				        id: {
				            type: DataTypes.INTEGER,
				            autoIncrement: true,
				            primaryKey: true,
				        },
					name: {
						type: DataTypes.STRING,
												
					},
				    });
				    

					return hospital_department;
				}
			