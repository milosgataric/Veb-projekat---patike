import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Ista pravila kao na serveru - proveravamo i na klijentu
// da korisnik odmah dobije povratnu informaciju.
const pravilaLozinke = [
  { tekst: 'najmanje 8 karaktera', provera: (l) => l.length >= 8 },
  { tekst: 'bar jedno veliko slovo', provera: (l) => /[A-Z]/.test(l) },
  { tekst: 'bar jedno malo slovo', provera: (l) => /[a-z]/.test(l) },
  { tekst: 'bar jedna cifra', provera: (l) => /\d/.test(l) },
  {
    tekst: 'bar jedan specijalan znak',
    provera: (l) => /[!@#$%^&*(),.?":{}|<>_\-+=]/.test(l),
  },
];

const Registracija = () => {
  const { registracija } = useAuth();
  const navigate = useNavigate();

  const [podaci, setPodaci] = useState({
    ime: '',
    prezime: '',
    email: '',
    lozinka: '',
    potvrdaLozinke: '',
    adresa: '',
    telefon: '',
  });
  const [greska, setGreska] = useState('');
  const [salje, setSalje] = useState(false);

  const promeni = (e) =>
    setPodaci({ ...podaci, [e.target.name]: e.target.value });

  const sveZadovoljeno = pravilaLozinke.every((p) => p.provera(podaci.lozinka));

  const posalji = async (e) => {
    e.preventDefault();
    setGreska('');

    if (podaci.lozinka !== podaci.potvrdaLozinke) {
      setGreska('Lozinke se ne poklapaju.');
      return;
    }
    if (!sveZadovoljeno) {
      setGreska('Lozinka ne zadovoljava sve uslove.');
      return;
    }

    setSalje(true);
    try {
      const { potvrdaLozinke, ...zaSlanje } = podaci;
      await registracija(zaSlanje);
      navigate('/');
    } catch (err) {
      setGreska(err.response?.data?.poruka || 'Registracija nije uspela.');
    } finally {
      setSalje(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h3 className="card-title mb-4">Registracija</h3>

              {greska && <div className="alert alert-danger">{greska}</div>}

              <form onSubmit={posalji}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Ime *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="ime"
                      value={podaci.ime}
                      onChange={promeni}
                      required
                      minLength="2"
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Prezime *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="prezime"
                      value={podaci.prezime}
                      onChange={promeni}
                      required
                      minLength="2"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Email adresa *</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={podaci.email}
                    onChange={promeni}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Lozinka *</label>
                    <input
                      type="password"
                      className="form-control"
                      name="lozinka"
                      value={podaci.lozinka}
                      onChange={promeni}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Potvrda lozinke *</label>
                    <input
                      type="password"
                      className="form-control"
                      name="potvrdaLozinke"
                      value={podaci.potvrdaLozinke}
                      onChange={promeni}
                      required
                    />
                  </div>
                </div>

                {podaci.lozinka && (
                  <ul className="list-unstyled small mb-3">
                    {pravilaLozinke.map((p) => (
                      <li
                        key={p.tekst}
                        className={
                          p.provera(podaci.lozinka)
                            ? 'text-success'
                            : 'text-danger'
                        }
                      >
                        {p.provera(podaci.lozinka) ? '✓' : '✗'} {p.tekst}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="row">
                  <div className="col-md-8 mb-3">
                    <label className="form-label">Adresa</label>
                    <input
                      type="text"
                      className="form-control"
                      name="adresa"
                      value={podaci.adresa}
                      onChange={promeni}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Telefon</label>
                    <input
                      type="text"
                      className="form-control"
                      name="telefon"
                      value={podaci.telefon}
                      onChange={promeni}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-dark w-100"
                  disabled={salje}
                >
                  {salje ? 'Slanje...' : 'Registruj se'}
                </button>
              </form>

              <p className="text-center mt-3 mb-0">
                Vec imate nalog? <Link to="/prijava">Prijavite se</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registracija;
