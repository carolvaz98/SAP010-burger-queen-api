const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const { secret } = require('../../config');
const { login } = require('../../controllers/authController');

jest.mock('../../models/user', () => ({
  findOne: jest.fn(),
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

describe('Teste da função login', () => {
  it('Deve retornar um token válido se o login for bem-sucedido', async () => {
    const email = 'usuario@teste.com';
    const password = 'senhaSegura123';
    const user = {
      id: 1,
      email,
      role: 'usuario',
      password: 'hashDaSenha',
    };

    const req = { body: { email, password } };
    const res = { status: jest.fn(() => res), json: jest.fn() };

    User.findOne.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('tokenDeTeste');

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ token: 'tokenDeTeste' });
    expect(User.findOne).toHaveBeenCalledWith({ where: { email } });
    expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: '2h' },
    );
  });

  it('Deve retornar um erro 401 se o usuário não for encontrado', async () => {
    const email = 'usuario@teste.com';
    const password = 'senhaSegura123';
    const req = { body: { email, password } };
    const res = { status: jest.fn(() => res), json: jest.fn() };

    User.findOne.mockResolvedValue(null);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuário não encontrado' });
  });

  it('Deve retornar um erro se a senha for incorreta', async () => {
    const email = 'usuario@teste.com';
    const password = 'senhaIncorreta123';
    const user = {
      id: 1,
      email,
      role: 'usuario',
      password: 'hashDaSenha',
    };

    const req = { body: { email, password } };
    const res = { status: jest.fn(() => res), json: jest.fn() };

    User.findOne.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(false);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Senha incorreta' });
    expect(User.findOne).toHaveBeenCalledWith({ where: { email } });
    expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
  });
});
