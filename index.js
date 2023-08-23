const express = require('express');
const config = require('./config');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/error');
const userRoutes = require('./routes/userRoutes'); // Importe as rotas de usuários
const productRoutes = require('./routes/productRoutes'); // Importe as rotas de produtos
const orderRoutes = require('./routes/orderRoutes'); // Importe as rotas de pedidos

const { port, secret } = config;
const app = express();

app.get('/', (req, res) => {
  res.send('Bem-vindo à minha API!');
});

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(authMiddleware(secret));

// Registro das rotas
app.use('/api/users', userRoutes); // Rotas de usuários
app.use('/api/products', productRoutes); // Rotas de produtos
app.use('/api/orders', orderRoutes); // Rotas de pedidos

// Middleware para tratamento de erros
app.use(errorHandler);

const PORT = port || 8080;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
