import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

// Navigacija se menja u zavisnosti od toga ko je prijavljen:
// gost vidi samo katalog i prijavu, korisnik korpu i porudzbine,
// admin dodatno administratorski panel.
const Navbar = () => {
  const { korisnik, jePrijavljen, jeAdmin, odjava } = useAuth();
  const { ukupnoKomada } = useCart();
  const navigate = useNavigate();

  const odjaviSe = () => {
    odjava();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          Patike<span className="text-warning">Shop</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#glavniMeni"
          aria-label="Meni"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="glavniMeni">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Katalog
              </NavLink>
            </li>

            {jeAdmin && (
              <li className="nav-item dropdown">
                <span
                  className="nav-link dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                  style={{ cursor: 'pointer' }}
                >
                  Administracija
                </span>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/admin/patike">
                      Patike
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/admin/korisnici">
                      Korisnici
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/admin/porudzbine">
                      Porudzbine
                    </Link>
                  </li>
                </ul>
              </li>
            )}
          </ul>

          <ul className="navbar-nav align-items-lg-center">
            <li className="nav-item">
              <NavLink className="nav-link position-relative" to="/korpa">
                Korpa
                {ukupnoKomada > 0 && (
                  <span className="badge bg-warning text-dark ms-1">
                    {ukupnoKomada}
                  </span>
                )}
              </NavLink>
            </li>

            {jePrijavljen ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/porudzbine">
                    Moje porudzbine
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/profil">
                    {korisnik.ime}
                  </NavLink>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-light btn-sm ms-lg-2"
                    onClick={odjaviSe}
                  >
                    Odjava
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/prijava">
                    Prijava
                  </NavLink>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-warning btn-sm ms-lg-2" to="/registracija">
                    Registracija
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
