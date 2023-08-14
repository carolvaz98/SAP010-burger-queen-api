const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.post('/customers', customerController.createCustomer);
router.get('/customers', customerController.getAllCustomers);

module.exports = router;
