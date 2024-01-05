const express = require('express');
const router = express.Router();
const verifyToken = require('./tokenVerification');
const data = require('../models/data');

const profileRouter = require('./profileRouter');
const { Sequelize, literal, Op } = require('sequelize');

router.use('/profile', profileRouter);

router.get('/allAuthors', async (req, res) => {
   try {
      const allAuthors = await data.korisnik.findAll({
         attributes: [
            'idkorisnik',
         ],
         where: {
            tipkorisnika: "autor",
         },
         raw: true,
      })

      console.log(allAuthors);

      if (allAuthors) {
         for (const a of allAuthors) {
            var user = await data.korisnik.findOne({
               attributes: [
                  'ime',
                  'prezime',
                  'korime',
                  'datrod',
                  [
                     Sequelize.literal('(SELECT COUNT(*) FROM prati WHERE prati.idkorisnik1 = korisnik.idkorisnik)'),
                     'pratim'
                  ],
                  [
                     Sequelize.literal('(SELECT COUNT(*) FROM prati WHERE prati.idkorisnik2 = korisnik.idkorisnik)'),
                     'pratitelji'
                  ],
                  [
                     Sequelize.literal('(SELECT COUNT(*) FROM cita WHERE cita.idkorisnik = korisnik.idkorisnik)'),
                     'spremljeneKnjige'
                  ],
                  [
                     Sequelize.literal('(SELECT COUNT(*) FROM knjiga WHERE knjiga.idkorisnik = korisnik.idkorisnik)'),
                     'napisaoKnjiga'
                  ]
               ],
               where: {
                  idkorisnik: a.idkorisnik,
               },
               raw: true,
            });

            a.imeAutor = user.ime;
            a.prezAutor = user.prezime;
            a.korime = user.korime;
            a.datrod = user.datrod;
            a.pratim = user.pratim;
            a.pratitelji = user.pratitelji;
            a.spremljeneKnjige = user.spremljeneKnjige;
            a.napisaoKnjiga = user.napisaoKnjiga;
         }

         res.status(200).json(allAuthors);
      }
      else {
         res.status(404).json("Nema autora!");
      }
      
   }
   catch (error) {
      console.error('Error fetching authors:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
   }
});

router.post('/findAuthors', async (req, res) => {
   const { searchTerm } = req.body;
   try {
      const rezultati = await data.korisnik.findAll({
         attributes: [
            'idkorisnik',
            'korime',
            'ime',
            'prezime'
         ],
         where: {
            [Op.or]: [
               { korime: { [Op.iLike]: `${searchTerm}%` } },
               { ime: { [Op.iLike]: `${searchTerm}%` } },
               { prezime: { [Op.iLike]: `${searchTerm}%` } },
            ],
            tipkorisnika: "autor"
         },
         raw: true,
      });

      if (rezultati.length > 0) {
         console.log(rezultati);
         res.status(200).json(rezultati);
      }
   } catch (error) {
      console.error('Greška prilikom pretraživanja korisnika:', error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
})

router.post('/searchAuthor', async (req, res) => {
   const { searchTerm } = req.body;
   try {
      const rezultati = await data.korisnik.findAll({
         attributes: [
            'idkorisnik',
            'korime',
            'ime',
            'prezime'
         ],
         where: {
            [Op.or]: [
               { korime: `${searchTerm}` },
               { ime:  `${searchTerm}` },
               { prezime: `${searchTerm}` },
            ],
            tipkorisnika: "autor"
         },
         raw: true,
      });

      if (rezultati.length > 0) {
         console.log(rezultati);
         res.status(200).json(rezultati);
      }
   } catch (error) {
      console.error('Greška prilikom pretraživanja korisnika:', error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
})

// idknjiga, naslov, slika, godizd, idkorisnikAutor, imeAutor, prezAutor, brojRecenzija, brojOsvrta, prosjekOcjena, spremljenoPuta
router.get('/allBooks', async (req, res) => {
   try {
      const allBooks = await data.knjiga.findAll({
         attributes: [
            'idknjiga',
            'naslov',
            'godizd',
            'slika',
            ['idkorisnik', 'idkorisnikAutor'],
            [Sequelize.col('idkorisnik_korisnik.ime'), 'imeAutor'],
            [Sequelize.col('idkorisnik_korisnik.prezime'), 'prezAutor']
         ],
         include: [
            {
               model: data.korisnik,
               as: 'idkorisnik_korisnik',
               attributes: []
            }
         ],
         raw: true
      })

      if (allBooks.length > 0) {
         for (const book of allBooks) {

            const brojSpremanja = await data.cita.count({
               where: {
                  idknjiga: book.idknjiga
               }
            })

            book.brojSpremanja = brojSpremanja;

            const brojRecenzija = await data.recenzija.count({
               where:
               {
                  idknjiga: book.idknjiga
               }
            })

            book.brojRecenzija = brojRecenzija;

            const brojOsvrta = await data.recenzija.count({
               where:
               {
                  idknjiga: book.idknjiga,
                  txtrecenzija: {
                     [Op.not]: null
                  }
               }
            })

            book.brojOsvrta = brojOsvrta;
            
            if (brojRecenzija) {
               const prosjekOcjena = await data.recenzija.findAll({
                  attributes: [
                     [Sequelize.fn('AVG', Sequelize.col('ocjena')), 'prosjekOcjena']
                  ],
                  where: {
                     idknjiga: book.idknjiga,
                     ocjena: {
                        [Sequelize.Op.between]: [1, 5]
                     }
                  },
                  raw: true
               });
               book.prosjekOcjena = parseFloat(prosjekOcjena[0].prosjekOcjena).toFixed(2);
            }
            else {
               book.prosjekOcjena = 0;
            }
         }
         res.status(200).json(allBooks);
      }
      else {
         res.status(404).json("Nema knjiga!");
      }
   }
   catch (error) {
      console.error('Error fetching authors:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
   }
});

router.get('/recommendedBooks', async (req, res) => {
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
            if (book.idkorisnik === author.idkorisnik && author.idkorisnik > 13) {
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
});

router.get('/bestRatedBooks', async (req, res) => {
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

      console.log(allBooks)

      let books = [];
      let mostPopular = [];
      for (let book of allBooks) {
         for (let author of allAuthors) {
            if (book.idkorisnik === author.idkorisnik) {
               const allReviews = await data.recenzija.findAll({
                  where: {
                     idknjiga: book.idknjiga
                  },
                  raw: true,
                  attributes: ['ocjena']
               })
               let ocjena = 0;
               for (let i = 0; i < allReviews.length; i++) {
                  ocjena += allReviews[i].ocjena;
               }
               mostPopular.push({
                  naslov: book.naslov,
                  autor: author.ime + " " + author.prezime,
                  count: allReviews.length,
                  src: book.slika,
                  rating: allReviews.length === 0 ? '-' : ocjena / allReviews.length

               })
            }
         }
      }


      mostPopular.sort((a, b) => {
         if (a.count < b.count) {
            return 1;
         }
         if (a.count > b.count) {
            return -1;
         }
         return 0;
      });

      console.log("slika:", mostPopular[0].src)
      for (i = 0; i < 4; i++) {
         books.push({
            naslov: mostPopular[i].naslov,
            autor: mostPopular[i].autor,
            src: mostPopular[i].src,
            rating: mostPopular[i].rating
         })
      }

      res.status(200).json(books);
   }
   catch (error) {
      console.error('Error fetching books:', error);
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

router.get('/getUserData/:id', verifyToken, async (req, res) => {
   try {
      const userId = req.params.id;
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
});

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

});

router.post('/rate/:bookId', verifyToken, async (req, res) => {
   const bookId = req.params.bookId;
   const userId = req.user.userId;
   const { ocjena, txtrecenzija } = req.body;
   console.log(req.body);
   console.log("bookId", bookId);
   console.log("userId", userId);
   console.log("grade", req.body.ocjena);
   
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
            idkorisnik: userId, ocjena: ocjena, txtrecenzija: txtrecenzija === "" ? null : txtrecenzija, idknjiga: bookId
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
});

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

});

router.post('/saveBook/:bookId', verifyToken, async (req, res) => {
   const { statusNumber } = req.body;
   const userId = req.user.userId;
   const bookId = req.params.bookId;

   try {
      console.log(userId);
      console.log(statusNumber);
      console.log(bookId);

      var status;
      if (statusNumber == 1) {
         status = "Pročitano";
      }
      else if (statusNumber == 2) {
         status = "Trenutno čitam";
      }
      else if (statusNumber == 3) {
         status = "Želim pročitati";
      }

      const saved = await data.cita.findOne({
         where: {
            idkorisnik: userId,
            status: status,
            idknjiga: bookId
         }
      })

      if (saved) {
         await data.cita.destroy({
            where: {
               idkorisnik: userId,
               status: status,
               idknjiga: bookId
            }
         })
         res.status(204).send("Uklonjeno");
      }
      else {
         const temp = await data.cita.findOne({
            where: {
               idkorisnik: userId,
               idknjiga: bookId
            }
         })

         if (temp) {
            await data.cita.update(
               {
                  status: status,
               },
               {
                  where: {
                     idkorisnik: userId,
                     idknjiga: bookId
                  }
               }
            )
         }
         else {
            await data.cita.create({
               idkorisnik: userId,
               status: status,
               idknjiga: bookId
            })
            
         }

         res.status(200).send(status);
      }

   } catch (error) {
      console.log("Error fetching book: ", error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
   }
});

router.get('/saved/:bookId', verifyToken, async (req, res) => {
   const userId = req.user.userId;
   const bookId = req.params.bookId;

   try {
      const saved = await data.cita.findOne({
         attributes: ['status'],
         where: {
            idkorisnik: userId,
            idknjiga: bookId
         },
         raw: true,
      });

      console.log(saved);

      if (saved) {
         const status = saved.status;

         // Ako želite koristiti vaše statusNumber
         let statusNumber;
         if (status == "Pročitano") {
            statusNumber = 1;
         } else if (status == "Trenutno čitam") {
            statusNumber = 2;
         } else if (status == "Želim pročitati") {
            statusNumber = 3;
         }

         res.status(200).send({ statusNumber });
      } else {
         res.status(404).send({ statusNumber: 0 });
      }

   } catch (error) {
      console.log("Error fetching book: ", error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
   }
});


module.exports = router;