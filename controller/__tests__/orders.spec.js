const Order = require('../../models/order');
const {
  listOrders,
  orderById,
  createOrder,
  updateOrder,
  deleteOrder,
} = require('../../controllers/orderController');

jest.mock('../../models/order', () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
}));

describe('Teste das funções relacionadas a pedidos', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Deve listar todos os pedidos', async () => {
    // Mock dos dados do pedido
    const orders = [{ id: 1, status: 'Em andamento' }, { id: 2, status: 'Concluído' }];
    const req = {};
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Configurar o mock do Order.findAll para retornar os pedidos
    Order.findAll.mockResolvedValue(orders);

    // Chamar a função listOrders
    await listOrders(req, res);

    // Verificar se o status e o JSON da resposta são os esperados
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(orders);
  });

  it('Deve buscar um pedido por ID', async () => {
    // Mock dos dados do pedido e da requisição
    const orderId = 1;
    const order = { id: orderId, status: 'Em andamento' };
    const req = { params: { orderId } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Configurar o mock do Order.findOne para retornar o pedido
    Order.findOne.mockResolvedValue(order);

    // Chamar a função orderById
    await orderById(req, res);

    // Verificar se o status e o JSON da resposta são os esperados
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(order);
  });

  it('Deve tratar erro ao buscar um pedido por ID', async () => {
    // Mock da requisição com um ID inválido
    const orderId = 999; // ID que não existe
    const req = { params: { orderId } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Configurar o mock do Order.findOne para retornar null (pedido não encontrado)
    Order.findOne.mockResolvedValue(null);

    // Chamar a função orderById
    await orderById(req, res);

    // Verificar se o status e o JSON da resposta são os esperados
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'O pedido solicitado não existe' });
  });

  it('Deve criar um novo pedido', async () => {
    // Mock dos dados do pedido e da requisição
    const req = {
      body: {
        client: 'João',
        products: 'Hamburguer com batatas fritas',
        status: 'Em andamento',
        dateProcessed: '12:00',
      },
    };
    const newOrder = { id: 3, ...req.body }; // O novo pedido criado
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Configurar o mock do Order.create para retornar o novo pedido
    Order.create.mockResolvedValue(newOrder);

    // Chamar a função createOrder
    await createOrder(req, res);

    // Verificar se o status e o JSON da resposta são os esperados
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(newOrder);
  });

  it('Deve tratar erro ao criar um novo pedido', async () => {
    // Mock dos dados do pedido e da requisição
    const req = {
      body: {
        // Dados inválidos para forçar um erro
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Configurar o mock do Order.create para lançar um erro
    Order.create.mockRejectedValue(new Error('Erro ao criar pedido'));

    // Chamar a função createOrder
    await createOrder(req, res);

    // Verificar se o status e o JSON da resposta são os esperados
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao criar pedido' });
  });
  it('Deve atualizar um pedido existente', async () => {
    // Mock dos dados do pedido, da requisição e do ID do pedido
    const orderId = 2;
    const updatedData = {
      client: 'Maria',
      products: 'Hamburguer com queijo',
      status: 'Concluído',
      dateProcessed: '13:30',
    };
    const req = {
      params: { id: orderId },
      body: updatedData,
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Chamar a função updateOrder
    await updateOrder(req, res);

    // Verificar se o status e a mensagem da resposta são os esperados
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Pedido atualizado com sucesso' });

    // Verificar se o mock do Order.update foi chamado com os parâmetros corretos
    expect(Order.update).toHaveBeenCalledWith(updatedData, { where: { id: orderId } });
  });

  it('Deve tratar erro ao atualizar um pedido', async () => {
    // Mock dos dados da requisição e do ID do pedido
    const orderId = 2;
    const updatedData = {
      // Dados inválidos para forçar um erro
    };
    const req = {
      params: { id: orderId },
      body: updatedData,
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Configurar o mock do Order.update para lançar um erro
    Order.update.mockRejectedValue(new Error('Erro ao atualizar pedido'));

    // Chamar a função updateOrder
    await updateOrder(req, res);

    // Verificar se o status e o JSON da resposta são os esperados
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao atualizar pedido' });
  });

  it('Deve excluir um pedido existente', async () => {
    // Mock do ID do pedido
    const orderId = 2;
    const req = {
      params: { id: orderId },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Chamar a função deleteOrder
    await deleteOrder(req, res);

    // Verificar se o status e a mensagem da resposta são os esperados
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalledWith({ message: 'Pedido excluído com sucesso' });

    // Verificar se o mock do Order.destroy foi chamado com o ID correto
    expect(Order.destroy).toHaveBeenCalledWith({ where: { id: orderId } });
  });

  it('Deve tratar erro ao excluir um pedido', async () => {
    // Mock do ID do pedido
    const orderId = 2;
    const req = {
      params: { id: orderId },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Configurar o mock do Order.destroy para lançar um erro
    Order.destroy.mockRejectedValue(new Error('Erro ao excluir pedido'));

    // Chamar a função deleteOrder
    await deleteOrder(req, res);

    // Verificar se o status e o JSON da resposta são os esperados
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao excluir pedido' });
  });
});
