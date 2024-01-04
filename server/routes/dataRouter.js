const express = require('express');
const router = express.Router();
const verifyToken = require('./tokenVerification');
const data = require('../models/data');

const profileRouter = require('./profileRouter');
const { literal, Op } = require('sequelize');

router.use('/profile', profileRouter);

router.get('/allAuthors', async (req, res) => {
   try {
      const allAuthors = await data.korisnik.findAll({
         where: {
            tipkorisnika: "autor",
         },
         attributes: ['idkorisnik', 'ime', 'prezime']
      })

      res.status(200).json(allAuthors);
   }
   catch (error) {
      console.error('Error fetching authors:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
   }
});

router.get('/getUserId', verifyToken, async (req, res) => {
   try {
      const userId = req.user.userId;
      const user = await data.korisnik.findOne({
         where: {
            idkorisnik: userId
         }
      })

      if (user) {
         res.status(200).json(userId);
      }
      else {
         res.status(404).json({ message: "Nemoguće pronaći korisnika" });
      }
   } catch (error) {
      console.log("Greška prilikom dohvaćanja id: ", error);
      res.status(500).json({ message: "Internal Server Error" });
   }
});

router.get('/getUserData/:idReciever', verifyToken, async (req, res) => {
   try {
      const userId = req.params.idReciever;
      const user = await data.korisnik.findOne({
         attributes: [
            'idkorisnik',
            'ime',
            'prezime',
            'korime',
            'datrod',
            'info'
         ],
         where: {
            idkorisnik: userId
         }
      })

      if (user) {
         res.status(200).json(user);
      }
      else {
         res.status(404).json({ message: "Nemoguće pronaći korisnika" });
      }
   } catch (error) {
      console.log("Greška prilikom dohvaćanja id: ", error);
      res.status(500).json({ message: "Internal Server Error" });
   }
});

router.get('/book/:id', async (req, res) => {
   const bookId = req.params.id;

   try {
      const book = await data.knjiga.findOne({
         attributes: [
            'idknjiga',
            'naslov',
            'zanr',
            'godizd',
            'opis',
            'isbn',
            ['idkorisnik', 'idkorisnikAutor'],
            'slika',
            [literal('idkorisnik_korisnik.datrod'), 'datrod'],
            [literal('idkorisnik_korisnik.ime'), 'imeAutor'],
            [literal('idkorisnik_korisnik.prezime'), 'prezAutor'],
            [literal('idkorisnik_korisnik.info'), 'info']
         ],
         where: {
            idknjiga: bookId
         },
         include: [
            {
               model: data.korisnik,
               as: 'idkorisnik_korisnik',
               attributes: []
            }
         ],
         raw: true,
      })

      console.log(book);

      res.status(200).json(book);
   }
   catch (error) {
      console.log("Error fetching book: ", error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
   }
});

router.get('/getRatings/:bookId', verifyToken, async (req, res) => {
   const userId = req.user.userId;
   const bookId = req.params.bookId;
   try {
      const ratings = await data.recenzija.findAll({
         attributes: [
            'idrecenzija',
            'idkorisnik',
            'ocjena',
            'txtrecenzija',
            'idknjiga',
            [literal('idkorisnik_korisnik.korime'), 'korime'],

         ],
         where: {
            idknjiga: bookId,
            idkorisnik: {
               [Op.not]: userId
            }
         },
         include: [
            {
               model: data.korisnik,
               as: 'idkorisnik_korisnik',
               attributes: []
            }
         ],
         raw: true,
      });

      console.log(ratings);

      res.status(200).json(ratings);

   } catch (error) {
      console.log("Error fetching ratings: ", error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
   }
})

router.get('/myRating/:bookId', verifyToken, async (req, res) => {
   const bookId = req.params.bookId;
   const userId = req.user.userId;

   try {
      const rating = await data.recenzija.findOne({
         where: {
            'idkorisnik': userId,
            'idknjiga': bookId
         },
         raw: true,
      })

      console.log(rating);

      if (rating) {
         res.status(200).json(rating);
      }
      else {
         res.status(404).json(rating);
      }
   } 
   catch (error) {
      console.log("Error fetching book: ", error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
   }

})

router.post('/rate/:bookId', verifyToken, async (req, res) => {
   const bookId = req.params.bookId;
   const userId = req.user.userId;
   const {ocjena, txtrecenzija} = req.body;
   console.log(req.body);
   console.log("bookId",bookId);
   console.log("userId",userId);
   console.log("grade",req.body.ocjena);
   
   try {
      const rating = await data.recenzija.findOne({
         where: {
            idkorisnik: userId,
            idknjiga: bookId
         },
         raw: true,
      })

      const newData = { ocjena, txtrecenzija };

      console.log(rating);

      if (!rating) {
         await data.recenzija.create({
            idkorisnik: userId, ocjena: ocjena, txtrecenzija: null, idknjiga: bookId
         })
         res.status(201).json("Added");
      }
      else {
         await data.recenzija.update(newData, {
               where: {
                  idkorisnik: userId,
                  idknjiga: bookId
               }
            }
         )
         res.status(200).json("Changed");
      }
   }
   catch (error) {
      console.log("Error fetching book: ", error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
   }
})

router.delete('/deleteRating/:rateId', verifyToken, async (req, res) => {
   try {
      const idrecenzija = req.params.rateId;
      const rating = await data.recenzija.findOne({
         where: {
            idrecenzija: idrecenzija
         }
      });

      if (rating) {
         await rating.destroy();
         res.status(200).json("Recenzija obrisana");
      }
      else {
         res.status(404).json("Recenzija ne postoji!");
      }
   }
   catch (error) {
      console.log("Error fetching book: ", error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });   
   }

})
module.exports = router;