const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Prilagodite putanju prema vašoj datoteci s konfiguracijom baze podataka

const korisnik = sequelize.define('korisnik', {
  idkorisnik: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  datrod: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  korime: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  lozinka: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  ime: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  prezime: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  info: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tipkorisnika: {
    type: DataTypes.STRING(10),
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'korisnik',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "korisnik_pkey",
      unique: true,
      fields: [
        { name: "idkorisnik" },
      ]
    },
  ]
});

module.exports = korisnik;