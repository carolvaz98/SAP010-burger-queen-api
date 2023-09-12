const express = require('express');
const orderController = require('../controllers/orderController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, orderController.listOrders);
router.get('/:id', requireAuth, orderController.orderById);
router.post('/create', requireAuth, orderController.createOrder);
router.patch('/:id', requireAuth, orderController.updateOrder);
router.delete('/:id', requireAuth, orderController.deleteOrder);

module.exports = router;
