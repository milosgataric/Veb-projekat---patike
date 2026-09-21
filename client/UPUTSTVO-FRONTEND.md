# Frontend - uputstvo

## Instalacija

Backend mora biti pokrenut (`npm run dev` u folderu `server`) pre nego sto
pokrenes frontend, jer React aplikacija cita podatke sa `http://localhost:5000`.

U folderu `client`:

```
npm install
npm start
```

Aplikacija se otvara na `http://localhost:3000`.

## Nalozi za testiranje

| Uloga    | Email            | Lozinka   |
|----------|------------------|-----------|
| Admin    | admin@patike.rs  | Admin123! |
| Korisnik | petar@gmail.com  | Petar123! |

Gost (neprijavljen) moze da pregleda katalog, pretrazuje, filtrira i vidi
detalje proizvoda, ali ne moze da zavrsi kupovinu.

## Struktura

```
src/
  api/
    axios.js            instanca za komunikaciju sa backendom,
                        automatski dodaje JWT token u zaglavlje
  context/
    AuthContext.js      podaci o prijavljenom korisniku (prijava, odjava, uloga)
    CartContext.js      korpa, cuva se u localStorage
  components/
    Navbar.js           navigacija koja se menja prema ulozi korisnika
    PatikaKartica.js    kartica proizvoda u katalogu
    ZasticenaRuta.js    omotac za stranice koje zahtevaju prijavu ili admin ulogu
  pages/
    Pocetna.js          katalog sa pretragom, filterima i paginacijom
    DetaljiPatike.js    prikaz jednog proizvoda i dodavanje u korpu
    Prijava.js          forma za prijavu
    Registracija.js     forma za registraciju sa proverom jacine lozinke
    Korpa.js            pregled korpe i kreiranje porudzbine
    MojePorudzbine.js   istorija porudzbina korisnika
    Profil.js           izmena sopstvenih podataka
    admin/
      AdminPatike.js      dodavanje, izmena i brisanje patika
      AdminKorisnici.js   upravljanje korisnicima i ulogama
      AdminPorudzbine.js  pregled svih porudzbina i izmena statusa
  App.js                rutiranje
  index.js              ulazna tacka, ucitava Bootstrap
  index.css             dopunski stilovi
```

## Rute u aplikaciji

| Putanja             | Pristup   | Opis                        |
|---------------------|-----------|-----------------------------|
| /                   | svi       | Katalog patika              |
| /patika/:id         | svi       | Detalji proizvoda           |
| /korpa              | svi       | Korpa (kupovina trazi prijavu) |
| /prijava            | svi       | Prijava                     |
| /registracija       | svi       | Registracija                |
| /porudzbine         | ulogovan  | Moje porudzbine             |
| /profil             | ulogovan  | Izmena profila              |
| /admin/patike       | admin     | Administracija patika       |
| /admin/korisnici    | admin     | Administracija korisnika    |
| /admin/porudzbine   | admin     | Administracija porudzbina   |

## Koriscene tehnologije

- React 19 (funkcionalne komponente i hook-ovi)
- React Router 6 za rutiranje na klijentu
- Axios za HTTP zahteve
- Bootstrap 5 za stilizaciju
- Context API za globalno stanje (prijava i korpa)
