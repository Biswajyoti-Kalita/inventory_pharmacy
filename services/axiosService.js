require("dotenv").config();
const axios = require("axios");

module.exports = {
  postRequest: async function (URL, data, headers) {
    const result = await axios
      .post(URL, data, { headers })
      .catch(function (error) {
        console.log(error);
        return {
          status: "error",
          err: error,
        };
      });
    return result;
  },
};
