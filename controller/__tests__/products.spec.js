const Product = require('../../models/product');
const {
  listProducts,
  productById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../../controllers/productController');

// Mock para Product.findAll
jest.mock('../../models/product', () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
}));

describe('Teste das funções relacionadas a produtos', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Deve listar todos os produtos', async () => {
    // Mock dos dados do produto
    const products = [{ id: 1, name: 'Produto 1' }, { id: 2, name: 'Produto 2' }];
    const req = {};
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // mock do Product.findAll p retornar os produtos
    Product.findAll.mockResolvedValue(products);

    await listProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(products);
  });

  it('Deve buscar um produto por ID', async () => {
    // Mock dos dados do produto e da requisição
    const productId = 1;
    const product = { id: productId, name: 'Produto 1' };
    const req = { params: { productId } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // mock do Product.findOne
    Product.findOne.mockResolvedValue(product);

    // Chamar a função productById
    await productById(req, res);

    // Verificar se o status e o JSON da resposta são os esperados
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(product);
  });

  it('Deve tratar erro ao buscar um produto por ID', async () => {
    // Mock da requisição com um ID inválido
    const productId = 999; // ID que não existe
    const req = { params: { productId } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Configurar o mock do Product.findOne para retornar null (produto não encontrado)
    Product.findOne.mockResolvedValue(null);

    // Chamar a função productById
    await productById(req, res);

    // Verificar se o status e o JSON da resposta são os esperados
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'O produto solicitado não existe' });
  });

  it('Deve criar um novo produto', async () => {
    // Mock dos dados do produto e da requisição
    const req = {
      body: {
        name: 'Novo Produto',
        price: 10.99,
        image: 'produto.jpg',
        type: 'Alimento',
      },
    };
    const newProduct = { id: 3, ...req.body }; // O novo produto criado
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Configurar o mock do Product.create para retornar o novo produto
    Product.create.mockResolvedValue(newProduct);

    // Chamar a função createProduct
    await createProduct(req, res);

    // Verificar se o status e o JSON da resposta são os esperados
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(newProduct);
  });

  it('Deve tratar erro ao criar um novo produto', async () => {
    // Mock dos dados do produto e da requisição com dados inválidos
    const req = {
      body: {
      // Dados inválidos para forçar um erro
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Configurar o mock do Product.create para lançar um erro
    Product.create.mockRejectedValue(new Error('Erro ao criar produto'));

    // Chamar a função createProduct
    await createProduct(req, res);

    // Verificar se o status e o JSON da resposta são os esperados
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao criar produto' });
  });

  // Teste para updateProduct
  it('Deve atualizar um produto com sucesso', async () => {
    const mockProductId = 1;
    const mockRequestBody = {
      name: 'Produto Atualizado',
      price: 25.99,
      image: 'imagem_atualizada.jpg',
      type: 'Tipo Atualizado',
    };
    Product.update = jest.fn().mockResolvedValue([1]); // Indica que um registro foi atualizado

    const req = { params: { id: mockProductId }, body: mockRequestBody };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await updateProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Produto atualizado com sucesso' });
  });

  it('Deve tratar erros ao atualizar um produto', async () => {
    const mockProductId = 1;
    const mockRequestBody = {
      name: 'Produto Atualizado',
      price: 25.99,
      image: 'imagem_atualizada.jpg',
      type: 'Tipo Atualizado',
    };
    Product.update = jest.fn().mockRejectedValue(new Error('Erro ao atualizar produto'));

    const req = { params: { id: mockProductId }, body: mockRequestBody };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await updateProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao atualizar produto' });
  });

  // Teste para deleteProduct
  it('Deve excluir um produto com sucesso', async () => {
    const mockProductId = 1;
    Product.destroy = jest.fn().mockResolvedValue(1); // registro foi excluído

    const req = { params: { id: mockProductId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalledWith({ message: 'Produto excluído com sucesso' });
  });

  it('Deve tratar erros ao excluir um produto', async () => {
    const mockProductId = 1;
    Product.destroy = jest.fn().mockRejectedValue(new Error('Erro ao excluir produto'));

    const req = { params: { id: mockProductId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao excluir produto' });
  });
});
