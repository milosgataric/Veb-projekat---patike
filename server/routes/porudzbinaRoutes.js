const express = require('express');
const router = express.Router();
const {
  napraviPorudzbinu,
  mojePorudzbine,
  svePorudzbine,
  jednaPorudzbina,
  izmeniStatus,
  obrisiPorudzbinu,
} = require('../controllers/porudzbinaController');
const { zastita, dozvoli } = require('../middleware/auth');

// sve rute za porudzbine zahtevaju prijavu
router.use(zastita);

router.post('/', napraviPorudzbinu);
router.get('/moje', mojePorudzbine);

// samo admin vidi sve porudzbine
router.get('/', dozvoli('admin'), svePorudzbine);
router.put('/:id/status', dozvoli('admin'), izmeniStatus);

// vlasnik ili admin
router.get('/:id', jednaPorudzbina);
router.delete('/:id', obrisiPorudzbinu);

module.exports = router;
