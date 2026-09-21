const express = require('express');
const router = express.Router();
const { dohvatiKurs } = require('../controllers/kursController');

// javna ruta - integracija sa spoljnim API-jem (kursna lista)
router.get('/', dohvatiKurs);

module.exports = router;
