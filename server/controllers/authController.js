const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Pravi JWT token koji vazi 7 dana
const napraviToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Provera kompleksnosti lozinke:
// najmanje 8 karaktera, bar jedno veliko slovo, malo slovo, cifra i specijalan znak
const lozinkaJeJaka = (lozinka) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-+=]).{8,}$/;
  return regex.test(lozinka);
};

// POST /api/auth/register
const registracija = async (req, res) => {
  try {
    const { ime, prezime, email, lozinka, adresa, telefon } = req.body;

    if (!ime || !prezime || !email || !lozinka) {
      return res
        .status(400)
        .json({ poruka: 'Ime, prezime, email i lozinka su obavezni.' });
    }

    if (!lozinkaJeJaka(lozinka)) {
      return res.status(400).json({
        poruka:
          'Lozinka mora imati najmanje 8 karaktera, veliko slovo, malo slovo, cifru i specijalan znak.',
      });
    }

    const postoji = await User.findOne({ email: email.toLowerCase() });
    if (postoji) {
      return res
        .status(400)
        .json({ poruka: 'Korisnik sa ovom email adresom vec postoji.' });
    }

    const korisnik = await User.create({
      ime,
      prezime,
      email,
      lozinka,
      adresa,
      telefon,
      // uloga se NE uzima iz req.body - inace bi svako mogao da se registruje kao admin
    });

    res.status(201).json({
      _id: korisnik._id,
      ime: korisnik.ime,
      prezime: korisnik.prezime,
      email: korisnik.email,
      uloga: korisnik.uloga,
      token: napraviToken(korisnik._id),
    });
  } catch (error) {
    // greske iz Mongoose validacije
    if (error.name === 'ValidationError') {
      const poruke = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ poruka: poruke.join(' ') });
    }
    res.status(500).json({ poruka: 'Greska na serveru.', greska: error.message });
  }
};

// POST /api/auth/login
const prijava = async (req, res) => {
  try {
    const { email, lozinka } = req.body;

    if (!email || !lozinka) {
      return res.status(400).json({ poruka: 'Email i lozinka su obavezni.' });
    }

    // lozinka ima select:false u modelu, pa je moramo eksplicitno traziti
    const korisnik = await User.findOne({ email: email.toLowerCase() }).select(
      '+lozinka'
    );

    // Namerno ista poruka i kad email ne postoji i kad je lozinka pogresna,
    // da napadac ne moze da sazna koji emailovi su registrovani.
    if (!korisnik || !(await korisnik.proveriLozinku(lozinka))) {
      return res.status(401).json({ poruka: 'Pogresan email ili lozinka.' });
    }

    res.json({
      _id: korisnik._id,
      ime: korisnik.ime,
      prezime: korisnik.prezime,
      email: korisnik.email,
      uloga: korisnik.uloga,
      token: napraviToken(korisnik._id),
    });
  } catch (error) {
    res.status(500).json({ poruka: 'Greska na serveru.', greska: error.message });
  }
};

// GET /api/auth/profil  (zasticeno)
const mojProfil = async (req, res) => {
  res.json(req.korisnik);
};

// PUT /api/auth/profil  (zasticeno) - korisnik menja svoje podatke
const izmeniProfil = async (req, res) => {
  try {
    const korisnik = await User.findById(req.korisnik._id).select('+lozinka');

    korisnik.ime = req.body.ime || korisnik.ime;
    korisnik.prezime = req.body.prezime || korisnik.prezime;
    korisnik.adresa = req.body.adresa ?? korisnik.adresa;
    korisnik.telefon = req.body.telefon ?? korisnik.telefon;

    if (req.body.lozinka) {
      if (!lozinkaJeJaka(req.body.lozinka)) {
        return res.status(400).json({
          poruka:
            'Nova lozinka mora imati najmanje 8 karaktera, veliko slovo, malo slovo, cifru i specijalan znak.',
        });
      }
      korisnik.lozinka = req.body.lozinka; // pre('save') hook ce je hesirati
    }

    const sacuvan = await korisnik.save();

    res.json({
      _id: sacuvan._id,
      ime: sacuvan.ime,
      prezime: sacuvan.prezime,
      email: sacuvan.email,
      uloga: sacuvan.uloga,
      adresa: sacuvan.adresa,
      telefon: sacuvan.telefon,
    });
  } catch (error) {
    res.status(500).json({ poruka: 'Greska na serveru.', greska: error.message });
  }
};

module.exports = { registracija, prijava, mojProfil, izmeniProfil };
