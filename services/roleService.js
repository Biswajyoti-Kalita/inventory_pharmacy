require("dotenv").config();
var jwt = require("jsonwebtoken");

module.exports = {
  verifyRole: function (role) {
    return function (req, res, next) {
      const token = req.body.token || req.headers["token"];
      if (token) {
        jwt.verify(token, process.env.SECRET_KEY, function (err, decode) {
          if (err || decode.role_id != role) {
            res.status(403).send({
              status: "error",
              msg: "authentication failed",
            });
          } else {
            console.log("decode \n", decode);
            if (decode.is_owner) {
              req.user_id = decode.id;
              req.pharmacy_user_id = decode.id;
            } else {
              req.user_id = decode.id;
              req.pharmacy_user_id = decode.pharmacy_user_id;
            }
            next();
          }
        });
      } else {
        res.status(401).send({
          msg: "please send the token",
        });
      }
    };
  },
};
