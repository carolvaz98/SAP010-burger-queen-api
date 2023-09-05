const Product = require('../../models/product'); // Certifique-se de importar o módulo real ou um mock adequado
const {
  listProducts,
  productById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../../controllers/productController'); // Importe as funções que você deseja testar

// Mock para Product.findAll
jest.mock('../../models/product', () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
}));

describe('Teste das funções relacionadas a produtos', () => {
  it('Deve listar todos os produtos', async () => {
    // Mock dos dados dos produtos
    const products = [
      { id: 1, name: 'Hamburguer', price: 10.0 },
      { id: 2, name: 'Batatas Fritas', price: 5.0 },
    ];
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Configurar o mock do Product.findAll para retornar os produtos
    Product.findAll.mockResolvedValue(products);

    // Chamar a função listProducts
    await listProducts({}, res);

    // Verificar se o status e o JSON da resposta são os esperados
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(products);
  });

  it('Deve buscar um produto por ID', async () => {
    // Mock dos dados do produto e da requisição
    const productId = 1;
    const product = { id: productId, name: 'Hamburguer', price: 10.0 };
    const req = { params: { productId } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Configurar o mock do Product.findOne para retornar o produto
    Product.findOne.mockResolvedValue(product);

    // Chamar a função productById
    await productById(req, res);

    // Verificar se o status e o JSON da resposta são os esperados
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(product);
  });

  it('Deve criar um novo produto', async () => {
    // Mock dos dados do produto e da requisição
    const req = {
      body: {
        name: 'Novo Produto',
        price: 15.0,
        type: 'Comida',
        quantity: 100,
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

  it('Deve atualizar um produto existente', async () => {
    // Mock dos dados do produto, da requisição e do ID do produto
    const productId = 2;
    const updatedData = {
      name: 'Hamburguer de Queijo',
      price: 12.0,
      type: 'Comida',
      quantity: 80,
    };
    const req = {
      params: { id: productId },
      body: updatedData,
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Chamar a função updateProduct
    await updateProduct(req, res);

    // Verificar se o status e a mensagem da resposta são os esperados
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Produto atualizado com sucesso' });

    // Verificar se o mock do Product.update foi chamado com os parâmetros corretos
    expect(Product.update).toHaveBeenCalledWith(updatedData, { where: { id: productId } });
  });

  it('Deve excluir um produto existente', async () => {
    // Mock do ID do produto
    const productId = 2;
    const req = {
      params: { id: productId },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Chamar a função deleteProduct
    await deleteProduct(req, res);

    // Verificar se o status e a mensagem da resposta são os esperados
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalledWith({ message: 'Produto excluído com sucesso' });

    // Verificar se o mock do Product.destroy foi chamado com o ID correto
    expect(Product.destroy).toHaveBeenCalledWith({ where: { id: productId } });
  });
});
