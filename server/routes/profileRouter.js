const express = require('express');
const router = express.Router();
const data = require('../models/data');
const verifyToken = require('./tokenVerification');

const multer = require('multer');
const { Sequelize, Op, literal } = require('sequelize');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// status, idknjiga, naslov, slika, godizd, idkorisnikAutor, imeAutor, prezAutor, brojRecenzija, brojOsvrta, prosjekOcjena
// Spremljene knjige: i za autora i za čitatelja!
router.get('/reading/:profileId', verifyToken, async (req, res) => {
   try {
      const userId = req.params.profileId;
      const r = await data.cita.findAll({
         attributes: [
            'status',
            'idknjiga',
            [Sequelize.col('idknjiga_knjiga.naslov'), 'naslov'],
            [Sequelize.col('idknjiga_knjiga.slika'), 'slika'],
            [Sequelize.col('idknjiga_knjiga.godizd'), 'godizd'],
            [Sequelize.col('idknjiga_knjiga.idkorisnik_korisnik.idkorisnik'), 'idkorisnikAutor'],
            [Sequelize.col('idknjiga_knjiga.idkorisnik_korisnik.ime'), 'imeAutor'],
            [Sequelize.col('idknjiga_knjiga.idkorisnik_korisnik.prezime'), 'prezAutor'],
         ],
         where: {
            idkorisnik: userId,
            status: 'Pročitano'
         },
         include: [
            {
               model: data.knjiga,
               as: 'idknjiga_knjiga',
               attributes: [],
               include: [
                  {
                     model: data.korisnik,
                     as: 'idkorisnik_korisnik',
                     attributes: []
                  }
               ]
            }
         ],
         raw: true,
      })

      const cr = await data.cita.findAll({
         attributes: [
            'status',
            'idknjiga',
            [Sequelize.col('idknjiga_knjiga.naslov'), 'naslov'],
            [Sequelize.col('idknjiga_knjiga.slika'), 'slika'],
            [Sequelize.col('idknjiga_knjiga.godizd'), 'godizd'],
            [Sequelize.col('idknjiga_knjiga.idkorisnik_korisnik.idkorisnik'), 'idkorisnikAutor'],
            [Sequelize.col('idknjiga_knjiga.idkorisnik_korisnik.ime'), 'imeAutor'],
            [Sequelize.col('idknjiga_knjiga.idkorisnik_korisnik.prezime'), 'prezAutor'],
         ],
         where: {
            idkorisnik: userId,
            status: 'Trenutno čitam'
         },
         include: [
            {
               model: data.knjiga,
               as: 'idknjiga_knjiga',
               attributes: [],
               include: [
                  {
                     model: data.korisnik,
                     as: 'idkorisnik_korisnik',
                     attributes: []
                  }
               ]
            }
         ],
         raw: true
      })

      const wtr = await data.cita.findAll({
         attributes: [
            'status',
            'idknjiga',
            [Sequelize.col('idknjiga_knjiga.naslov'), 'naslov'],
            [Sequelize.col('idknjiga_knjiga.slika'), 'slika'],
            [Sequelize.col('idknjiga_knjiga.godizd'), 'godizd'],
            [Sequelize.col('idknjiga_knjiga.idkorisnik_korisnik.idkorisnik'), 'idkorisnikAutor'],
            [Sequelize.col('idknjiga_knjiga.idkorisnik_korisnik.ime'), 'imeAutor'],
            [Sequelize.col('idknjiga_knjiga.idkorisnik_korisnik.prezime'), 'prezAutor'],
         ],
         where: {
            idkorisnik: userId,
            status: 'Želim pročitati'
         },
         include: [
            {
               model: data.knjiga,
               as: 'idknjiga_knjiga',
               attributes: [],
               include: [
                  {
                     model: data.korisnik,
                     as: 'idkorisnik_korisnik',
                     attributes: []
                  }
               ]
            }
         ],
         raw: true,
      })

      console.log(r);

      const books = {
         'Read': r,
         'Currently reading': cr,
         'Want to read': wtr
      }

      if (books['Read']) {
         for (const r1 of books['Read']) {
            const brojRecenzija = await data.recenzija.count({
               where:
               {
                  idknjiga: r1.idknjiga
               }
            })

            r1.brojRecenzija = brojRecenzija;

            const brojOsvrta = await data.recenzija.count({
               where:
               {
                  idknjiga: r1.idknjiga,
                  txtrecenzija: {
                     [Op.not]: null
                  }
               }
            })

            r1.brojOsvrta = brojOsvrta;
            
            if (brojRecenzija) {
               const prosjekOcjena = await data.recenzija.findAll({
                  attributes: [
                     [Sequelize.fn('AVG', Sequelize.col('ocjena')), 'prosjekOcjena']
                  ],
                  where: {
                     idknjiga: r1.idknjiga,
                     ocjena: {
                        [Sequelize.Op.between]: [1, 5]
                     }
                  },
                  raw: true
               });
               r1.prosjekOcjena = parseFloat(prosjekOcjena[0].prosjekOcjena).toFixed(2);
            }
            else {
               r1.prosjekOcjena = 0;
            }
         }
      }

      if (books['Currently reading']) {
         for (const r2 of books['Currently reading']) {
            const brojRecenzija = await data.recenzija.count({
               where:
               {
                  idknjiga: r2.idknjiga
               }
            })

            r2.brojRecenzija = brojRecenzija;

            const brojOsvrta = await data.recenzija.count({
               where:
               {
                  idknjiga: r2.idknjiga,
                  txtrecenzija: {
                     [Op.not]: null
                  }
               }
            })

            r2.brojOsvrta = brojOsvrta;
            
            if (brojRecenzija) {
               const prosjekOcjena = await data.recenzija.findAll({
                  attributes: [
                     [Sequelize.fn('AVG', Sequelize.col('ocjena')), 'prosjekOcjena']
                  ],
                  where: {
                     idknjiga: r2.idknjiga,
                     ocjena: {
                        [Sequelize.Op.between]: [1, 5]
                     }
                  },
                  raw: true
               });
               r2.prosjekOcjena = parseFloat(prosjekOcjena[0].prosjekOcjena).toFixed(2);
            }
            else {
               r2.prosjekOcjena = 0;
            }
         }
      }

      if (books['Want to read']) {
         for (const r3 of books['Want to read']) {
            const brojRecenzija = await data.recenzija.count({
               where:
               {
                  idknjiga: r3.idknjiga
               }
            })

            r3.brojRecenzija = brojRecenzija;

            const brojOsvrta = await data.recenzija.count({
               where:
               {
                  idknjiga: r3.idknjiga,
                  txtrecenzija: {
                     [Op.not]: null
                  }
               }
            })

            r3.brojOsvrta = brojOsvrta;
            
            if (brojRecenzija) {
               const prosjekOcjena = await data.recenzija.findAll({
                  attributes: [
                     [Sequelize.fn('AVG', Sequelize.col('ocjena')), 'prosjekOcjena']
                  ],
                  where: {
                     idknjiga: r3.idknjiga,
                     ocjena: {
                        [Sequelize.Op.between]: [1, 5]
                     }
                  },
                  raw: true
               });
               r3.prosjekOcjena = parseFloat(prosjekOcjena[0].prosjekOcjena).toFixed(2);
            }
            else {
               r3.prosjekOcjena = 0;
            }
         }
      }

      res.status(200).json(books);

     
   } catch (error) {
      console.error('Greška prilikom dohvaćanja knjiga:', error);
      res.status(500).json({ error: 'Greška prilikom dohvaćanja knjiga.' });
   }
});

