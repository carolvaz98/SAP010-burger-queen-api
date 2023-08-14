const express = require('express');
const config = require('./config');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/error');
const customerRoutes = require('./routes/customerRoutes');
const pkg = require('./package.json');
const { sequelize } = require('./sequelize');
const Sequelize = require('sequelize');

const { port, dbUrl, secret } = config;
const app = express();

// Import and set up models
const Customer = require('./models/customer');

// Import controllers
const customerController = require('./controllers/customerController');

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(authMiddleware(secret));

// Register routes
app.use('/api', customerRoutes); // Use as rotas dos customers

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.info(`Server listening on port ${port}`);
});
