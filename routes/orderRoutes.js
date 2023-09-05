const express = require('express');
const orderController = require('../controllers/orderController');
const { requireAdmin, requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, orderController.listOrders);
router.get('/:id', requireAuth, orderController.orderById);
router.post('/create', requireAuth, orderController.createOrder);
router.put('/:id', requireAdmin, orderController.updateOrder);
router.delete('/:id', requireAdmin, orderController.deleteOrder);

module.exports = router;
