import { useEffect, useState } from 'react';
import api from '../../api/axios';

const PRAZNA_FORMA = {
  naziv: '',
  brend: '',
  opis: '',
  cena: '',
  velicine: '',
  boja: '',
  kolicinaNaStanju: '',
  kategorija: 'casual',
  slika: '',
};

const AdminPatike = () => {
  const [patike, setPatike] = useState([]);
  const [forma, setForma] = useState(PRAZNA_FORMA);
  const [idIzmene, setIdIzmene] = useState(null);
  const [ucitava, setUcitava] = useState(true);
  const [poruka, setPoruka] = useState('');
  const [greska, setGreska] = useState('');

  const ucitaj = async () => {
    try {
      const { data } = await api.get('/patike', { params: { poStrani: 100 } });
      setPatike(data.patike);
    } catch (err) {
      setGreska('Nije moguce ucitati patike.');
    } finally {
      setUcitava(false);
    }
  };

  useEffect(() => {
    ucitaj();
  }, []);

  const promeni = (e) => setForma({ ...forma, [e.target.name]: e.target.value });

  const otkaziIzmenu = () => {
    setForma(PRAZNA_FORMA);
    setIdIzmene(null);
  };

  const pripremiIzmenu = (p) => {
    setIdIzmene(p._id);
    setForma({
      naziv: p.naziv,
      brend: p.brend,
      opis: p.opis,
      cena: p.cena,
      velicine: p.velicine.join(', '),
      boja: p.boja || '',
      kolicinaNaStanju: p.kolicinaNaStanju,
      kategorija: p.kategorija,
      slika: p.slika || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const posalji = async (e) => {
    e.preventDefault();
    setPoruka('');
    setGreska('');

    // velicine se unose kao tekst "40, 41, 42" pa ih pretvaramo u niz brojeva
    const telo = {
      ...forma,
      cena: Number(forma.cena),
      kolicinaNaStanju: Number(forma.kolicinaNaStanju),
      velicine: forma.velicine
        .split(',')
        .map((v) => Number(v.trim()))
        .filter((v) => !isNaN(v) && v > 0),
    };
    if (!telo.slika) delete telo.slika;

    try {
      if (idIzmene) {
        await api.put(`/patike/${idIzmene}`, telo);
        setPoruka('Patika je izmenjena.');
      } else {
        await api.post('/patike', telo);
        setPoruka('Patika je dodata.');
      }
      otkaziIzmenu();
      ucitaj();
    } catch (err) {
      setGreska(err.response?.data?.poruka || 'Cuvanje nije uspelo.');
    }
  };

  const obrisi = async (id, naziv) => {
    if (!window.confirm(`Obrisati patiku "${naziv}"?`)) return;

    try {
      await api.delete(`/patike/${id}`);
      setPatike((p) => p.filter((x) => x._id !== id));
      setPoruka('Patika je obrisana.');
    } catch (err) {
      setGreska(err.response?.data?.poruka || 'Brisanje nije uspelo.');
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Administracija patika</h2>

      {poruka && <div className="alert alert-success">{poruka}</div>}
      {greska && <div className="alert alert-danger">{greska}</div>}

      <div className="card shadow-sm mb-4">
        <div className="card-header">
          {idIzmene ? 'Izmena patike' : 'Dodavanje nove patike'}
        </div>

        <div className="card-body">
          <form onSubmit={posalji}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Naziv *</label>
                <input
                  className="form-control"
                  name="naziv"
                  value={forma.naziv}
                  onChange={promeni}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Brend *</label>
                <input
                  className="form-control"
                  name="brend"
                  value={forma.brend}
                  onChange={promeni}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Opis *</label>
              <textarea
                className="form-control"
                rows="2"
                name="opis"
                value={forma.opis}
                onChange={promeni}
                required
              />
            </div>

            <div className="row">
              <div className="col-md-3 mb-3">
                <label className="form-label">Cena (RSD) *</label>
                <input
                  type="number"
                  className="form-control"
                  name="cena"
                  value={forma.cena}
                  onChange={promeni}
                  min="0"
                  required
                />
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label">Na stanju *</label>
                <input
                  type="number"
                  className="form-control"
                  name="kolicinaNaStanju"
                  value={forma.kolicinaNaStanju}
                  onChange={promeni}
                  min="0"
                  required
                />
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label">Kategorija</label>
                <select
                  className="form-select"
                  name="kategorija"
                  value={forma.kategorija}
                  onChange={promeni}
                >
                  <option value="casual">Casual</option>
                  <option value="trcanje">Trcanje</option>
                  <option value="kosarka">Kosarka</option>
                  <option value="fudbal">Fudbal</option>
                  <option value="teretana">Teretana</option>
                </select>
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label">Boja</label>
                <input
                  className="form-control"
                  name="boja"
                  value={forma.boja}
                  onChange={promeni}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Velicine</label>
                <input
                  className="form-control"
                  name="velicine"
                  value={forma.velicine}
                  onChange={promeni}
                  placeholder="40, 41, 42"
                />
              </div>

              <div className="col-md-8 mb-3">
                <label className="form-label">URL slike</label>
                <input
                  className="form-control"
                  name="slika"
                  value={forma.slika}
                  onChange={promeni}
                  placeholder="https://..."
                />
              </div>
            </div>

            <button type="submit" className="btn btn-dark">
              {idIzmene ? 'Sacuvaj izmene' : 'Dodaj patiku'}
            </button>

            {idIzmene && (
              <button
                type="button"
                className="btn btn-outline-secondary ms-2"
                onClick={otkaziIzmenu}
              >
                Otkazi
              </button>
            )}
          </form>
        </div>
      </div>

      <h5 className="mb-3">Postojece patike ({patike.length})</h5>

      {ucitava ? (
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Ucitavanje...</span>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th></th>
                <th>Naziv</th>
                <th>Brend</th>
                <th>Cena</th>
                <th>Stanje</th>
                <th>Kategorija</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {patike.map((p) => (
                <tr key={p._id}>
                  <td>
                    <img
                      src={p.slika}
                      alt={p.naziv}
                      width="50"
                      height="50"
                      className="rounded"
                      style={{ objectFit: 'cover' }}
                    />
                  </td>
                  <td>{p.naziv}</td>
                  <td>{p.brend}</td>
                  <td>{p.cena.toLocaleString('sr-RS')}</td>
                  <td>
                    <span
                      className={`badge bg-${
                        p.kolicinaNaStanju > 0 ? 'success' : 'danger'
                      }`}
                    >
                      {p.kolicinaNaStanju}
                    </span>
                  </td>
                  <td>{p.kategorija}</td>
                  <td className="text-nowrap">
                    <button
                      className="btn btn-sm btn-outline-primary me-1"
                      onClick={() => pripremiIzmenu(p)}
                    >
                      Izmeni
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => obrisi(p._id, p.naziv)}
                    >
                      Obrisi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPatike;
