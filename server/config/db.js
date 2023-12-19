const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('BookWormAppDB', 'postgres', 'baze', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;
