const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Product = require('./product');

const ProductOrder = sequelize.define('ProductOrder', {
  qty: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

ProductOrder.belongsTo(Product);

module.exports = ProductOrder;