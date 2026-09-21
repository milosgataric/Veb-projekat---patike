const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    ime: {
      type: String,
      required: [true, 'Ime je obavezno'],
      trim: true,
      minlength: [2, 'Ime mora imati najmanje 2 karaktera'],
      maxlength: [50, 'Ime moze imati najvise 50 karaktera'],
    },
    prezime: {
      type: String,
      required: [true, 'Prezime je obavezno'],
      trim: true,
      minlength: [2, 'Prezime mora imati najmanje 2 karaktera'],
      maxlength: [50, 'Prezime moze imati najvise 50 karaktera'],
    },
    email: {
      type: String,
      required: [true, 'Email je obavezan'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email nije u ispravnom formatu'],
    },
    lozinka: {
      type: String,
      required: [true, 'Lozinka je obavezna'],
      minlength: [8, 'Lozinka mora imati najmanje 8 karaktera'],
      select: false, // lozinka se podrazumevano NE vraca iz baze
    },
    uloga: {
      type: String,
      enum: ['korisnik', 'admin'],
      default: 'korisnik',
    },
    adresa: {
      type: String,
      trim: true,
      default: '',
    },
    telefon: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true } // automatski dodaje createdAt i updatedAt
);

// Pre svakog snimanja, ako je lozinka menjana, hesiramo je.
// Lozinka se nikada ne cuva u bazi kao otvoreni tekst.
userSchema.pre('save', async function (next) {
  if (!this.isModified('lozinka')) return next();

  const salt = await bcrypt.genSalt(10);
  this.lozinka = await bcrypt.hash(this.lozinka, salt);
  next();
});

// Metoda za proveru lozinke prilikom prijave.
userSchema.methods.proveriLozinku = async function (unetaLozinka) {
  return await bcrypt.compare(unetaLozinka, this.lozinka);
};

module.exports = mongoose.model('User', userSchema);
