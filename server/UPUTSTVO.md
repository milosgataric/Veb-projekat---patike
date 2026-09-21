# Backend - uputstvo za pokretanje

## 1. Instalacija paketa

Otvori terminal u folderu `server` i pokreni:

```
npm install
```

## 2. Podesavanje .env fajla

U folderu `server` postoji fajl `.env.example`.
Napravi kopiju i nazovi je `.env`, pa popuni vrednosti.

Sadrzaj `.env` fajla:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/patike
JWT_SECRET=neki_dugacak_nasumican_string_123456789
```

**Vazno:** `.env` se ne salje na GitHub jer sadrzi tajne podatke.

## 3. Baza podataka

Potrebna je MongoDB baza. Dve opcije:

**A) Lokalno** - instaliraj MongoDB Community Server sa
https://www.mongodb.com/try/download/community
Posle instalacije baza radi na `mongodb://127.0.0.1:27017`.

**B) MongoDB Atlas (u oblaku, besplatno)** - napravi nalog na
https://www.mongodb.com/atlas, kreiraj besplatan M0 cluster,
dodaj korisnika baze i u Network Access dozvoli pristup sa 0.0.0.0/0.
Zatim kopiraj konekcioni string u `MONGO_URI`.

## 4. Ubacivanje pocetnih podataka

```
npm run seed
```

Ova komanda brise postojece podatke i ubacuje 10 patika i 2 naloga:

| Uloga    | Email            | Lozinka   |
|----------|------------------|-----------|
| Admin    | admin@patike.rs  | Admin123! |
| Korisnik | petar@gmail.com  | Petar123! |

## 5. Pokretanje servera

```
npm run dev
```

Server radi na `http://localhost:5000`.
Provera: otvori tu adresu u pregledacu, treba da vidis JSON poruku.

---

## Pregled API ruta

### Autentikacija - /api/auth

| Metoda | Ruta        | Pristup   | Opis                        |
|--------|-------------|-----------|-----------------------------|
| POST   | /register   | svi       | Registracija novog korisnika |
| POST   | /login      | svi       | Prijava, vraca JWT token     |
| GET    | /profil     | ulogovan  | Podaci o sebi                |
| PUT    | /profil     | ulogovan  | Izmena svog profila          |

### Patike - /api/patike

| Metoda | Ruta        | Pristup   | Opis                          |
|--------|-------------|-----------|-------------------------------|
| GET    | /           | svi       | Lista patika (pretraga, filteri) |
| GET    | /brendovi   | svi       | Lista svih brendova           |
| GET    | /:id        | svi       | Detalji jedne patike          |
| POST   | /           | admin     | Dodavanje patike              |
| PUT    | /:id        | admin     | Izmena patike                 |
| DELETE | /:id        | admin     | Brisanje patike               |

Query parametri za GET `/`:
`pretraga`, `brend`, `kategorija`, `minCena`, `maxCena`, `velicina`,
`sort` (cena, -cena, naziv), `strana`, `poStrani`

### Porudzbine - /api/porudzbine

| Metoda | Ruta          | Pristup         | Opis                      |
|--------|---------------|-----------------|---------------------------|
| POST   | /             | ulogovan        | Kreiranje porudzbine      |
| GET    | /moje         | ulogovan        | Moje porudzbine           |
| GET    | /             | admin           | Sve porudzbine            |
| GET    | /:id          | vlasnik/admin   | Detalji porudzbine        |
| PUT    | /:id/status   | admin           | Izmena statusa            |
| DELETE | /:id          | vlasnik/admin   | Otkazivanje/brisanje      |

### Korisnici - /api/korisnici (samo admin)

| Metoda | Ruta   | Opis                        |
|--------|--------|-----------------------------|
| GET    | /      | Lista svih korisnika        |
| GET    | /:id   | Jedan korisnik              |
| PUT    | /:id   | Izmena podataka i uloge     |
| DELETE | /:id   | Brisanje korisnika          |

### Kursna lista - /api/kurs

| Metoda | Ruta | Pristup | Opis                                  |
|--------|------|---------|---------------------------------------|
| GET    | /    | svi     | Kurs RSD prema EUR i USD (spoljni API) |

---

## Kako se salje token

Zasticene rute zahtevaju token u zaglavlju zahteva:

```
Authorization: Bearer <token>
```

Token se dobija kao odgovor na `/api/auth/login` ili `/api/auth/register`.

---

## Bezbednosne mere u projektu

- Lozinke se cuvaju hesirane (bcrypt, 10 rundi), nikada kao tekst
- Lozinka mora imati 8+ karaktera, veliko i malo slovo, cifru i specijalan znak
- Polje `lozinka` ima `select: false` - ne vraca se iz baze bez izricitog trazenja
- Prilikom prijave ista poruka za pogresan email i pogresnu lozinku,
  da napadac ne sazna koji emailovi postoje u sistemu
- Uloga se ne uzima iz tela zahteva pri registraciji - svako je `korisnik`
- Cene porudzbine se racunaju na serveru iz baze, ne iz zahteva klijenta
- Admin ne moze sam sebi da oduzme prava niti da obrise svoj nalog
- Tajni kljucevi su u `.env` fajlu koji nije na GitHubu
