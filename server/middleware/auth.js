const jwt = require('jsonwebtoken');
const User = require('../models/User');

// AUTENTIKACIJA - proverava da li je korisnik ulogovan.
// Token se salje u zaglavlju: Authorization: Bearer <token>
const zastita = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ poruka: 'Niste prijavljeni. Pristup odbijen.' });
  }

  try {
    const dekodiran = jwt.verify(token, process.env.JWT_SECRET);
    // dohvatamo korisnika iz baze da bismo imali aktuelnu ulogu
    const korisnik = await User.findById(dekodiran.id);

    if (!korisnik) {
      return res.status(401).json({ poruka: 'Korisnik vise ne postoji.' });
    }

    req.korisnik = korisnik; // prosledjujemo korisnika sledecem middleware-u
    next();
  } catch (error) {
    return res.status(401).json({ poruka: 'Token nije validan ili je istekao.' });
  }
};

// AUTORIZACIJA - proverava da li korisnik ima potrebnu ulogu.
// Koristi se ovako: ruta.delete('/:id', zastita, dozvoli('admin'), obrisi)
const dozvoli = (...uloge) => {
  return (req, res, next) => {
    if (!uloge.includes(req.korisnik.uloga)) {
      return res.status(403).json({
        poruka: 'Nemate dozvolu za ovu akciju.',
      });
    }
    next();
  };
};

module.exports = { zastita, dozvoli };
