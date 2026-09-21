const express = require('express');
const router = express.Router();
const {
  sviKorisnici,
  jedanKorisnik,
  izmeniKorisnika,
  obrisiKorisnika,
} = require('../controllers/userController');
const { zastita, dozvoli } = require('../middleware/auth');

// upravljanje korisnicima je iskljucivo administratorska funkcija
router.use(zastita, dozvoli('admin'));

router.get('/', sviKorisnici);
router.get('/:id', jedanKorisnik);
router.put('/:id', izmeniKorisnika);
router.delete('/:id', obrisiKorisnika);

module.exports = router;
