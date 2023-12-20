const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const sequelize = require('./config/db');
const data = require('./models/data');
const multer = require('multer');

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors());

app.use(express.json());

async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
    // Sinkronizacija modela s bazom podataka
    await sequelize.sync();
    console.log('Models have been synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

initDatabase();

app.use('/api', (req, res, next) => {
  console.log('Middleware za /api');
  next();
});

app.post('/api/login', async (req, res) => {
  console.log("/api/login");
  try {
    const user = await data.korisnik.findOne({
      where: {
        korime: req.body.username,
        lozinka: req.body.password
      }
    })

    if (user) {
      const token = jwt.sign({ userId: user.idkorisnik, username: user.korime }, 'tajna_lozinka', { expiresIn: '1h' });
      res.status(200).send(token);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  console.log(token);
  
  if (!token) {
    return res.status(403).json({ message: 'Token nije pružen' });
  }
  
  jwt.verify(token, 'tajna_lozinka', async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Neuspješna autentikacija tokena' });
    }
    req.user = decoded;
    next();
  });
};

app.get('/api/data/profile', verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const user = await data.korisnik.findOne({
      where: {
        idkorisnik: userId
      }
    })
    
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'Korisnik nije pronađen' });
  }
});

app.get('/api/data/allBooks', async (req, res) => {
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
    console.log(formattedBooks);
    res.status(200).json(formattedBooks);
  }
  catch (error) {
    console.log('Error fetching books:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

app.get('/api/data/reader/myBooks', verifyToken, async (req, res) => {
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

app.get('/api/data/allAuthors', async (req, res) => {
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

app.post('/api/data/addBook', upload.single('coverImage'), async (req, res) => {
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

app.get('/api/data/book/:id', async (req, res) => {
  const bookId = req.params.id;

  try {
    const book = await data.knjiga.findOne({
      where: {
        idknjiga: bookId
      }
    })
    res.status(200).json(book);
  }
  catch (error) {
    console.log("Error fetching book: ", error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

app.get('/api/data/author/myBooks', verifyToken, async (req, res) => {
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

app.get('/api/data/allUsers', async (req, res) => {
  try {
    const allUsers = await data.korisnik.findAll();
    res.json(allUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
