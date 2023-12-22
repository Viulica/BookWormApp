const sequelize = require('./db');
async function initDatabase() {
   try {
     await sequelize.authenticate();
     console.log('Connection to the database has been established successfully.');
     // Sinkronizacija modela s bazom podataka
     await sequelize.sync();
     console.log('Models have been synchronized successfully.');
   } catch (error) {
     console.error('Unable to connect to the database:', error);
   }
}
 
module.exports = initDatabase;