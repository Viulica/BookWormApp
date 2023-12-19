const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Prilagodite putanju prema vašoj datoteci s konfiguracijom baze podataka

const knjiga = sequelize.define('knjiga', {
  idknjiga: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  naslov: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  'žanr': {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  godizd: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  opis: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  isbn: {
    type: DataTypes.STRING(13),
    allowNull: false
  },
  idkorisnik: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'korisnik',
      key: 'idkorisnik'
    }
  }
}, {
  sequelize,
  tableName: 'knjiga',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "knjiga_pkey",
      unique: true,
      fields: [
        { name: "idknjiga" },
      ]
    },
  ]
});

module.exports = knjiga;