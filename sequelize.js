const Sequelize = require('sequelize');
const { dbConfig } = require('./config');

const {
  database,
  user,
  password,
  host,
  port,
  dialect,
} = dbConfig;

const dbName = process.env.NODE_ENV === 'test' ? dbConfig.testDatabase : database;

const sequelize = new Sequelize(dbName, user, password, {
  host,
  port,
  dialect,
});

sequelize.sync({ force: process.env.NODE_ENV === 'development' })
  .then(() => {
    console.log('Tabelas sincronizadas com sucesso.');
  })
  .catch((err) => {
    console.error('Erro ao sincronizar tabelas:', err);
  });

module.exports = sequelize;
