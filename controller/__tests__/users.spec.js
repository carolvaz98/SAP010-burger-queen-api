const bcrypt = require('bcrypt');
const User = require('../../models/user');
const {
  listUsers,
  userById,
  createUser,
  updateUser,
  deleteUser,
} = require('../../controllers/userController');

// Mock para User.findOne
jest.mock('../../models/user', () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
}));

describe('Teste das funções relacionadas a usuários', () => {
  it('Deve listar todos os usuários', async () => {
    const users = [
      { id: 1, name: 'Usuário 1', email: 'usuario1@teste.com' },
      { id: 2, name: 'Usuário 2', email: 'usuario2@teste.com' },
    ];
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    User.findAll.mockResolvedValue(users);

    await listUsers({}, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(users);
  });

  it('Deve tratar erro ao listar todos os usuários', async () => {
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    User.findAll.mockRejectedValue(new Error('Erro no banco de dados'));

    await listUsers({}, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao listar usuários' });
  });

  it('Deve buscar um usuário por ID', async () => {
    const userId = 1;
    const user = { id: userId, name: 'Usuário 1', email: 'usuario1@teste.com' };
    const req = { params: { id: userId } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    User.findOne.mockResolvedValue(user);

    await userById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(user);
  });

  it('Deve lidar com usuário por ID não encontrado', async () => {
    const userId = 2;
    const req = { params: { id: userId } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    User.findOne.mockResolvedValue(null);

    await userById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Usuário não encontrado' });
  });

  it('Deve lidar com erro ao buscar usuário por ID', async () => {
    const userId = 1;
    const req = { params: { id: userId } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    User.findOne.mockRejectedValue(new Error('Erro no banco de dados'));

    await userById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro interno do servidor' });
  });

  it('Deve criar um novo usuário', async () => {
    const req = {
      body: {
        email: 'novousuario@teste.com',
        password: 'senha',
        role: 'user',
      },
    };
    const newUser = { id: 3, ...req.body };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    User.create.mockResolvedValue(newUser);

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(newUser);
  });

  it('Deve lidar com erro ao criar usuário', async () => {
    const req = {
      body: {
        email: 'novousuario@teste.com',
        password: 'senha',
        role: 'user',
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    User.create.mockRejectedValue(new Error('Erro no banco de dados'));

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao criar usuário' });
  });

  it('Deve atualizar um usuário existente', async () => {
    const userId = 2;
    const updatedData = {
      email: 'usuarioatualizado@teste.com',
      password: 'novasenha',
      role: 'admin',
    };
    const req = {
      params: { id: userId },
      body: updatedData,
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    await updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuário editado com sucesso' });
    expect(User.update).toHaveBeenCalledWith(updatedData, { where: { id: userId } });
  });

  it('Deve lidar com erro ao atualizar usuário', async () => {
    const userId = 1;
    const req = {
      params: { id: userId },
      body: {},
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    User.update.mockRejectedValue(new Error('Erro no banco de dados'));

    await updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao atualizar usuário' });
  });

  it('Deve excluir um usuário existente', async () => {
    const userId = 2;
    const req = {
      params: { id: userId },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    await deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuário excluído com sucesso' });
    expect(User.destroy).toHaveBeenCalledWith({ where: { id: userId } });
  });

  it('Deve lidar com erro ao excluir usuário', async () => {
    const userId = 1;
    const req = {
      params: { id: userId },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    User.destroy.mockRejectedValue(new Error('Erro no banco de dados'));

    await deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao excluir usuário' });
  });
});
