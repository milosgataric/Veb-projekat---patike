const express = require('express');
const router = express.Router();
const {
  registracija,
  prijava,
  mojProfil,
  izmeniProfil,
} = require('../controllers/authController');
const { zastita } = require('../middleware/auth');

// javne rute
router.post('/register', registracija);
router.post('/login', prijava);

// zasticene rute - samo ulogovan korisnik
router.get('/profil', zastita, mojProfil);
router.put('/profil', zastita, izmeniProfil);

module.exports = router;
