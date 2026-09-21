import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const AdminKorisnici = () => {
  const { korisnik: ulogovani } = useAuth();

  const [korisnici, setKorisnici] = useState([]);
  const [ucitava, setUcitava] = useState(true);
  const [poruka, setPoruka] = useState('');
  const [greska, setGreska] = useState('');

  const ucitaj = async () => {
    try {
      const { data } = await api.get('/korisnici');
      setKorisnici(data);
    } catch (err) {
      setGreska('Nije moguce ucitati korisnike.');
    } finally {
      setUcitava(false);
    }
  };

  useEffect(() => {
    ucitaj();
  }, []);

  const promeniUlogu = async (id, novaUloga) => {
    setPoruka('');
    setGreska('');

    try {
      const { data } = await api.put(`/korisnici/${id}`, { uloga: novaUloga });
      setKorisnici((k) => k.map((x) => (x._id === id ? data : x)));
      setPoruka('Uloga je promenjena.');
    } catch (err) {
      setGreska(err.response?.data?.poruka || 'Izmena nije uspela.');
    }
  };

  const obrisi = async (id, email) => {
    if (!window.confirm(`Obrisati korisnika ${email}?`)) return;

    setPoruka('');
    setGreska('');

    try {
      await api.delete(`/korisnici/${id}`);
      setKorisnici((k) => k.filter((x) => x._id !== id));
      setPoruka('Korisnik je obrisan.');
    } catch (err) {
      setGreska(err.response?.data?.poruka || 'Brisanje nije uspelo.');
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
      <h2 className="mb-4">Administracija korisnika</h2>

      {poruka && <div className="alert alert-success">{poruka}</div>}
      {greska && <div className="alert alert-danger">{greska}</div>}

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Ime i prezime</th>
              <th>Email</th>
              <th>Telefon</th>
              <th>Uloga</th>
              <th>Registrovan</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {korisnici.map((k) => {
              const jeJa = k._id === ulogovani?._id;

              return (
                <tr key={k._id}>
                  <td>
                    {k.ime} {k.prezime}
                    {jeJa && (
                      <span className="badge bg-warning text-dark ms-2">vi</span>
                    )}
                  </td>
                  <td>{k.email}</td>
                  <td>{k.telefon || '-'}</td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={k.uloga}
                      onChange={(e) => promeniUlogu(k._id, e.target.value)}
                      disabled={jeJa}
                      style={{ width: '120px' }}
                    >
                      <option value="korisnik">korisnik</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td>{new Date(k.createdAt).toLocaleDateString('sr-RS')}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => obrisi(k._id, k.email)}
                      disabled={jeJa}
                    >
                      Obrisi
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <small className="text-muted">
        Sopstveni nalog nije moguce obrisati niti mu promeniti ulogu.
      </small>
    </div>
  );
};

export default AdminKorisnici;
