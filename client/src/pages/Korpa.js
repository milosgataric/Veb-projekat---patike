import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Korpa = () => {
  const { stavke, izmeniKolicinu, izbaci, isprazni, ukupnaCena } = useCart();
  const { korisnik, jePrijavljen } = useAuth();
  const navigate = useNavigate();

  const [adresa, setAdresa] = useState(korisnik?.adresa || '');
  const [greska, setGreska] = useState('');
  const [salje, setSalje] = useState(false);

  const poruci = async () => {
    setGreska('');

    if (!adresa.trim()) {
      setGreska('Unesite adresu dostave.');
      return;
    }

    setSalje(true);
    try {
      await api.post('/porudzbine', {
        stavke: stavke.map((s) => ({
          patika: s.patikaId,
          velicina: s.velicina,
          kolicina: s.kolicina,
        })),
        adresaDostave: adresa,
      });

      isprazni();
      navigate('/porudzbine');
    } catch (err) {
      setGreska(err.response?.data?.poruka || 'Porudzbina nije uspela.');
    } finally {
      setSalje(false);
    }
  };

  if (stavke.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h3>Korpa je prazna</h3>
        <p className="text-muted">Dodajte proizvode iz kataloga.</p>
        <Link to="/" className="btn btn-dark">
          Nazad na katalog
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Korpa</h2>

      <div className="row">
        <div className="col-lg-8">
          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="table-light">
                <tr>
                  <th>Proizvod</th>
                  <th>Velicina</th>
                  <th>Cena</th>
                  <th style={{ width: '120px' }}>Kolicina</th>
                  <th>Ukupno</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {stavke.map((s) => (
                  <tr key={`${s.patikaId}-${s.velicina}`}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={s.slika}
                          alt={s.naziv}
                          width="60"
                          height="60"
                          style={{ objectFit: 'cover' }}
                          className="rounded"
                        />
                        <div>
                          <div className="fw-semibold">{s.naziv}</div>
                          <small className="text-muted">{s.brend}</small>
                        </div>
                      </div>
                    </td>
                    <td>{s.velicina}</td>
                    <td>{s.cena.toLocaleString('sr-RS')} RSD</td>
                    <td>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        min="1"
                        max={s.maxKolicina}
                        value={s.kolicina}
                        onChange={(e) =>
                          izmeniKolicinu(
                            s.patikaId,
                            s.velicina,
                            Number(e.target.value)
                          )
                        }
                      />
                    </td>
                    <td className="fw-semibold">
                      {(s.cena * s.kolicina).toLocaleString('sr-RS')} RSD
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => izbaci(s.patikaId, s.velicina)}
                        title="Ukloni"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button className="btn btn-outline-secondary btn-sm" onClick={isprazni}>
            Isprazni korpu
          </button>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Zavrsetak kupovine</h5>

              <div className="d-flex justify-content-between fs-5 fw-bold my-3">
                <span>Ukupno:</span>
                <span>{ukupnaCena.toLocaleString('sr-RS')} RSD</span>
              </div>

              {greska && <div className="alert alert-danger">{greska}</div>}

              {jePrijavljen ? (
                <>
                  <div className="mb-3">
                    <label className="form-label">Adresa dostave *</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={adresa}
                      onChange={(e) => setAdresa(e.target.value)}
                      placeholder="Ulica i broj, grad, postanski broj"
                    />
                  </div>

                  <button
                    className="btn btn-dark w-100"
                    onClick={poruci}
                    disabled={salje}
                  >
                    {salje ? 'Slanje porudzbine...' : 'Poruci'}
                  </button>
                </>
              ) : (
                <div className="alert alert-warning mb-0">
                  Za kupovinu je potrebno da budete prijavljeni.
                  <Link to="/prijava" className="btn btn-dark w-100 mt-2">
                    Prijavi se
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Korpa;
