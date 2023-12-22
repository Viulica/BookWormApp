const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Prilagodite putanju prema vašoj datoteci s konfiguracijom baze podataka

const poruka = sequelize.define('poruka', {
  idporuka: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  txtporuka: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  vremozn: {
    type: DataTypes.DATE,
    allowNull: false
  },
  idposiljatelj: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'korisnik',
      key: 'idkorisnik'
    }
  },
  idprimatelj: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'korisnik',
      key: 'idkorisnik'
    }
  }
}, {
  sequelize,
  tableName: 'poruka',
  schema: 'public',
  timestamps: false,
  indexes: [
    {
      name: "poruka_pkey",
      unique: true,
      fields: [
        { name: "idporuka" },
      ]
    },
  ]
});

module.exports = poruka;