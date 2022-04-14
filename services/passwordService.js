const bcrypt = require('bcryptjs');

module.exports = {
  hashPassword: async function (password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  },
  comparePassword: async function (password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  },
};
