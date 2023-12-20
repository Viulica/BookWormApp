const cita = require('./cita');
const knjiga = require('./knjiga');
const korisnik = require('./korisnik'); // Prilagodite putanju prema vašem direktoriju s modelima
const poruka = require('./poruka');
const prati = require('./prati');
const recenzija = require('./recenzija');


knjiga.belongsToMany(korisnik, { as: 'idkorisnik_korisniks', through: cita, foreignKey: "idknjiga", otherKey: "idkorisnik" });
korisnik.belongsToMany(knjiga, { as: 'idknjiga_knjigas', through: cita, foreignKey: "idkorisnik", otherKey: "idknjiga" });
korisnik.belongsToMany(korisnik, { as: 'idkorisnik2_korisniks', through: prati, foreignKey: "idkorisnik1", otherKey: "idkorisnik2" });
korisnik.belongsToMany(korisnik, { as: 'idkorisnik1_korisniks', through: prati, foreignKey: "idkorisnik2", otherKey: "idkorisnik1" });
cita.belongsTo(knjiga, { as: "idknjiga_knjiga", foreignKey: "idknjiga" });
knjiga.hasMany(cita, { as: "cita", foreignKey: "idknjiga" });
recenzija.belongsTo(knjiga, { as: "idknjiga_knjiga", foreignKey: "idknjiga" });
knjiga.hasMany(recenzija, { as: "recenzijas", foreignKey: "idknjiga" });
cita.belongsTo(korisnik, { as: "idkorisnik_korisnik", foreignKey: "idkorisnik" });
korisnik.hasMany(cita, { as: "cita", foreignKey: "idkorisnik" });
knjiga.belongsTo(korisnik, { as: "idkorisnik_korisnik", foreignKey: "idkorisnik" });
korisnik.hasMany(knjiga, { as: "knjigas", foreignKey: "idkorisnik" });
poruka.belongsTo(korisnik, { as: "idposiljatelj_korisnik", foreignKey: "idposiljatelj" });
korisnik.hasMany(poruka, { as: "porukas", foreignKey: "idposiljatelj" });
poruka.belongsTo(korisnik, { as: "idprimatelj_korisnik", foreignKey: "idprimatelj" });
korisnik.hasMany(poruka, { as: "idprimatelj_porukas", foreignKey: "idprimatelj" });
prati.belongsTo(korisnik, { as: "idkorisnik1_korisnik", foreignKey: "idkorisnik1" });
korisnik.hasMany(prati, { as: "pratis", foreignKey: "idkorisnik1" });
prati.belongsTo(korisnik, { as: "idkorisnik2_korisnik", foreignKey: "idkorisnik2" });
korisnik.hasMany(prati, { as: "idkorisnik2_pratis", foreignKey: "idkorisnik2" });
recenzija.belongsTo(korisnik, { as: "idkorisnik_korisnik", foreignKey: "idkorisnik" });
korisnik.hasMany(recenzija, { as: "recenzijas", foreignKey: "idkorisnik" });


const data = {
   korisnik,
   knjiga,
   cita,
   poruka,
   prati,
   recenzija
};


module.exports = data;