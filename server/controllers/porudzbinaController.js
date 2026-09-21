const Porudzbina = require('../models/Porudzbina');
const Patika = require('../models/Patika');

// POST /api/porudzbine  (ulogovan korisnik)
// Telo zahteva: { stavke: [{ patika, velicina, kolicina }], adresaDostave }
const napraviPorudzbinu = async (req, res) => {
  try {
    const { stavke, adresaDostave } = req.body;

    if (!stavke || stavke.length === 0) {
      return res.status(400).json({ poruka: 'Korpa je prazna.' });
    }
    if (!adresaDostave) {
      return res.status(400).json({ poruka: 'Adresa dostave je obavezna.' });
    }

    let ukupnaCena = 0;
    const pripremljeneStavke = [];

    // Cene NE uzimamo iz zahteva nego iz baze - inace bi korisnik
    // mogao da posalje svoju cenu i kupi patike za 1 dinar.
    for (const stavka of stavke) {
      const patika = await Patika.findById(stavka.patika);

      if (!patika) {
        return res
          .status(404)
          .json({ poruka: `Patika sa ID ${stavka.patika} ne postoji.` });
      }
      if (patika.kolicinaNaStanju < stavka.kolicina) {
        return res.status(400).json({
          poruka: `Nema dovoljno komada za "${patika.naziv}". Na stanju: ${patika.kolicinaNaStanju}.`,
        });
      }

      pripremljeneStavke.push({
        patika: patika._id,
        naziv: patika.naziv,
        cena: patika.cena,
        velicina: stavka.velicina,
        kolicina: stavka.kolicina,
      });

      ukupnaCena += patika.cena * stavka.kolicina;
    }

    const porudzbina = await Porudzbina.create({
      korisnik: req.korisnik._id,
      stavke: pripremljeneStavke,
      ukupnaCena,
      adresaDostave,
    });

    // smanjujemo zalihe tek kada je porudzbina uspesno kreirana
    for (const stavka of pripremljeneStavke) {
      await Patika.findByIdAndUpdate(stavka.patika, {
        $inc: { kolicinaNaStanju: -stavka.kolicina },
      });
    }

    res.status(201).json(porudzbina);
  } catch (error) {
    res.status(500).json({ poruka: 'Greska na serveru.', greska: error.message });
  }
};

// GET /api/porudzbine/moje  (ulogovan korisnik)
const mojePorudzbine = async (req, res) => {
  try {
    const porudzbine = await Porudzbina.find({ korisnik: req.korisnik._id })
      .sort('-createdAt')
      .populate('stavke.patika', 'slika brend');
    res.json(porudzbine);
  } catch (error) {
    res.status(500).json({ poruka: 'Greska na serveru.', greska: error.message });
  }
};

// GET /api/porudzbine  (samo admin) - sve porudzbine u sistemu
const svePorudzbine = async (req, res) => {
  try {
    const porudzbine = await Porudzbina.find()
      .sort('-createdAt')
      .populate('korisnik', 'ime prezime email');
    res.json(porudzbine);
  } catch (error) {
    res.status(500).json({ poruka: 'Greska na serveru.', greska: error.message });
  }
};

// GET /api/porudzbine/:id  (vlasnik porudzbine ili admin)
const jednaPorudzbina = async (req, res) => {
  try {
    const porudzbina = await Porudzbina.findById(req.params.id).populate(
      'korisnik',
      'ime prezime email'
    );

    if (!porudzbina) {
      return res.status(404).json({ poruka: 'Porudzbina nije pronadjena.' });
    }

    const jeVlasnik =
      porudzbina.korisnik._id.toString() === req.korisnik._id.toString();

    if (!jeVlasnik && req.korisnik.uloga !== 'admin') {
      return res
        .status(403)
        .json({ poruka: 'Nemate dozvolu da vidite ovu porudzbinu.' });
    }

    res.json(porudzbina);
  } catch (error) {
    res.status(404).json({ poruka: 'Porudzbina nije pronadjena.' });
  }
};

// PUT /api/porudzbine/:id/status  (samo admin)
const izmeniStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const porudzbina = await Porudzbina.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!porudzbina) {
      return res.status(404).json({ poruka: 'Porudzbina nije pronadjena.' });
    }

    res.json(porudzbina);
  } catch (error) {
    res.status(400).json({ poruka: 'Neispravan status.', greska: error.message });
  }
};

// DELETE /api/porudzbine/:id  (vlasnik moze da otkaze, admin moze da obrise)
const obrisiPorudzbinu = async (req, res) => {
  try {
    const porudzbina = await Porudzbina.findById(req.params.id);

    if (!porudzbina) {
      return res.status(404).json({ poruka: 'Porudzbina nije pronadjena.' });
    }

    const jeVlasnik =
      porudzbina.korisnik.toString() === req.korisnik._id.toString();

    if (!jeVlasnik && req.korisnik.uloga !== 'admin') {
      return res.status(403).json({ poruka: 'Nemate dozvolu za ovu akciju.' });
    }

    // vracamo robu na stanje
    for (const stavka of porudzbina.stavke) {
      await Patika.findByIdAndUpdate(stavka.patika, {
        $inc: { kolicinaNaStanju: stavka.kolicina },
      });
    }

    await porudzbina.deleteOne();

    res.json({ poruka: 'Porudzbina je obrisana.', id: req.params.id });
  } catch (error) {
    res.status(500).json({ poruka: 'Greska na serveru.', greska: error.message });
  }
};

module.exports = {
  napraviPorudzbinu,
  mojePorudzbine,
  svePorudzbine,
  jednaPorudzbina,
  izmeniStatus,
  obrisiPorudzbinu,
};
