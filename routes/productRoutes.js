const express = require('express');
const productController = require('../controllers/productController.js');

const router = express.Router();

router.get('/', productController.listProducts);
router.post('/create', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
