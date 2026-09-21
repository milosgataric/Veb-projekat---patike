import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const bojaStatusa = {
  'na cekanju': 'secondary',
  'u obradi': 'info',
  poslata: 'primary',
  isporucena: 'success',
  otkazana: 'danger',
};

const MojePorudzbine = () => {
  const [porudzbine, setPorudzbine] = useState([]);
  const [ucitava, setUcitava] = useState(true);
  const [greska, setGreska] = useState('');

  const ucitaj = async () => {
    try {
      const { data } = await api.get('/porudzbine/moje');
      setPorudzbine(data);
    } catch (err) {
      setGreska('Nije moguce ucitati porudzbine.');
    } finally {
      setUcitava(false);
    }
  };

  useEffect(() => {
    ucitaj();
  }, []);

  const otkazi = async (id) => {
    if (!window.confirm('Da li ste sigurni da zelite da otkazete porudzbinu?'))
      return;

    try {
      await api.delete(`/porudzbine/${id}`);
      setPorudzbine((p) => p.filter((x) => x._id !== id));
    } catch (err) {
      setGreska(err.response?.data?.poruka || 'Otkazivanje nije uspelo.');
    }
  };

  if (ucitava) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Ucitavanje...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Moje porudzbine</h2>

      {greska && <div className="alert alert-danger">{greska}</div>}

      {porudzbine.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">Jos uvek nemate nijednu porudzbinu.</p>
          <Link to="/" className="btn btn-dark">
            Pogledaj katalog
          </Link>
        </div>
      ) : (
        porudzbine.map((p) => (
          <div className="card mb-3 shadow-sm" key={p._id}>
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <strong>Porudzbina</strong>{' '}
                <span className="text-muted small">#{p._id.slice(-6)}</span>
                <span className="text-muted small ms-3">
                  {new Date(p.createdAt).toLocaleString('sr-RS')}
                </span>
              </div>

              <div>
                <span className={`badge bg-${bojaStatusa[p.status]} me-2`}>
                  {p.status}
                </span>
                {p.status === 'na cekanju' && (
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => otkazi(p._id)}
                  >
                    Otkazi
                  </button>
                )}
              </div>
            </div>

            <div className="card-body">
              <table className="table table-sm mb-3">
                <thead>
                  <tr>
                    <th>Proizvod</th>
                    <th>Velicina</th>
                    <th>Kolicina</th>
                    <th>Cena</th>
                  </tr>
                </thead>
                <tbody>
                  {p.stavke.map((s, i) => (
                    <tr key={i}>
                      <td>{s.naziv}</td>
                      <td>{s.velicina}</td>
                      <td>{s.kolicina}</td>
                      <td>{(s.cena * s.kolicina).toLocaleString('sr-RS')} RSD</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="d-flex justify-content-between flex-wrap">
                <small className="text-muted">
                  Dostava: {p.adresaDostave}
                </small>
                <strong>
                  Ukupno: {p.ukupnaCena.toLocaleString('sr-RS')} RSD
                </strong>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MojePorudzbine;
