const cita = require('./cita');
const knjiga = require('./knjiga');
const korisnik = require('./korisnik'); // Prilagodite putanju prema vašem direktoriju s modelima
const poruka = require('./poruka');
const prati = require('./prati');
const recenzija = require('./recenzija');

const data = {
   korisnik,
   knjiga,
   cita,
   poruka,
   prati,
   recenzija
};


module.exports = data;