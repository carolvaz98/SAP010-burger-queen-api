const { Customer } = require('../models/customer');

const createCustomer = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const customer = await Customer.create({ name, email });
    res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
};

const getAllCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.findAll();
    res.status(200).json(customers);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCustomer,
  getAllCustomers,
};
