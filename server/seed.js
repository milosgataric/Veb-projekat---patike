// Skripta za popunjavanje baze pocetnim podacima.
// Pokrece se komandom: npm run seed
//
// NAPOMENA: podaci nisu hardkodovani u aplikaciji - ovo je samo
// jednokratno ubacivanje u bazu. Aplikacija ih zatim cita iz baze.

const dotenv = require('dotenv');
const mongoose = require('mongoose');
const poveziBazu = require('./config/db');
const User = require('./models/User');
const Patika = require('./models/Patika');
const Porudzbina = require('./models/Porudzbina');

dotenv.config();

const korisnici = [
  {
    ime: 'Admin',
    prezime: 'Administrator',
    email: 'admin@patike.rs',
    lozinka: 'Admin123!',
    uloga: 'admin',
    adresa: 'Bulevar oslobodjenja 1, Novi Sad',
    telefon: '0601234567',
  },
  {
    ime: 'Petar',
    prezime: 'Petrovic',
    email: 'petar@gmail.com',
    lozinka: 'Petar123!',
    uloga: 'korisnik',
    adresa: 'Zmaj Jovina 5, Novi Sad',
    telefon: '0641112223',
  },
];

const patike = [
  {
    naziv: 'Air Max 270',
    brend: 'Nike',
    opis: 'Udobne patike za svakodnevno nosenje sa vazdusnim jastukom u petnom delu.',
    cena: 15990,
    velicine: [40, 41, 42, 43, 44],
    boja: 'crna',
    kolicinaNaStanju: 12,
    kategorija: 'casual',
    slika: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
  },
  {
    naziv: 'Ultraboost 22',
    brend: 'Adidas',
    opis: 'Patike za trcanje sa Boost medjudjonom koja vraca energiju pri svakom koraku.',
    cena: 19990,
    velicine: [39, 40, 41, 42, 43],
    boja: 'bela',
    kolicinaNaStanju: 8,
    kategorija: 'trcanje',
    slika: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600',
  },
  {
    naziv: 'Chuck Taylor All Star',
    brend: 'Converse',
    opis: 'Klasicne platnene patike prepoznatljivog dizajna, pogodne za sve prilike.',
    cena: 7490,
    velicine: [38, 39, 40, 41, 42, 43, 44],
    boja: 'crvena',
    kolicinaNaStanju: 20,
    kategorija: 'casual',
    slika: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600',
  },
  {
    naziv: 'Suede Classic',
    brend: 'Puma',
    opis: 'Patike od prevrnute koze, ikonicni model prisutan na trzistu decenijama.',
    cena: 9990,
    velicine: [40, 41, 42, 43],
    boja: 'plava',
    kolicinaNaStanju: 15,
    kategorija: 'casual',
    slika: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600',
  },
  {
    naziv: 'LeBron XXI',
    brend: 'Nike',
    opis: 'Kosarkaske patike sa pojacanom podrskom za clanak i odlicnim prijanjanjem.',
    cena: 24990,
    velicine: [42, 43, 44, 45, 46],
    boja: 'zuta',
    kolicinaNaStanju: 5,
    kategorija: 'kosarka',
    slika: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600',
  },
  {
    naziv: 'Predator Accuracy',
    brend: 'Adidas',
    opis: 'Kopacke za prirodnu travu sa teksturiranom gornjistem za precizniji udarac.',
    cena: 17490,
    velicine: [39, 40, 41, 42, 43, 44],
    boja: 'crna',
    kolicinaNaStanju: 7,
    kategorija: 'fudbal',
    slika: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=600',
  },
  {
    naziv: 'Metcon 9',
    brend: 'Nike',
    opis: 'Patike za trening u teretani sa stabilnom petom za dizanje tegova.',
    cena: 16990,
    velicine: [40, 41, 42, 43, 44],
    boja: 'siva',
    kolicinaNaStanju: 10,
    kategorija: 'teretana',
    slika: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600',
  },
  {
    naziv: 'Old Skool',
    brend: 'Vans',
    opis: 'Skejt patike sa prepoznatljivom bocnom prugom i ojacanim djonom.',
    cena: 8990,
    velicine: [38, 39, 40, 41, 42, 43],
    boja: 'crna',
    kolicinaNaStanju: 18,
    kategorija: 'casual',
    slika: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600',
  },
  {
    naziv: 'Gel-Kayano 30',
    brend: 'Asics',
    opis: 'Patike za duge trke sa naprednom stabilizacijom stopala.',
    cena: 21990,
    velicine: [40, 41, 42, 43, 44, 45],
    boja: 'plava',
    kolicinaNaStanju: 6,
    kategorija: 'trcanje',
    slika: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600',
  },
  {
    naziv: 'Classic Leather',
    brend: 'Reebok',
    opis: 'Kozne patike jednostavnog dizajna koje se lako kombinuju.',
    cena: 10490,
    velicine: [39, 40, 41, 42, 43],
    boja: 'bela',
    kolicinaNaStanju: 14,
    kategorija: 'casual',
    slika: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600',
  },
];

const ubaciPodatke = async () => {
  try {
    await poveziBazu();

    // brisemo postojece podatke da bismo krenuli od cistog stanja
    await Porudzbina.deleteMany();
    await Patika.deleteMany();
    await User.deleteMany();
    console.log('Stari podaci obrisani.');

    // User.create pokrece pre('save') hook koji hesira lozinke
    await User.create(korisnici);
    console.log(`Ubaceno korisnika: ${korisnici.length}`);

    await Patika.insertMany(patike);
    console.log(`Ubaceno patika: ${patike.length}`);

    console.log('\nPodaci su uspesno ubaceni u bazu.');
    console.log('--------------------------------------');
    console.log('Admin nalog:    admin@patike.rs  /  Admin123!');
    console.log('Korisnik nalog: petar@gmail.com  /  Petar123!');
    console.log('--------------------------------------');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Greska pri ubacivanju podataka:', error.message);
    process.exit(1);
  }
};

ubaciPodatke();
