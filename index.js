const express = require('express');
const config = require('./config');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/error');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');

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
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/auth', authRoutes);

// Middleware para tratamento de erros
app.use(errorHandler);

const PORT = port || 8888;
app.listen(PORT, () => {
});
