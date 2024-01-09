const express = require('express');
const router = express.Router();
const verifyToken = require('./tokenVerification');
const data = require('../models/data');
const multer = require('multer');
const axios = require('axios');

const profileRouter = require('./profileRouter');
const { Sequelize, literal, Op } = require('sequelize');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// Šablona
// try {

// } catch (error) {
//    console.error('Error fetching books:', error);
//    res.status(500).json({ error: 'Internal Server Error', details: error.message });
// }

router.use('/profile', profileRouter);

router.get('/allUsers', verifyToken, async (req, res) => {
   const typeOfUser = req.user.typeOfUser;
   if (typeOfUser !== "admin") {
      res.status(401).json("Nemaš pristup!");
   }

   try {
      const userId = req.user.userId;
      const allUsers = await data.korisnik.findAll({
         where: {
            idkorisnik: {
               [Op.ne]: userId
            }
         }
      });
      res.status(200).json(allUsers);
   } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
   }
});

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

// idknjiga, naslov, slika, isbn, zanr, godizd, idkorisnikAutor, imeAutor, prezAutor, brojRecenzija, brojOsvrta, prosjekOcjena, spremljenoPuta
router.get('/allBooks', async (req, res) => {
   try {
      const allBooks = await data.knjiga.findAll({
         attributes: [
            'idknjiga',
            'naslov',
            'godizd',
            'slika',
            'isbn',
            'zanr',
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

router.get('/getAllData', verifyToken, async (req, res) => {
   if (req.user.typeOfUser !== "admin") {
      res.status(403).send("You have no permission");
   }

   try {
      const numberOfUsers = await data.korisnik.count();
      const numberOfBooks = await data.knjiga.count();

      const allData = {
         ukBrojKorisnika: numberOfUsers,
         ukBrojKnjiga: numberOfBooks
      }

      res.status(200).json(allData);
   } catch (error) {
      console.error('Error fetching books:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
   }
})

router.delete('/deleteUser/:userId', verifyToken, async (req, res) => {
   try {
      const userId = req.params.userId;

      const user = await data.korisnik.findOne({
         where: {
            idkorisnik: userId
         }
      })

      if (user) {
         await data.korisnik.destroy({
            where: {
               idkorisnik: userId
            }
         });

         res.status(200).send("User deleted");
      }
      else {
         res.status(404).send("No such user!");
      }

   } catch (error) {
      console.error('Greška prilikom pretraživanja korisnika:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
   }
});

router.delete('/deleteBook/:bookId', verifyToken, async (req, res) => {
   try {
      const bookId = req.params.bookId;
      const book = await data.knjiga.findOne({
         where: {
            idknjiga: bookId
         }
      })

      if (book) {
         await data.knjiga.destroy({
            where: {
               idknjiga: bookId
            }
         })

         res.status(200).send("Book deleted");
      }
      else {
         res.status(404).send("No such book!");
      }
   } catch (error) {
      console.error('Greška prilikom pretraživanja korisnika:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
   }
})


router.post('/checkISBN/:ISBN', verifyToken, async (req, res) => {
   try {
      const ISBN = req.params.ISBN;
      const existingBook = await data.knjiga.findOne({
         where: {
            isbn: ISBN
         }
      });

      if (existingBook) {
         return res.status(400).send('This book already exists.');
      }
      else {
         res.status(200).send("");
      }
   }
   catch (error) {
      console.error('Greška prilikom dodavanja knjige:', error);
      res.status(500).json({ error: 'Interna server greška', details: error.message });
   }
});

router.post('/checkISBN/:ISBN/:bookId', verifyToken, async (req, res) => {
   try {
      const ISBN = req.params.ISBN;
      const bookId = req.params.bookId;
      const existingBook = await data.knjiga.findOne({
         where: {
            isbn: ISBN,
            idknjiga: {
               [Sequelize.Op.ne]: bookId
            }
         }
      });

      if (existingBook) {
         return res.status(400).send('This book already exists.');
      }
      else {
         res.status(200).send("");
      }
   }
   catch (error) {
      console.error('Greška prilikom dodavanja knjige:', error);
      res.status(500).json({ error: 'Interna server greška', details: error.message });
   }
});

const getImageBufferFromUrl = async (url) => {
   try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data, 'binary');
      return buffer;

   } catch (error) {
      console.error('Greška prilikom dohvaćanja slike s URL-a:', error.message);
      throw error;
   }
};

router.post('/addBook', upload.single('coverImage'), async (req, res) => {
   try {
      const { title, genre, published, about, isbn, userId, imageUrl } = req.body;
      let slika;

      if (imageUrl) {
         slika = await getImageBufferFromUrl(imageUrl);
      } else if (req.file) {
         slika = req.file.buffer;
      }

      const newBook = await data.knjiga.create({
         naslov: title,
         zanr: genre,
         godizd: published,
         opis: about,
         isbn: isbn,
         idkorisnik: userId,
         slika: slika,
      });

      res.status(201).json(newBook);
   } catch (error) {
      console.error('Greška prilikom dodavanja knjige:', error);
      res.status(500).json({ error: 'Interna server greška', details: error.message });
   }
});

router.post('/changeBookData/:bookId', upload.single('fileImage'), async (req, res) => {
   try {
      const { title, genre, published, about, isbn, imageUrl, deleteImage } = req.body;
      const bookId = req.params.bookId;
      let slika;

      console.log(req.body);
      console.log(req.file);

      if (req.file) {
         slika = req.file.buffer;
      }
      else if (imageUrl !== "") {
         slika = await getImageBufferFromUrl(imageUrl);
      }
      else if (deleteImage === "1") {
         slika = null;
      }
      else if (deleteImage === "0") {
         const updatedBook = await data.knjiga.update(
            {
               naslov: title,
               zanr: genre,
               godizd: published,
               opis: about,
               isbn: isbn,
            },
            {
               where: {
                  idknjiga: bookId
               }
            }
         );
         res.status(200).json(updatedBook);
         return;
      }
      
      const updatedBook = await data.knjiga.update(
         {
            naslov: title,
            zanr: genre,
            godizd: published,
            opis: about,
            isbn: isbn,
            slika: slika,
         },
         {
            where: {
               idknjiga: bookId
            }
         }
      );
      res.status(200).json(updatedBook);

   } catch (error) {
      console.error('Greška prilikom dodavanja knjige:', error);
      res.status(500).json({ error: 'Interna server greška', details: error.message });
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
               { ime: `${searchTerm}` },
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

router.get('/getBookData/:bookId', verifyToken, async (req, res) => {
   try {
      const bookId = req.params.bookId;
      const book = await data.knjiga.findOne({
         attributes: [
            'naslov',
            'zanr',
            'godizd',
            'opis',
            'isbn',
            'slika'
         ],
         where: {
            idknjiga: bookId
         }
      });

      if (book) {
         res.status(200).json(book);
      }
      else {
         res.status(404).json({ message: "Nemoguće pronaći knjigu" });
      }
   } catch (error) {
      console.error('Error fetching books:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
   }
})

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

router.get('/getRatings/:bookId', async (req, res) => {
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
            [Op.and]: [
               {
                  [Op.or]: [
                     {
                        ocjena: {
                           [Op.between]: [1, 5],
                        },
                     },
                     {
                        txtrecenzija: {
                           [Op.not]: "",
                        },
                     },
                  ],
               },
            ],

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
         res.send({ statusNumber: 0 });
      }

   } catch (error) {
      console.log("Error fetching book: ", error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
   }
});

router.get('/getBookStatistics/:bookId', verifyToken, async (req, res) => {
   try {
      const bookId = req.params.bookId;
      const r = await data.cita.count({
         where: {
            idknjiga: bookId,
            status: "Pročitano"
         }
      });

      const ctr = await data.cita.count({
         where: {
            idknjiga: bookId,
            status: "Trenutno čitam"
         }
      });

      const wtr = await data.cita.count({
         where: {
            idknjiga: bookId,
            status: "Želim pročitati"
         }
      });


      const bookStatistics = {
         procitano: r,
         trenutnoCitam: ctr,
         zelimProcitati: wtr
      }

      res.status(200).json(bookStatistics);
   } catch (error) {
      console.error('Error fetching books:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
   }
})

router.get('/najpopularnije', async (req, res) => {
   try {
      const allBooks = await data.knjiga.findAll({
         attributes: [
            'idknjiga',
            'naslov',
            'godizd',
            'slika',
            'isbn',
            'zanr',
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
         
         allBooks.sort((a, b) => {
            if (a.prosjekOcjena < b.prosjekOcjena) {
               return 1;
            }
            if (a.prosjekOcjena > b.prosjekOcjena) {
               return -1;
            }
            return 0;
         });
         const popularBooks = allBooks.slice(0, 4);
         res.status(200).json(popularBooks);
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



router.get('/toplePreporuke', async (req, res) => {
   try {

      const allAuthors = await data.korisnik.findAll({
         attributes: [
            'idkorisnik',
         ],
         where: {
            tipkorisnika: "autor",
         },
         raw: true,
      });


      const allBooks = await data.knjiga.findAll({
         attributes: [
            'idknjiga',
            'naslov',
            'godizd',
            'slika',
            'isbn',
            'zanr',
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
         
         const preporuke = [];
         console.log(allBooks)
         console.log(allAuthors)
         for (book of allBooks) {
            for (autor of allAuthors) {
               if ((book.idkorisnikAutor === autor.idkorisnik) && autor.idkorisnik > 13) {
                  preporuke.push(book)
               }
            }
         }
         res.status(200).json(preporuke);
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


module.exports = router;