const User = require('../models/user');

exports.listUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const newUser = await User.create({ name, email });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const updatedUser = await User.update(
      { name, email },
      { where: { id } }
    );

    res.status(200).json({ message: 'Usuário atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    console.log(req.params); // Mova o log para dentro da função deleteUser
    const { id } = req.params;

    await User.destroy({ where: { id } });

    res.status(204).json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    res.status(500).json({ error: 'Erro ao excluir usuário' });
  }  
};