// idknjiga, naslov, slika, godizd, idkorisnikAutor, imeAutor, prezAutor, brojRecenzija, brojOsvrta, prosjekOcjena
// Napisane knjige: samo za autora
router.get('/myWrittenBooks', verifyToken, async (req, res) => {
   try {
      const userId = req.user.userId;

      const user = await data.korisnik.findOne({
         where: {
            idkorisnik: userId,
            tipkorisnika: "autor"
         }
      })

      // Ako se radi o autoru onda traži writtenBooks, inače 'Role not approved!'
      if (user) {
         const writtenBooks = await data.knjiga.findAll({
            attributes: [
               'idknjiga',
               'naslov',
               'slika',
               'godizd',
               [Sequelize.col('idkorisnik_korisnik.idkorisnik'), 'idkorisnikAutor'],
               [Sequelize.col('idkorisnik_korisnik.ime'), 'imeAutor'],
               [Sequelize.col('idkorisnik_korisnik.prezime'), 'prezAutor'],
            ],
            where: {
               idkorisnik: userId
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
   
         if (writtenBooks.length > 0) {   
            for (const r of writtenBooks) {
               const brojRecenzija = await data.recenzija.count({
                  where:
                  {
                     idknjiga: r.idknjiga
                  }
               })
   
               r.brojRecenzija = brojRecenzija;
   
               const brojOsvrta = await data.recenzija.count({
                  where:
                  {
                     idknjiga: r.idknjiga,
                     txtrecenzija: {
                        [Op.not]: null
                     }
                  }
               })
   
               r.brojOsvrta = brojOsvrta;
               
               if (brojRecenzija) {
                  const prosjekOcjena = await data.recenzija.findAll({
                     attributes: [
                        [Sequelize.fn('AVG', Sequelize.col('ocjena')), 'prosjekOcjena']
                     ],
                     where: {
                        idknjiga: r.idknjiga,
                        ocjena: {
                           [Sequelize.Op.between]: [1, 5]
                        }
                     },
                     raw: true
                  });
                  r.prosjekOcjena = parseFloat(prosjekOcjena[0].prosjekOcjena).toFixed(2);
               }
               else {
                  r.prosjekOcjena = 0;
               }
            }
            res.status(200).json(writtenBooks);
         }
         else {
            res.status(404).json({message: "No written books!"});
         }
      }
      else {
         res.status(404).json({ message: "Role not approved!" });
      }
   } catch (error) {
      console.error('Greška prilikom dohvaćanja knjiga:', error);
      res.status(500).json({ error: 'Greška prilikom dohvaćanja knjiga.' });
   }
})

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

router.post('/change', verifyToken, async (req, res) => {
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

router.get('/', verifyToken, async (req, res) => {
   res.redirect(`/api/data/profile/${req.user.userId}`);
});

router.get('/:id', async (req, res) => {
   console.log(req.params.id);
   try {
      const userId = req.params.id;
      var user = await data.korisnik.findOne({
         attributes: [
            'ime',
            'prezime',
            'korime',
            // 'lozinka',
            'info',
            'datrod',
            'tipkorisnika',
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
            idkorisnik: userId,
         },
      });
      console.log(user.dataValues);


      if (user) {
         if (user.dataValues.tipkorisnika === "čitatelj") {
            delete user.dataValues.napisaoKnjiga;
         }
         res.status(200).json(user.dataValues);
      } else {
         res.status(404).json({ message: 'Korisnik nije pronađen' });
      }
   }
   catch (error) {
      console.error('Greška prilikom dohvaćanja profila:', error);
      res.status(500).json({ error: 'Greška prilikom dohvaćanja korisnika.' });
   }
});


router.get('/follow/:profileId', verifyToken, async (req, res) => {
   const profileId = req.params.profileId;
   const userId = req.user.userId;
   try {
      const follow = await data.prati.findOne({
         where: {
            idkorisnik1: userId,
            idkorisnik2: profileId
         },
         raw: true,
      })

      console.log(follow);

      if (follow) {
         await data.prati.destroy({
            where: {
               idkorisnik1: userId,
               idkorisnik2: profileId
            },
         });
         res.status(204).json("Follow");
      }
      else {
         await data.prati.create({ idkorisnik1: userId, idkorisnik2: profileId });
         res.status(200).send("Unfollow");
      }
   }
   catch (error) {
      console.error('Error fetching authors:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
   }
});

router.post('/follows', verifyToken, async (req, res) => {
   const { profileId } = req.body;
   const userId = req.user.userId;
   try {
      const follow = await data.prati.findOne({
         where: {
            idkorisnik1: userId,
            idkorisnik2: profileId
         },
         raw: true,
      })

      console.log(follow);

      if (follow) {
         // To znači da pratim korisnika
         res.status(200).json("Unfollow");
      }
      else {
         res.status(404).json("Not following");
      }
   }
   catch (error) {
      console.error('Error fetching authors:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
   }
})

router.get('/following/:profileId', verifyToken, async (req, res) => {
   const profileId = req.params.profileId;
   const userId = req.user.userId;
   try {
      const follow = await data.prati.findOne({
         where: {
            idkorisnik1: userId,
            idkorisnik2: profileId
         },
         raw: true,
      })

      console.log(follow);

      if (follow) {
         // To znači da pratim korisnika
         res.status(200).send("Unfollow"); // ovo će se prikazati u buttonu za praćenje
      }
      else {
         // To znači da ne pratim korisnika
         res.status(404).send("Follow"); // ovo će se prikazati u buttonu za praćenje
      }
   }
   catch (error) {
      console.error('Error fetching authors:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
   }
})

/*
router.get('/reading/:profileId', verifyToken, async (req, res) => {
   const profileId = req.params.profileId;
   try {
      const reading = await data.cita.findAll({
         attributes: [
            'status',
            'idknjiga',
            [Sequelize.col('idknjiga_knjiga.naslov'), 'naslov'],
            [Sequelize.col('idknjiga_knjiga.slika'), 'slika'],
            [Sequelize.col('idknjiga_knjiga.godizd'), 'godizd'],
            [Sequelize.col('idknjiga_knjiga.idkorisnik_korisnik.idkorisnik'), 'idkorisnikAutor'],
            [Sequelize.col('idknjiga_knjiga.idkorisnik_korisnik.ime'), 'imeAutor'],
            [Sequelize.col('idknjiga_knjiga.idkorisnik_korisnik.prezime'), 'prezAutor'],
         ],
         where: {
            idkorisnik: profileId
         },
         include: [
            {
               model: data.knjiga,
               as: 'idknjiga_knjiga',
               attributes: [],
               include: [
                  {
                     model: data.korisnik,
                     as: 'idkorisnik_korisnik',
                     attributes: []
                  }
               ]
            }
         ],
         raw: true,
      });

      console.log(reading);

      if (reading) {
         for (const r of reading) {
            const brojRecenzija = await data.recenzija.count({
               where:
               {
                  idknjiga: r.idknjiga
               }
            })

            r.brojRecenzija = brojRecenzija;

            const brojOsvrta = await data.recenzija.count({
               where:
               {
                  idknjiga: r.idknjiga,
                  txtrecenzija: {
                     [Op.not]: null
                  }
               }
            })

            r.brojOsvrta = brojOsvrta;
            
            if (brojRecenzija) {
               const prosjekOcjena = await data.recenzija.findAll({
                  attributes: [
                     [Sequelize.fn('AVG', Sequelize.col('ocjena')), 'prosjekOcjena']
                  ],
                  where: {
                     idknjiga: r.idknjiga,
                     ocjena: {
                        [Sequelize.Op.between]: [1, 5]
                     }
                  },
                  raw: true
               });
               r.prosjekOcjena = parseFloat(prosjekOcjena[0].prosjekOcjena).toFixed(2);
            }
            else {
               r.prosjekOcjena = 0;
            }
         }
         res.status(200).json(reading);
      }
      else {
         res.status(404).json("Nema ništa");
      }
   } catch (error) {
      console.error('Error fetching authors:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
   }
});
*/

module.exports = router;