const mongoose = require('mongoose');

// Povezivanje sa MongoDB bazom.
// Konekcioni string se cita iz .env fajla (MONGO_URI) kako se
// pristupni podaci ne bi nalazili u izvornom kodu.
const poveziBazu = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB povezan: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Greska pri povezivanju sa bazom: ${error.message}`);
    process.exit(1); // prekidamo rad servera ako baza nije dostupna
  }
};

module.exports = poveziBazu;
