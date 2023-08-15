const express = require('express');
const customerController = require('../controllers/customerController');

const router = express.Router();

// Rota para listar todos os clientes
router.get('/customers', customerController.getAllCustomers);

// Rota para criar um novo cliente
router.post('/customers', customerController.createCustomer);

// Rota para obter detalhes de um cliente pelo ID
router.get('/customers/:id', customerController.getCustomerById);

// Rota para atualizar um cliente pelo ID
router.put('/customers/:id', customerController.updateCustomer);

// Rota para excluir um cliente pelo ID
router.delete('/customers/:id', customerController.deleteCustomer);

module.exports = router;
