const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Prilagodite putanju prema vašoj datoteci s konfiguracijom baze podataka

const recenzija = sequelize.define('recenzija', {
  idrecenzija: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  idkorisnik: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'korisnik',
      key: 'idkorisnik'
    },
    unique: "recenzija_idknjiga_idkorisnik_key"
  },
  ocjena: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  txtrecenzija: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  idknjiga: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'knjiga',
      key: 'idknjiga'
    },
    unique: "recenzija_idknjiga_idkorisnik_key"
  }
}, {
  sequelize,
  tableName: 'recenzija',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "recenzija_idknjiga_idkorisnik_key",
      unique: true,
      fields: [
        { name: "idknjiga" },
        { name: "idkorisnik" },
      ]
    },
    {
      name: "recenzija_pkey",
      unique: true,
      fields: [
        { name: "idrecenzija" },
      ]
    },
  ]
});

module.exports = recenzija;