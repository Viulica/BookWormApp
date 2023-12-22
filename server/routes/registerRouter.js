const express = require('express');
const router = express.Router();
const data = require('../models/data');

router.post('/', async (req, res) => {

   try {
      const { datrod, korime, lozinka, ime, prezime, info, tipkorisnika } = req.body;

      // možda dodati da tipkorisnika bude predan kao 0 ili 1 pa onda ja stavljam string "čitatelj" ili "autor"

      const existingUser = await data.korisnik.findOne({
         where: {
            korime: korime
         }
      });

      if (existingUser) {
         return res.status(409).json({ message: "Korisnik već postoji" });
      }

      const newUser = await data.korisnik.create({
         datrod, korime, lozinka, ime, prezime, info, tipkorisnika
      });

      res.status(201).json({ message: "Korisnik uspješno stvoren", user: newUser });
   }
   catch (error) {
      console.error('Greška prilikom stvaranja korisnika:', error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
});


module.exports = router;