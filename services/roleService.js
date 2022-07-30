require("dotenv").config();
var jwt = require("jsonwebtoken");

module.exports = {
  verifyRole: function (role) {
    return function (req, res, next) {
      const token = req.body.token || req.headers["token"];
      if (token) {
        try {
          jwt.verify(
            token,
            process.env.SECRET_KEY,
            { ignoreExpiration: false },
            function (err, decode) {
              if (err) {
                console.log(" Error captured ", err);
                return res.status(401).send({
                  status: "error",
                  msg: err,
                });
              } else if (decode.role_id != role) {
                if (err)
                  return res.status(403).send({
                    status: "error",
                    msg: "authentication failed",
                  });
              } else {
                console.log("decode \n", decode);
                if (decode.is_owner) {
                  req.user_id = decode.id;
                  req.pharmacy_user_id = decode.pharmacy_user_id;
                } else {
                  req.user_id = decode.id;
                  req.pharmacy_user_id = decode.pharmacy_user_id;
                }
                next();
              }
            }
          );
        } catch (err) {
          console.log("thrown err ", err);
        }
      } else {
        res.status(401).send({
          msg: "please send the token",
        });
      }
    };
  },
};
