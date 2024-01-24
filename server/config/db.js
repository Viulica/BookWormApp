const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('bookwormdb', 'admin', '5GXsuJcJ9Hr60hHEFDGKyKAMICtzglWZ', {
  host: 'dpg-cmolc45a73kc73b7c890-a',
  dialect: 'postgres',
});



module.exports = sequelize;

