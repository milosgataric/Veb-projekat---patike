import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Profil = () => {
  const { korisnik, azurirajKorisnika } = useAuth();

  const [podaci, setPodaci] = useState({
    ime: '',
    prezime: '',
    email: '',
    adresa: '',
    telefon: '',
    lozinka: '',
  });
  const [poruka, setPoruka] = useState('');
  const [greska, setGreska] = useState('');
  const [salje, setSalje] = useState(false);

  useEffect(() => {
    api
      .get('/auth/profil')
      .then(({ data }) =>
        setPodaci({
          ime: data.ime,
          prezime: data.prezime,
          email: data.email,
          adresa: data.adresa || '',
          telefon: data.telefon || '',
          lozinka: '',
        })
      )
      .catch(() => setGreska('Nije moguce ucitati profil.'));
  }, []);

  const promeni = (e) =>
    setPodaci({ ...podaci, [e.target.name]: e.target.value });

  const sacuvaj = async (e) => {
    e.preventDefault();
    setPoruka('');
    setGreska('');
    setSalje(true);

    try {
      // praznu lozinku ne saljemo - znaci da je korisnik ne menja
      const zaSlanje = { ...podaci };
      if (!zaSlanje.lozinka) delete zaSlanje.lozinka;

      const { data } = await api.put('/auth/profil', zaSlanje);

      azurirajKorisnika({
        _id: data._id,
        ime: data.ime,
        prezime: data.prezime,
        email: data.email,
        uloga: data.uloga,
        adresa: data.adresa,
        telefon: data.telefon,
      });

      setPodaci({ ...podaci, lozinka: '' });
      setPoruka('Podaci su uspesno sacuvani.');
    } catch (err) {
      setGreska(err.response?.data?.poruka || 'Cuvanje nije uspelo.');
    } finally {
      setSalje(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-7">
          <h2 className="mb-4">Moj profil</h2>

          <div className="card shadow-sm">
            <div className="card-body p-4">
              {poruka && <div className="alert alert-success">{poruka}</div>}
              {greska && <div className="alert alert-danger">{greska}</div>}

              <form onSubmit={sacuvaj}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Ime</label>
                    <input
                      type="text"
                      className="form-control"
                      name="ime"
                      value={podaci.ime}
                      onChange={promeni}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Prezime</label>
                    <input
                      type="text"
                      className="form-control"
                      name="prezime"
                      value={podaci.prezime}
                      onChange={promeni}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Email adresa</label>
                  <input
                    type="email"
                    className="form-control"
                    value={podaci.email}
                    disabled
                  />
                  <div className="form-text">Email adresa se ne moze menjati.</div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Adresa</label>
                  <input
                    type="text"
                    className="form-control"
                    name="adresa"
                    value={podaci.adresa}
                    onChange={promeni}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Telefon</label>
                  <input
                    type="text"
                    className="form-control"
                    name="telefon"
                    value={podaci.telefon}
                    onChange={promeni}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Nova lozinka</label>
                  <input
                    type="password"
                    className="form-control"
                    name="lozinka"
                    value={podaci.lozinka}
                    onChange={promeni}
                    placeholder="ostavite prazno ako ne menjate"
                  />
                  <div className="form-text">
                    Najmanje 8 karaktera, veliko i malo slovo, cifra i
                    specijalan znak.
                  </div>
                </div>

                <button type="submit" className="btn btn-dark" disabled={salje}>
                  {salje ? 'Cuvanje...' : 'Sacuvaj izmene'}
                </button>
              </form>

              <hr />
              <small className="text-muted">
                Uloga naloga: <strong>{korisnik?.uloga}</strong>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;
