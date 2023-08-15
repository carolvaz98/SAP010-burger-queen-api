const express = require('express');
const config = require('./config');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/error');
const customerRoutes = require('./routes/customerRoutes');

const { port, secret } = config;
const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(authMiddleware(secret));

// Registro das rotas
app.use('/api', customerRoutes);

// Middleware para tratamento de erros
app.use(errorHandler);