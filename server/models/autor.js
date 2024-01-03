const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Prilagodite putanju prema vašoj datoteci s konfiguracijom baze podataka

const autor = sequelize.define('autor', {
  idautor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoincrement: true
  },
  imeautor: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  prezimeautor: {
    type: DataTypes.STRING(50),
    allowNull: true
  }, 
  datumrod: {
    type:DataTypes.DATE,
    allowNull: true
  }

}, {
  sequelize,
  tableName: 'autor',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "autor_pkey",
      unique: true,
      fields: [
        { name: "idautor" },
      ]
    },
  ]
});

module.exports = autor;