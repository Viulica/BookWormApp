const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Prilagodite putanju prema vašoj datoteci s konfiguracijom baze podataka

const prati = sequelize.define('prati', {
  idkorisnik1: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'korisnik',
      key: 'idkorisnik'
    }
  },
  idkorisnik2: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'korisnik',
      key: 'idkorisnik'
    }
  }
}, {
  sequelize,
  tableName: 'prati',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "prati_pkey",
      unique: true,
      fields: [
        { name: "idkorisnik1" },
        { name: "idkorisnik2" },
      ]
    },
  ]
});

module.exports = prati;