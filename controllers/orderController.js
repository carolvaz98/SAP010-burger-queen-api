const Order = require('../models/order');

exports.listOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar pedidos' });
  }
};


exports.orderById = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findOne({ where: { id: orderId } });

    if (!order) {
      return res.status(404).json({ error: 'La orden solicitada no existe' });
    }

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { status, request, client, entry_time, exit_time } = req.body;
  
    const newOrder = await Order.create({ status, request, client, entry_time, exit_time });
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Erro ao criar pedido', error);
    res.status(500).json({ error: 'Erro ao criar pedido' });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, request, client, entry_time, exit_time } = req.body;

    await Order.update(
      { status, request, client, entry_time, exit_time },
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

    res.status(204).json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir pedido' });
  }
};

