const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('BookWormAppDB', 'bookwormadmin', 'pass', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;
