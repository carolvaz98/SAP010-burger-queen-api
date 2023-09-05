const Order = require('../../models/order'); // Certifique-se de importar o módulo real ou um mock adequado
const {
  listOrders,
  orderById,
  createOrder,
  updateOrder,
  deleteOrder,
} = require('../../controllers/orderController'); // Importe as funções que você deseja testar

// Mock para Order.findAll
jest.mock('../../models/order', () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
}));

describe('Teste das funções relacionadas a pedidos', () => {
  it('Deve listar todos os pedidos', async () => {
    // Mock dos dados do pedido
    const orders = [{ id: 1, status: 'Em andamento' }, { id: 2, status: 'Concluído' }];
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Configurar o mock do Order.findAll para retornar os pedidos
    Order.findAll.mockResolvedValue(orders);

    // Chamar a função listOrders
    await listOrders({}, res);

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

  it('Deve criar um novo pedido', async () => {
    // Mock dos dados do pedido e da requisição
    const req = {
      body: {
        status: 'Em andamento',
        request: 'Hamburguer com batatas fritas',
        client: 'João',
        entry_time: '12:00',
        exit_time: '13:00',
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

  it('Deve atualizar um pedido existente', async () => {
    // Mock dos dados do pedido, da requisição e do ID do pedido
    const orderId = 2;
    const updatedData = {
      status: 'Concluído',
      request: 'Hamburguer com queijo',
      client: 'Maria',
      entry_time: '13:30',
      exit_time: '14:00',
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
});
