const Order = require('../models/order');

exports.listOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar pedidos' });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { status } = req.body;
    const newOrder = await Order.create({ status });

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar pedido' });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.update(
      { status },
      { where: { id } }
    );

    res.status(200).json({ message: 'Pedido atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar pedido' });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    await Order.destroy({ where: { id } });

    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir pedido' });
  }
};

