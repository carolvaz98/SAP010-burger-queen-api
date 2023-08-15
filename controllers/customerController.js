const { Customer } = require('../models/customer');

// Função para listar todos os clientes
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar os clientes' });
  }
};

// Função para criar um novo cliente
const createCustomer = async (req, res) => {
  const { name, email } = req.body;
  try {
    const customer = await Customer.create({ name, email });
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar o cliente' });
  }
};

// Função para obter detalhes de um cliente pelo ID
const getCustomerById = async (req, res) => {
  const customerId = req.params.id;
  try {
    const customer = await Customer.findByPk(customerId);
    if (customer) {
      res.json(customer);
    } else {
      res.status(404).json({ error: 'Cliente não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter detalhes do cliente' });
  }
};

// Função para atualizar um cliente pelo ID
const updateCustomer = async (req, res) => {
  const customerId = req.params.id;
  const { name, email } = req.body;
  try {
    const customer = await Customer.findByPk(customerId);
    if (customer) {
      await customer.update({ name, email });
      res.json(customer);
    } else {
      res.status(404).json({ error: 'Cliente não encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar o cliente' });
  }
};

// Função para excluir um cliente pelo ID
const deleteCustomer = async (req, res) => {
  const customerId = req.params.id;
  try {
    const customer = await Customer.findByPk(customerId);
    if (customer) {
      await customer.destroy();
      res.json({ message: 'Cliente excluído com sucesso' });
    } else {
      res.status(404).json({ error: 'Cliente não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir o cliente' });
  }
};

module.exports = {
  getAllCustomers,
  createCustomer,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
