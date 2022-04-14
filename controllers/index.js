
			
			const adminController = require("./admin/index");
			
			const pharmaciesController = require("./pharmacies/index");
			
		
			module.exports = function initializeApi(app) {
			    const allControllers = [ adminController,pharmaciesController ];
				allControllers.forEach(item => item.initializeApi(app))
			    return app;
			};
		