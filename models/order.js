const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const ProductOrder = require('./productOrder');
const Product = require('./product');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  client: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'canceled', 'delivering', 'delivered'),
    allowNull: false,
    validate: {
      len: [['pending', 'canceled', 'delivering', 'delivered']],
    },
  },
  dateProcessed: {
    type: DataTypes.STRING,
  },
});

Order.hasMany(ProductOrder);
ProductOrder.belongsTo(Order);

ProductOrder.belongsTo(Product);
Product.hasMany(ProductOrder);

module.exports = Order;
