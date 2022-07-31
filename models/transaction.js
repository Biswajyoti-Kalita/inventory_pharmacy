module.exports = function (sequelize, DataTypes) {
  const transaction = sequelize.define("transaction", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    platform: {
      type: DataTypes.STRING,
      defaultValue: "Stripe",
    },
    order_id: {
      type: DataTypes.STRING,
    },
    payment_status: {
      type: DataTypes.INTEGER,
      defaultValue: 0, // pending, paid, failed
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
  });
  transaction.associate = function (models) {
    transaction.belongsTo(models.order, {
      foreignKey: "order_id",
      as: "order",
      constraints: false,
    });
  };

  return transaction;
};
