const Sequelize = require('sequelize');
const config = require('./config');

const { database, user, password, host, port, dialect } = config.dbConfig;

const sequelize = new Sequelize(database, user, password, {
  host: host,
  port: port,
  dialect: dialect,
});

// os modelos
const User = require('./models/user');

sequelize.sync({ force: config.environment === 'development' })
  .then(() => {
    console.log('Tabelas sincronizadas com o banco de dados.');
  })
  .catch((err) => {
    console.error('Erro ao sincronizar tabelas:', err);
  });

module.exports = sequelize;
