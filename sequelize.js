const Sequelize = require('sequelize');
const config = require('./config');

const { database, user, password, host, port, dialect } = config.dbConfig;

const sequelize = new Sequelize(database, user, password, {
  host: host,
  port: port,
  dialect: dialect,
});

module.exports = sequelize;
