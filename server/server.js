const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const poveziBazu = require('./config/db');

// ucitavamo promenljive iz .env fajla
dotenv.config();

// povezivanje sa MongoDB bazom
poveziBazu();

const app = express();

// MIDDLEWARE
app.use(cors());              // dozvoljava zahteve sa React aplikacije (port 3000)
app.use(express.json());      // parsira JSON telo zahteva

// RUTE
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/patike', require('./routes/patikaRoutes'));
app.use('/api/porudzbine', require('./routes/porudzbinaRoutes'));
app.use('/api/korisnici', require('./routes/userRoutes'));
app.use('/api/kurs', require('./routes/kursRoutes'));

// test ruta - provera da li server radi
app.get('/', (req, res) => {
  res.json({ poruka: 'API za online prodaju patika je aktivan.' });
});

// ruta koja ne postoji
app.use((req, res) => {
  res.status(404).json({ poruka: `Ruta ${req.originalUrl} ne postoji.` });
});

// centralna obrada gresaka
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ poruka: 'Doslo je do greske na serveru.' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server radi na portu ${PORT}`);
});
