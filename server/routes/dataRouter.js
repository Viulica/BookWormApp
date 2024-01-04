const express = require('express');
const router = express.Router();
const verifyToken = require('./tokenVerification');
const data = require('../models/data');

const profileRouter = require('./profileRouter');

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

router.get('/book/:id', async (req, res) => {
   const bookId = req.params.id;

   try {
      const book = await data.knjiga.findOne({
         where: {
            idknjiga: bookId
         },
         include: [
            {
               model: data.recenzija,
               as: 'recenzijas',
               include: [
                  {
                     model: data.korisnik,
                     as: 'idkorisnik_korisnik'
                  }
               ]
            },
            {
               model: data.korisnik,
               as: 'idkorisnik_korisnik'
            }
         ]
      })

      
      const formattedBook = book.toJSON();

      // autor knjige
      formattedBook.autorKnjiga = formattedBook.idkorisnik_korisnik;

      // recenzije
      formattedBook.recenzije = formattedBook.recenzijas;
      for (var i = 0; i < formattedBook.recenzije.length; i++){
         formattedBook.recenzije[i].idAutorRecenzija = formattedBook.recenzije[i].idkorisnik;
         formattedBook.recenzije[i].autorRecenzijaIme = formattedBook.recenzije[i].idkorisnik_korisnik.ime;
         formattedBook.recenzije[i].autorRecenzijaPrezime = formattedBook.recenzije[i].idkorisnik_korisnik.prezime;

         delete formattedBook.recenzije[i].idknjiga;
         delete formattedBook.recenzije[i].idkorisnik;
         delete formattedBook.recenzije[i].idkorisnik_korisnik;
      }
      
      delete formattedBook.autorKnjiga.korime;
      delete formattedBook.autorKnjiga.lozinka;
      delete formattedBook.autorKnjiga.tipkorisnika;
      
      delete formattedBook.idkorisnik;
      delete formattedBook.idkorisnik_korisnik;
      delete formattedBook.recenzijas;

      res.status(200).json(formattedBook);
   }
   catch (error) {
      console.log("Error fetching book: ", error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
   }
});

router.get('/allBooks', async(req, res) => {
   try {

      const allAuthors = await data.korisnik.findAll({
         where: {
            tipkorisnika: "autor"
         },
         raw: true,
         attributes: ['idkorisnik', 'ime', 'prezime']
      });
      
      const allBooks = await data.knjiga.findAll({
         raw: true,
         attributes: ['idknjiga', 'naslov', 'idkorisnik', 'slika']
      });


      let books = [];
      for (let book of allBooks) {
         for (let author of allAuthors) {
            if (book.idkorisnik === author.idkorisnik) {
               console.log(book)
               const allReviews = await data.recenzija.findAll({
                  where: {
                     idknjiga: book.idknjiga
                  },
                  raw: true,
                  attributes: ['ocjena']
               });
               let ocjena = 0;
               for (let i = 0; i < allReviews.length; i++) {
                  ocjena += allReviews[i].ocjena;
               }
               books.push({
                  naslov: book.naslov,
                  autor: author.ime + " " + author.prezime,
                  src: book.slika,
                  rating: allReviews.length === 0 ? '-' : ocjena / allReviews.length
               });
            }
         }
      }

      res.status(200).json(books);
   }
   catch (error) {
      console.error('Error fetching books:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
   }
})

router.post('/book/rating/:bookId/:userId', async (req, res) => {
   // res.json(req.params.bookId + " - " + req.params.userId + " : " + req.body.text);
   try {
      const idknjiga = req.params.bookId;
      const idkorisnik = req.params.userId;
      const { txtrecenzija, ocjena } = req.body;

      const newRating = await data.recenzija.create({
         idkorisnik, ocjena, txtrecenzija, idknjiga
      });

      res.status(201).json({ message: "Recenzija objavljena", rating: newRating });
   }
   catch (error) {
      console.error('Greška prilikom stvaranja korisnika:', error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
})

module.exports = router;