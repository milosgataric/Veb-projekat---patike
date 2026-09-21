const Patika = require('../models/Patika');

// GET /api/patike  (javno - dostupno i gostu)
// Podrzava pretragu, filtriranje, sortiranje i paginaciju preko query parametara.
// Primer: /api/patike?pretraga=nike&brend=Nike&minCena=5000&sort=cena&strana=1
const svePatike = async (req, res) => {
  try {
    const { pretraga, brend, kategorija, minCena, maxCena, velicina, sort } =
      req.query;

    const filter = {};

    if (pretraga) {
      // pretraga po nazivu ili brendu, bez obzira na velika/mala slova
      filter.$or = [
        { naziv: { $regex: pretraga, $options: 'i' } },
        { brend: { $regex: pretraga, $options: 'i' } },
      ];
    }
    if (brend) filter.brend = { $regex: `^${brend}$`, $options: 'i' };
    if (kategorija) filter.kategorija = kategorija;
    if (velicina) filter.velicine = Number(velicina);

    if (minCena || maxCena) {
      filter.cena = {};
      if (minCena) filter.cena.$gte = Number(minCena);
      if (maxCena) filter.cena.$lte = Number(maxCena);
    }

    // sortiranje: cena, -cena (opadajuce), naziv, najnovije
    let sortiranje = '-createdAt';
    if (sort === 'cena') sortiranje = 'cena';
    if (sort === '-cena') sortiranje = '-cena';
    if (sort === 'naziv') sortiranje = 'naziv';

    const strana = Number(req.query.strana) || 1;
    const poStrani = Number(req.query.poStrani) || 12;

    const ukupno = await Patika.countDocuments(filter);
    const patike = await Patika.find(filter)
      .sort(sortiranje)
      .skip((strana - 1) * poStrani)
      .limit(poStrani);

    res.json({
      patike,
      strana,
      ukupnoStrana: Math.ceil(ukupno / poStrani),
      ukupno,
    });
  } catch (error) {
    res.status(500).json({ poruka: 'Greska na serveru.', greska: error.message });
  }
};

// GET /api/patike/:id  (javno)
const jednaPatika = async (req, res) => {
  try {
    const patika = await Patika.findById(req.params.id);
    if (!patika) {
      return res.status(404).json({ poruka: 'Patika nije pronadjena.' });
    }
    res.json(patika);
  } catch (error) {
    res.status(404).json({ poruka: 'Patika nije pronadjena.' });
  }
};

// GET /api/patike/brendovi  (javno) - lista brendova za filter na frontendu
const sviBrendovi = async (req, res) => {
  try {
    const brendovi = await Patika.distinct('brend');
    res.json(brendovi.sort());
  } catch (error) {
    res.status(500).json({ poruka: 'Greska na serveru.', greska: error.message });
  }
};

// POST /api/patike  (samo admin)
const dodajPatiku = async (req, res) => {
  try {
    const patika = await Patika.create(req.body);
    res.status(201).json(patika);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const poruke = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ poruka: poruke.join(' ') });
    }
    res.status(500).json({ poruka: 'Greska na serveru.', greska: error.message });
  }
};

// PUT /api/patike/:id  (samo admin)
const izmeniPatiku = async (req, res) => {
  try {
    const patika = await Patika.findByIdAndUpdate(req.params.id, req.body, {
      new: true,            // vrati izmenjeni dokument
      runValidators: true,  // primeni validacije iz modela
    });
    if (!patika) {
      return res.status(404).json({ poruka: 'Patika nije pronadjena.' });
    }
    res.json(patika);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const poruke = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ poruka: poruke.join(' ') });
    }
    res.status(500).json({ poruka: 'Greska na serveru.', greska: error.message });
  }
};

// DELETE /api/patike/:id  (samo admin)
const obrisiPatiku = async (req, res) => {
  try {
    const patika = await Patika.findByIdAndDelete(req.params.id);
    if (!patika) {
      return res.status(404).json({ poruka: 'Patika nije pronadjena.' });
    }
    res.json({ poruka: 'Patika je uspesno obrisana.', id: req.params.id });
  } catch (error) {
    res.status(500).json({ poruka: 'Greska na serveru.', greska: error.message });
  }
};

module.exports = {
  svePatike,
  jednaPatika,
  sviBrendovi,
  dodajPatiku,
  izmeniPatiku,
  obrisiPatiku,
};
