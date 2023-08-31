const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../models/user');
const { secret } = require('../config');

exports.login = async (req, resp) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return resp.status(400).json({ message: 'Bad request' });
    }

    const user = await User.findOne({
      where: {
        email: {
          [Op.eq]: email,
        },
      },
    });

    if (!user) {
      return resp.status(401).json({ message: 'Unauthorized' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return resp.status(401).json({ message: 'Senha incorreta' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, secret, {
      expiresIn: '1h',
    });
    resp.status(200).json({ token });
  } catch (error) {
    console.error('Error:', error);
    return resp.status(500).json({ message: 'Internal server error' });
  }
};
