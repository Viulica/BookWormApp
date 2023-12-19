const express = require('express');
const session = require('express-session');
const cors = require('cors');
const sequelize = require('./config/db');
const data = require('./models/data');

const app = express();

app.use(cors());
app.use(session({
  secret: 'tajna-rijec',
  resave: false,
  saveUninitialized: true,
}));
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
  // Ovde možete dodati bilo kakvu dodatnu logiku ako je potrebno
  console.log('Middleware za /api');
  next();
});

app.get('/api/users', async (req, res) => {
  try {
    const allUsers = await data.korisnik.findAll();
    res.json(allUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

app.get('/api/books', async (req, res) => {
  try {
    const allBooks = await data.knjiga.findAll();
    res.json(allBooks);
  }
  catch (error) {
    console.log('Error fetching books:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
})

app.get('/api/profile', (req, res) => {
  console.log(req.session.user);
  if (req.session.user) {
    // Korisnik je prijavljen, možete koristiti req.session.user za pristup podacima
    res.status(200).json(req.session.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});


app.post('/api/login', async (req, res) => {
  console.log(req.body);
  try {
    const user = await data.korisnik.findOne({
      where: {
        korime: req.body.username,
        lozinka: req.body.password
      }
    });

    if (user) {
      req.session.user = user;
      console.log(req.session.user);
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Server-side kod za odjavljivanje
app.post('/api/logout', (req, res) => {
  // Obrisi podatke o korisniku iz sesije
  req.session.destroy((err) => {
    if (err) {
      console.error('Greška prilikom odjavljivanja:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json({ success: true });
    }
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
