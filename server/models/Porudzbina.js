const mongoose = require('mongoose');

// Jedna stavka u porudzbini (jedan model patike, jedna velicina, kolicina)
const stavkaSchema = new mongoose.Schema(
  {
    patika: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patika',
      required: true,
    },
    naziv: { type: String, required: true },   // snimamo naziv i cenu u trenutku kupovine
    cena: { type: Number, required: true },    // da kasnija izmena proizvoda ne menja staru porudzbinu
    velicina: { type: Number, required: true },
    kolicina: {
      type: Number,
      required: true,
      min: [1, 'Kolicina mora biti najmanje 1'],
    },
  },
  { _id: false }
);

const porudzbinaSchema = new mongoose.Schema(
  {
    korisnik: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    stavke: {
      type: [stavkaSchema],
      validate: {
        validator: (niz) => niz.length > 0,
        message: 'Porudzbina mora imati bar jednu stavku',
      },
    },
    ukupnaCena: {
      type: Number,
      required: true,
      min: 0,
    },
    adresaDostave: {
      type: String,
      required: [true, 'Adresa dostave je obavezna'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['na cekanju', 'u obradi', 'poslata', 'isporucena', 'otkazana'],
      default: 'na cekanju',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Porudzbina', porudzbinaSchema);
