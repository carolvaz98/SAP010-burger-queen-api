const Product = require('../models/product');

exports.listProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar produtos' });
  }
};

exports.productById = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findOne({ where: { id: productId } });

    if (!product) {
      return res.status(404).json({ error: 'El producto solicitado no existe' });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, price, type, quantity } = req.body;
    const newProduct = await Product.create({ name, price, type, quantity });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, type, quantity } = req.body;

    await Product.update(
      { name, price, type, quantity },
      { where: { id } }
    );

    res.status(200).json({ message: 'Produto atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await Product.destroy({ where: { id } });

    res.status(204).json({ message: 'Produto excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir produto' });
  }
};

