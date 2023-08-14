/* const express = require('express');
const customerController = require('../controllers/customerController');
const orderController = require('../controllers/orderController');
const orderItemController = require('../controllers/orderItemController');
const productController = require('../controllers/productController');

module.exports = (app, sequelize) => {
  const router = express.Router();

  // Defina as rotas usando os controladores
  router.use('/customers', customerController(sequelize));
  router.use('/orders', orderController(sequelize));
  router.use('/order-items', orderItemController(sequelize));
  router.use('/products', productController(sequelize));

  app.use('/api', router);
}; */
