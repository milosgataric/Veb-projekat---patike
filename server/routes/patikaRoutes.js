const express = require('express');
const router = express.Router();
const {
  svePatike,
  jednaPatika,
  sviBrendovi,
  dodajPatiku,
  izmeniPatiku,
  obrisiPatiku,
} = require('../controllers/patikaController');
const { zastita, dozvoli } = require('../middleware/auth');

// VAZNO: /brendovi mora biti PRE /:id,
// inace bi Express "brendovi" shvatio kao vrednost parametra id.
router.get('/brendovi', sviBrendovi);

// javne rute - dostupne i gostu (READ)
router.get('/', svePatike);
router.get('/:id', jednaPatika);

// administratorske rute (CREATE, UPDATE, DELETE)
router.post('/', zastita, dozvoli('admin'), dodajPatiku);
router.put('/:id', zastita, dozvoli('admin'), izmeniPatiku);
router.delete('/:id', zastita, dozvoli('admin'), obrisiPatiku);

module.exports = router;
