const express = require('express');
const productController = require('../controllers/productController');
const { requireAdmin, requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, productController.listProducts);
router.get('/:id', requireAuth, productController.productById);
router.post('/create', requireAdmin, productController.createProduct);
router.put('/:id', requireAdmin, productController.updateProduct);
router.delete('/:id', requireAdmin, productController.deleteProduct);

module.exports = router;
