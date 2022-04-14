const db = require("./models");
db.sequelize.sync({ force: false, alter: true }).then(function () {});
