// Integracija sa spoljnim API-jem - kursna lista.
// Koristi se besplatni servis ExchangeRate-API (open.er-api.com),
// bez registracije i bez API kljuca. Podrzava srpski dinar.
//
// Node 18+ ima ugradjeni fetch, pa nije potrebna dodatna biblioteka.

let kes = null;          // jednostavan kes da ne zovemo API pri svakom zahtevu
let vremeKesa = 0;
const TRAJANJE_KESA = 1000 * 60 * 60; // 1 sat

// GET /api/kurs  (javno)
// Vraca koliko 1 RSD vredi u EUR i USD, tj. kurseve za preracun cena.
const dohvatiKurs = async (req, res) => {
  try {
    const sada = Date.now();

    if (kes && sada - vremeKesa < TRAJANJE_KESA) {
      return res.json({ ...kes, izKesa: true });
    }

    const odgovor = await fetch('https://open.er-api.com/v6/latest/RSD');

    if (!odgovor.ok) {
      throw new Error(`API je vratio status ${odgovor.status}`);
    }

    const podaci = await odgovor.json();

    if (podaci.result !== 'success') {
      throw new Error('API nije vratio ispravan odgovor.');
    }

    kes = {
      osnova: podaci.base_code,                       // RSD
      datum: podaci.time_last_update_utc.slice(5, 16), // npr. "21 Sep 2026"
      kursevi: {
        EUR: podaci.rates.EUR,
        USD: podaci.rates.USD,
      },
    };
    vremeKesa = sada;

    res.json({ ...kes, izKesa: false });
  } catch (error) {
    // Ako spoljni servis ne radi, aplikacija ne sme da padne -
    // vracamo poslednji poznati kurs ako ga imamo.
    if (kes) {
      return res.json({ ...kes, izKesa: true, upozorenje: 'Koriscen stari kurs.' });
    }
    res.status(503).json({
      poruka: 'Kursna lista trenutno nije dostupna.',
      greska: error.message,
    });
  }
};

module.exports = { dohvatiKurs };