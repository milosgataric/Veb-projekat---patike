import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Prijava = () => {
  const { prijava } = useAuth();
  const navigate = useNavigate();
  const lokacija = useLocation();

  const [email, setEmail] = useState('');
  const [lozinka, setLozinka] = useState('');
  const [greska, setGreska] = useState('');
  const [salje, setSalje] = useState(false);

  const posalji = async (e) => {
    e.preventDefault();
    setGreska('');
    setSalje(true);

    try {
      const korisnik = await prijava(email, lozinka);
      // admin ide pravo na svoj panel, obican korisnik tamo odakle je dosao
      const odrediste =
        korisnik.uloga === 'admin'
          ? '/admin/patike'
          : lokacija.state?.odakle || '/';
      navigate(odrediste, { replace: true });
    } catch (err) {
      setGreska(err.response?.data?.poruka || 'Prijava nije uspela.');
    } finally {
      setSalje(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h3 className="card-title mb-4">Prijava</h3>

              {greska && <div className="alert alert-danger">{greska}</div>}

              <form onSubmit={posalji}>
                <div className="mb-3">
                  <label className="form-label">Email adresa</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Lozinka</label>
                  <input
                    type="password"
                    className="form-control"
                    value={lozinka}
                    onChange={(e) => setLozinka(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-dark w-100"
                  disabled={salje}
                >
                  {salje ? 'Prijavljivanje...' : 'Prijavi se'}
                </button>
              </form>

              <p className="text-center mt-3 mb-0">
                Nemate nalog? <Link to="/registracija">Registrujte se</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prijava;
