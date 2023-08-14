require('dotenv').config();

const dbConfig = {
  user: process.env.DB_USER || 'rote_db',
  password: process.env.DB_PASSWORD || 'senha_123',
  host: process.env.DB_HOST || 'db',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'mydatabase',
  dialect: process.env.DB_DIALECT || 'mysql',
};

const secret = process.env.JWT_SECRET;
const port = process.env.PORT || 8080;

module.exports = {
  dbConfig,
  secret,
  port,
};
