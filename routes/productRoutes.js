const express = require('express');
const productController = require('../controllers/productController.js');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware(), productController.listProducts);
router.get('/:id', authMiddleware(), productController.productById);
router.post('/create', authMiddleware(), productController.createProduct);
router.patch('/:id', authMiddleware(), productController.updateProduct);
router.delete('/:id', authMiddleware(), productController.deleteProduct);

module.exports = router;
