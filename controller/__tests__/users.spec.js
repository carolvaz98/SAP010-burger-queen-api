const User = require('../../models/user'); // Certifique-se de importar o módulo real ou um mock adequado
const {
  listUsers,
  userById,
  createUser,
  updateUser,
  deleteUser,
} = require('../../controllers/userController'); // Importe as funções que você deseja testar

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
    // Mock dos dados dos usuários
    const users = [
      { id: 1, name: 'Usuário 1', email: 'usuario1@teste.com' },
      { id: 2, name: 'Usuário 2', email: 'usuario2@teste.com' },
    ];
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Configurar o mock do User.findAll para retornar os usuários
    User.findAll.mockResolvedValue(users);

    // Chamar a função listUsers
    await listUsers({}, res);

    // Verificar se o status e o JSON da resposta são os esperados
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(users);
  });

  it('Deve buscar um usuário por ID', async () => {
    // Mock dos dados do usuário e da requisição
    const userId = 1;
    const user = { id: userId, name: 'Usuário 1', email: 'usuario1@teste.com' };
    const req = { params: { id: userId } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Configurar o mock do User.findOne para retornar o usuário
    User.findOne.mockResolvedValue(user);

    // Chamar a função userById
    await userById(req, res);

    // Verificar se o status e o JSON da resposta são os esperados
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(user);
  });

  it('Deve criar um novo usuário', async () => {
    // Mock dos dados do usuário e da requisição
    const req = {
      body: {
        name: 'Novo Usuário',
        email: 'novousuario@teste.com',
        password: 'senha',
        role: 'user',
      },
    };
    const newUser = { id: 3, ...req.body }; // O novo usuário criado
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Configurar o mock do User.create para retornar o novo usuário
    User.create.mockResolvedValue(newUser);

    // Chamar a função createUser
    await createUser(req, res);

    // Verificar se o status e o JSON da resposta são os esperados
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(newUser);
  });

  it('Deve atualizar um usuário existente', async () => {
    // Mock dos dados do usuário, da requisição e do ID do usuário
    const userId = 2;
    const updatedData = {
      name: 'Usuário Atualizado',
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

    // Chamar a função updateUser
    await updateUser(req, res);

    // Verificar se o status e a mensagem da resposta são os esperados
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuário editado com sucesso' });

    // Verificar se o mock do User.update foi chamado com os parâmetros corretos
    expect(User.update).toHaveBeenCalledWith(updatedData, { where: { id: userId } });
  });

  it('Deve excluir um usuário existente', async () => {
    // Mock do ID do usuário
    const userId = 2;
    const req = {
      params: { id: userId },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Chamar a função deleteUser
    await deleteUser(req, res);

    // Verificar se o status e a mensagem da resposta são os esperados
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuário excluído com sucesso' });

    // Verificar se o mock do User.destroy foi chamado com o ID correto
    expect(User.destroy).toHaveBeenCalledWith({ where: { id: userId } });
  });
});
