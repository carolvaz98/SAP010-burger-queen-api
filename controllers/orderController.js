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
    const { orderId } = req.params;
    const order = await Order.findOne({ where: { id: orderId } });

    if (!order) {
      return res.status(404).json({ error: 'O pedido solicitado não existe' });
    }

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const {
      client,
      products,
      status,
      dateProcessed,
    } = req.body;

    const newOrder = await Order.create({
      client,
      products,
      status,
      dateProcessed,
    });

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar pedido' });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      client,
      products,
      status,
      dateProcessed,
    } = req.body;

    await Order.update(
      {
        client,
        products,
        status,
        dateProcessed,
      },
      { where: { id } },
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

    res.status(204).json({ message: 'Pedido excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir pedido' });
  }
};
