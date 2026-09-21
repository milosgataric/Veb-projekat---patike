const mongoose = require('mongoose');

const patikaSchema = new mongoose.Schema(
  {
    naziv: {
      type: String,
      required: [true, 'Naziv patike je obavezan'],
      trim: true,
      maxlength: [100, 'Naziv moze imati najvise 100 karaktera'],
    },
    brend: {
      type: String,
      required: [true, 'Brend je obavezan'],
      trim: true,
    },
    opis: {
      type: String,
      required: [true, 'Opis je obavezan'],
      trim: true,
      maxlength: [1000, 'Opis moze imati najvise 1000 karaktera'],
    },
    cena: {
      type: Number,
      required: [true, 'Cena je obavezna'],
      min: [0, 'Cena ne moze biti negativna'],
    },
    velicine: {
      // niz dostupnih velicina, npr. [40, 41, 42]
      type: [Number],
      default: [],
      validate: {
        validator: (niz) => niz.every((v) => v >= 20 && v <= 50),
        message: 'Velicine moraju biti izmedju 20 i 50',
      },
    },
    boja: {
      type: String,
      trim: true,
      default: '',
    },
    kolicinaNaStanju: {
      type: Number,
      required: true,
      min: [0, 'Kolicina ne moze biti negativna'],
      default: 0,
    },
    slika: {
      // URL slike proizvoda
      type: String,
      default: 'https://via.placeholder.com/400x300?text=Patika',
    },
    kategorija: {
      type: String,
      enum: ['trcanje', 'kosarka', 'fudbal', 'casual', 'teretana'],
      default: 'casual',
    },
  },
  { timestamps: true }
);

// Indeks za brzu pretragu po nazivu i brendu
patikaSchema.index({ naziv: 'text', brend: 'text', opis: 'text' });

module.exports = mongoose.model('Patika', patikaSchema);
