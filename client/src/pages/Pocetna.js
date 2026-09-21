import { useCallback, useEffect, useState } from 'react';
import api from '../api/axios';
import PatikaKartica from '../components/PatikaKartica';

const PRAZNI_FILTERI = {
  pretraga: '',
  brend: '',
  kategorija: '',
  minCena: '',
  maxCena: '',
  velicina: '',
  sort: '',
};

const Pocetna = () => {
  const [patike, setPatike] = useState([]);
  const [brendovi, setBrendovi] = useState([]);
  const [kurs, setKurs] = useState(null);
  const [filteri, setFilteri] = useState(PRAZNI_FILTERI);
  const [strana, setStrana] = useState(1);
  const [ukupnoStrana, setUkupnoStrana] = useState(1);
  const [ukupno, setUkupno] = useState(0);
  const [ucitava, setUcitava] = useState(true);
  const [greska, setGreska] = useState('');

  // lista brendova i kursna lista se ucitavaju samo jednom
  useEffect(() => {
    api
      .get('/patike/brendovi')
      .then(({ data }) => setBrendovi(data))
      .catch(() => setBrendovi([]));

    api
      .get('/kurs')
      .then(({ data }) => setKurs(data))
      .catch(() => setKurs(null));
  }, []);

  const ucitajPatike = useCallback(async () => {
    setUcitava(true);
    setGreska('');

    try {
      // saljemo samo popunjene filtere
      const parametri = { strana, poStrani: 9 };
      Object.entries(filteri).forEach(([kljuc, vrednost]) => {
        if (vrednost !== '') parametri[kljuc] = vrednost;
      });

      const { data } = await api.get('/patike', { params: parametri });

      setPatike(data.patike);
      setUkupnoStrana(data.ukupnoStrana || 1);
      setUkupno(data.ukupno || 0);
    } catch (err) {
      setGreska(
        'Nije moguce ucitati patike. Proverite da li je server pokrenut.'
      );
    } finally {
      setUcitava(false);
    }
  }, [filteri, strana]);

  useEffect(() => {
    ucitajPatike();
  }, [ucitajPatike]);

  const promeniFilter = (e) => {
    const { name, value } = e.target;
    setFilteri((prethodni) => ({ ...prethodni, [name]: value }));
    setStrana(1); // svaka promena filtera vraca na prvu stranu
  };

  const resetuj = () => {
    setFilteri(PRAZNI_FILTERI);
    setStrana(1);
  };

  return (
    <>
      {/* Naslovna sekcija */}
      <div className="bg-dark text-white py-5 mb-4">
        <div className="container">
          <h1 className="display-5 fw-bold">Patike za svaku priliku</h1>
          <p className="lead mb-0">
            Pregledajte ponudu, uporedite modele i porucite online.
          </p>
          {kurs && (
            <small className="text-white-50">
              Kurs na dan {kurs.datum}: 1 RSD ={' '}
              {kurs.kursevi.EUR?.toFixed(5)} EUR
            </small>
          )}
        </div>
      </div>

      <div className="container pb-5">
        <div className="row">
          {/* Filteri */}
          <aside className="col-lg-3 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-3">Filteri</h5>

                <div className="mb-3">
                  <label className="form-label">Pretraga</label>
                  <input
                    type="text"
                    className="form-control"
                    name="pretraga"
                    value={filteri.pretraga}
                    onChange={promeniFilter}
                    placeholder="naziv ili brend"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Brend</label>
                  <select
                    className="form-select"
                    name="brend"
                    value={filteri.brend}
                    onChange={promeniFilter}
                  >
                    <option value="">Svi brendovi</option>
                    {brendovi.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Kategorija</label>
                  <select
                    className="form-select"
                    name="kategorija"
                    value={filteri.kategorija}
                    onChange={promeniFilter}
                  >
                    <option value="">Sve kategorije</option>
                    <option value="trcanje">Trcanje</option>
                    <option value="kosarka">Kosarka</option>
                    <option value="fudbal">Fudbal</option>
                    <option value="casual">Casual</option>
                    <option value="teretana">Teretana</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Cena (RSD)</label>
                  <div className="d-flex gap-2">
                    <input
                      type="number"
                      className="form-control"
                      name="minCena"
                      value={filteri.minCena}
                      onChange={promeniFilter}
                      placeholder="od"
                      min="0"
                    />
                    <input
                      type="number"
                      className="form-control"
                      name="maxCena"
                      value={filteri.maxCena}
                      onChange={promeniFilter}
                      placeholder="do"
                      min="0"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Velicina</label>
                  <input
                    type="number"
                    className="form-control"
                    name="velicina"
                    value={filteri.velicina}
                    onChange={promeniFilter}
                    placeholder="npr. 42"
                    min="20"
                    max="50"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Sortiranje</label>
                  <select
                    className="form-select"
                    name="sort"
                    value={filteri.sort}
                    onChange={promeniFilter}
                  >
                    <option value="">Najnovije</option>
                    <option value="cena">Cena rastuce</option>
                    <option value="-cena">Cena opadajuce</option>
                    <option value="naziv">Naziv A-Z</option>
                  </select>
                </div>

                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={resetuj}
                >
                  Ponisti filtere
                </button>
              </div>
            </div>
          </aside>

          {/* Rezultati */}
          <div className="col-lg-9">
            {greska && <div className="alert alert-danger">{greska}</div>}

            {ucitava ? (
              <div className="text-center py-5">
                <div className="spinner-border text-dark" role="status">
                  <span className="visually-hidden">Ucitavanje...</span>
                </div>
              </div>
            ) : patike.length === 0 ? (
              <div className="alert alert-info">
                Nema patika koje odgovaraju zadatim kriterijumima.
              </div>
            ) : (
              <>
                <p className="text-muted">Pronadjeno proizvoda: {ukupno}</p>

                <div className="row g-4">
                  {patike.map((p) => (
                    <div className="col-sm-6 col-xl-4" key={p._id}>
                      <PatikaKartica patika={p} kurs={kurs} />
                    </div>
                  ))}
                </div>

                {ukupnoStrana > 1 && (
                  <nav className="mt-4">
                    <ul className="pagination justify-content-center">
                      <li className={`page-item ${strana === 1 ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => setStrana(strana - 1)}
                        >
                          Prethodna
                        </button>
                      </li>

                      {Array.from({ length: ukupnoStrana }, (_, i) => i + 1).map(
                        (broj) => (
                          <li
                            key={broj}
                            className={`page-item ${
                              broj === strana ? 'active' : ''
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setStrana(broj)}
                            >
                              {broj}
                            </button>
                          </li>
                        )
                      )}

                      <li
                        className={`page-item ${
                          strana === ukupnoStrana ? 'disabled' : ''
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setStrana(strana + 1)}
                        >
                          Sledeca
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Pocetna;
