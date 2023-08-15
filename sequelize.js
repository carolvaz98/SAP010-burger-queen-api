const Sequelize = require('sequelize');
const config = require('./config');

const { database, user, password, host, port, dialect } = config.dbConfig;

const sequelize = new Sequelize(database, user, password, {
  host: host,
  port: port,
  dialect: dialect,
});

// Importe os modelos
const Customer = require('./models/customer');
// Importe outros modelos, se houver

// Defina as associações entre os modelos, se necessário
// Exemplo:
// Customer.hasMany(Order);
// Order.belongsTo(Customer);

// Sincronize os modelos com o banco de dados
sequelize.sync({ force: true }) // Use force: true apenas durante o desenvolvimento para recriar as tabelas
  .then(() => {
    console.log('Tabelas sincronizadas com o banco de dados.');
  })
  .catch((err) => {
    console.error('Erro ao sincronizar tabelas:', err);
  });

module.exports = sequelize;
