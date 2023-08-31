const express = require('express');
const orderController = require('../controllers/orderController.js');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware(), orderController.listOrders);
router.get('/:id', authMiddleware(), orderController.orderById);
router.post('/create', authMiddleware(), orderController.createOrder);
router.patch('/:id', authMiddleware(), orderController.updateOrder);
router.delete('/:id', authMiddleware(), orderController.deleteOrder);

module.exports = router;
