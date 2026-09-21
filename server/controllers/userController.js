const User = require('../models/User');

// GET /api/korisnici  (samo admin)
const sviKorisnici = async (req, res) => {
  try {
    const korisnici = await User.find().sort('-createdAt');
    res.json(korisnici);
  } catch (error) {
    res.status(500).json({ poruka: 'Greska na serveru.', greska: error.message });
  }
};

// GET /api/korisnici/:id  (samo admin)
const jedanKorisnik = async (req, res) => {
  try {
    const korisnik = await User.findById(req.params.id);
    if (!korisnik) {
      return res.status(404).json({ poruka: 'Korisnik nije pronadjen.' });
    }
    res.json(korisnik);
  } catch (error) {
    res.status(404).json({ poruka: 'Korisnik nije pronadjen.' });
  }
};

// PUT /api/korisnici/:id  (samo admin) - admin menja podatke i ulogu korisnika
const izmeniKorisnika = async (req, res) => {
  try {
    const { ime, prezime, uloga, adresa, telefon } = req.body;

    const korisnik = await User.findById(req.params.id);
    if (!korisnik) {
      return res.status(404).json({ poruka: 'Korisnik nije pronadjen.' });
    }

    // admin ne moze sebi da oduzme admin ulogu (da ne ostane sistem bez admina)
    if (
      korisnik._id.toString() === req.korisnik._id.toString() &&
      uloga &&
      uloga !== 'admin'
    ) {
      return res
        .status(400)
        .json({ poruka: 'Ne mozete sami sebi oduzeti administratorska prava.' });
    }

    korisnik.ime = ime || korisnik.ime;
    korisnik.prezime = prezime || korisnik.prezime;
    korisnik.uloga = uloga || korisnik.uloga;
    korisnik.adresa = adresa ?? korisnik.adresa;
    korisnik.telefon = telefon ?? korisnik.telefon;

    const sacuvan = await korisnik.save();
    res.json(sacuvan);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const poruke = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ poruka: poruke.join(' ') });
    }
    res.status(500).json({ poruka: 'Greska na serveru.', greska: error.message });
  }
};

// DELETE /api/korisnici/:id  (samo admin)
const obrisiKorisnika = async (req, res) => {
  try {
    if (req.params.id === req.korisnik._id.toString()) {
      return res
        .status(400)
        .json({ poruka: 'Ne mozete obrisati sopstveni nalog.' });
    }

    const korisnik = await User.findByIdAndDelete(req.params.id);
    if (!korisnik) {
      return res.status(404).json({ poruka: 'Korisnik nije pronadjen.' });
    }

    res.json({ poruka: 'Korisnik je obrisan.', id: req.params.id });
  } catch (error) {
    res.status(500).json({ poruka: 'Greska na serveru.', greska: error.message });
  }
};

module.exports = { sviKorisnici, jedanKorisnik, izmeniKorisnika, obrisiKorisnika };
