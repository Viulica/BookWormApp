const express = require('express');
const router = express.Router();
const data = require('../models/data');
const verifyToken = require('./tokenVerification');

const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.get('/', verifyToken, async (req, res) => {
   try {
      const userId = req.user.userId;
      const user = await data.korisnik.findOne({
         where: {
            idkorisnik: userId
         }
      })

      if (user) {
         res.status(200).json(user);
      } else {
         res.status(404).json({ message: 'Korisnik nije pronađen' });
      }
   }
   catch (error) {
      console.error('Greška prilikom dohvaćanja profila:', error);
      res.status(500).json({ error: 'Greška prilikom dohvaćanja knjiga.' });
   }
});

router.get('/reader/myBooks', verifyToken, async (req, res) => {
   try {
      const userId = req.user.userId;
      const books = await data.cita.findAll({
         where: {
            idkorisnik: userId,
         },
         include: [
            {
               model: data.korisnik,
               as: 'idkorisnik_korisnik',
            },
            {
               model: data.knjiga,
               as: 'idknjiga_knjiga',
               include: [
                  {
                     model: data.korisnik,
                     as: 'idkorisnik_korisnik'
                  }
               ]
            }
         ]
      })

      if (books.length === 0) {
         return res.status(404).json(books);
      }

      const formattedBooks = books.map(book => {
         const formattedBook = book.get({ plain: true });

         formattedBook.idkorisnikCitatelj = formattedBook.idkorisnik_korisnik.idkorisnik;
         formattedBook.idkorisnikAutor = formattedBook.idknjiga_knjiga.idkorisnik;
         formattedBook.status = formattedBook.status;
         formattedBook.naslov = formattedBook.idknjiga_knjiga.naslov;
         formattedBook.godizd = formattedBook.idknjiga_knjiga.godizd;
         formattedBook.imeAutor = formattedBook.idknjiga_knjiga.idkorisnik_korisnik.ime;
         formattedBook.prezAutor = formattedBook.idknjiga_knjiga.idkorisnik_korisnik.prezime;

         delete formattedBook.idkorisnik;
         delete formattedBook.idkorisnik_korisnik;
         delete formattedBook.idknjiga_knjiga;

         console.log(formattedBook);
         return formattedBook;
      });


      res.status(200).json(formattedBooks);
   } catch (error) {
      console.error('Greška prilikom dohvaćanja knjiga:', error);
      res.status(500).json({ error: 'Greška prilikom dohvaćanja knjiga.' });
   }
});

router.get('/author/myBooks', verifyToken, async (req, res) => {
   try {
      const userId = req.user.userId;
      const books = await data.knjiga.findAll({
         where: {
            idkorisnik: userId
         }
      })

      res.status(200).json(books);
   }
   catch (error) {
      console.error('Greška prilikom dohvaćanja knjiga:', error);
      res.status(500).json({ error: 'Greška prilikom dohvaćanja knjiga.' });
   }
});

router.post('/author/addBook', upload.single('coverImage'), async (req, res) => {
   try {
      const { title, genre, published, about, isbn, userId, coverImage } = req.body;
      // const coverImage = req.file.buffer; // binarni podaci slike

      // Kreiraj novu knjigu
      const newBook = await data.knjiga.create({
         naslov: title,
         zanr: genre,
         godizd: published,
         opis: about,
         isbn: isbn,
         idkorisnik: userId,
         slika: coverImage,
      });

      return res.status(201).json(newBook);
   } catch (error) {
      console.error('Greška prilikom dodavanja knjige:', error);
      return res.status(500).json({ error: 'Interna server greška' });
   }
});

router.get('/admin/allUsers', verifyToken, async (req, res) => {
   const typeOfUser = req.user.typeOfUser;
   if (typeOfUser !== "admin") {
      res.status(401).json("Nemaš pristup!");
   }

   try {
      const allUsers = await data.korisnik.findAll();
      res.status(200).json(allUsers);
   } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
   }
});

router.get('/admin/allBooks', verifyToken, async (req, res) => {
   const typeOfUser = req.user.typeOfUser;
   if (typeOfUser !== "admin") {
      res.status(401).json("Nemaš pristup!");
   }

   try {
      const allBooks = (await data.knjiga.findAll({
         include: [
            {
               model: data.korisnik,
               as: 'idkorisnik_korisnik',
               attributes: ['ime', 'prezime', 'datrod', 'info']
            }
         ]
      }));

      // const allBooks = await data.knjiga.findAll();
      const formattedBooks = allBooks.map(book => {
         const formattedBook = book.get({ plain: true }); // Pretvaranje Sequelize instance u običan objekt

         // Zamjena asocijativnog modela s atributima
         formattedBook.naslov = formattedBook.naslov;
         formattedBook.zanr = formattedBook.zanr;
         formattedBook.opis = formattedBook.opis;
         formattedBook.datizd = formattedBook.datizd;
         formattedBook.isbn = formattedBook.isbn;
         formattedBook.ime = formattedBook.idkorisnik_korisnik.ime;
         formattedBook.prezime = formattedBook.idkorisnik_korisnik.prezime;
         formattedBook.datrod = formattedBook.idkorisnik_korisnik.datrod;
         formattedBook.info = formattedBook.idkorisnik_korisnik.info;

         delete formattedBook.idkorisnik_korisnik; // Uklanjanje originalnog asocijativnog modela

         return formattedBook;
      })
      // console.log(formattedBooks);
      res.status(200).json(formattedBooks);
   }
   catch (error) {
      console.log('Error fetching books:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
   }
});

router.post('/change', verifyToken,async (req, res) => {
   try {
      const userId = req.user.userId;
      const { ime, prezime, info, korime, lozinka, datrod } = req.body;

      const newData = {
         datrod,
         korime,
         lozinka,
         ime,
         prezime,
         info
      };

      const result = await data.korisnik.update(newData, {
         where: {
            idkorisnik: userId
         }
      });
      
      if (result[0] === 1) {
         res.status(200).json({ message: 'Podaci su uspješno ažurirani.' });
       } else {
         res.status(404).json({ message: 'Korisnik nije pronađen ili podaci nisu ažurirani.' });
       }
   }
   catch (error) {
      console.error('Greška prilikom ažuriranja:', error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
});
module.exports = router;