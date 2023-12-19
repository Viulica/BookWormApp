const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Prilagodite putanju prema vašoj datoteci s konfiguracijom baze podataka

const cita = sequelize.define('cita', {
  idkorisnik: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'korisnik',
      key: 'idkorisnik'
    }
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  idknjiga: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'knjiga',
      key: 'idknjiga'
    }
  }
}, {
  sequelize,
  tableName: 'cita',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "cita_pkey",
      unique: true,
      fields: [
        { name: "idknjiga" },
        { name: "idkorisnik" },
      ]
    },
  ]
});

module.exports = cita;