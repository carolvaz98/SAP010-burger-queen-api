const express = require('express');
const orderController = require('../controllers/orderController.js');

const router = express.Router();

router.get('/', orderController.listOrders);
router.post('/create', orderController.createOrder);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
