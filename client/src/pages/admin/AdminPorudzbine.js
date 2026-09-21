import { useEffect, useState } from 'react';
import api from '../../api/axios';

const STATUSI = ['na cekanju', 'u obradi', 'poslata', 'isporucena', 'otkazana'];

const bojaStatusa = {
  'na cekanju': 'secondary',
  'u obradi': 'info',
  poslata: 'primary',
  isporucena: 'success',
  otkazana: 'danger',
};

const AdminPorudzbine = () => {
  const [porudzbine, setPorudzbine] = useState([]);
  const [filterStatusa, setFilterStatusa] = useState('');
  const [ucitava, setUcitava] = useState(true);
  const [poruka, setPoruka] = useState('');
  const [greska, setGreska] = useState('');

  const ucitaj = async () => {
    try {
      const { data } = await api.get('/porudzbine');
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

  const promeniStatus = async (id, status) => {
    setPoruka('');
    setGreska('');

    try {
      const { data } = await api.put(`/porudzbine/${id}/status`, { status });
      setPorudzbine((p) => p.map((x) => (x._id === id ? { ...x, status: data.status } : x)));
      setPoruka('Status je promenjen.');
    } catch (err) {
      setGreska(err.response?.data?.poruka || 'Izmena nije uspela.');
    }
  };

  const prikazane = filterStatusa
    ? porudzbine.filter((p) => p.status === filterStatusa)
    : porudzbine;

  const ukupnaVrednost = prikazane.reduce((z, p) => z + p.ukupnaCena, 0);

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
      <h2 className="mb-4">Administracija porudzbina</h2>

      {poruka && <div className="alert alert-success">{poruka}</div>}
      {greska && <div className="alert alert-danger">{greska}</div>}

      <div className="row mb-4">
        <div className="col-md-4">
          <label className="form-label">Filtriraj po statusu</label>
          <select
            className="form-select"
            value={filterStatusa}
            onChange={(e) => setFilterStatusa(e.target.value)}
          >
            <option value="">Sve porudzbine</option>
            {STATUSI.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-8 d-flex align-items-end justify-content-md-end">
          <div className="text-md-end">
            <div className="text-muted small">Prikazano porudzbina: {prikazane.length}</div>
            <div className="fw-bold">
              Ukupna vrednost: {ukupnaVrednost.toLocaleString('sr-RS')} RSD
            </div>
          </div>
        </div>
      </div>

      {prikazane.length === 0 ? (
        <div className="alert alert-info">Nema porudzbina za prikaz.</div>
      ) : (
        prikazane.map((p) => (
          <div className="card mb-3 shadow-sm" key={p._id}>
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <strong>#{p._id.slice(-6)}</strong>
                <span className="ms-3">
                  {p.korisnik
                    ? `${p.korisnik.ime} ${p.korisnik.prezime} (${p.korisnik.email})`
                    : 'nepoznat korisnik'}
                </span>
                <span className="text-muted small ms-3">
                  {new Date(p.createdAt).toLocaleString('sr-RS')}
                </span>
              </div>

              <div className="d-flex align-items-center gap-2">
                <span className={`badge bg-${bojaStatusa[p.status]}`}>
                  {p.status}
                </span>
                <select
                  className="form-select form-select-sm"
                  value={p.status}
                  onChange={(e) => promeniStatus(p._id, e.target.value)}
                  style={{ width: '150px' }}
                >
                  {STATUSI.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
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
                <small className="text-muted">Dostava: {p.adresaDostave}</small>
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

export default AdminPorudzbine;
