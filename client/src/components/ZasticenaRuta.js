import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Omotac oko stranica koje nisu dostupne svima.
// samoAdmin = true znaci da stranici moze pristupiti iskljucivo administrator.
const ZasticenaRuta = ({ children, samoAdmin = false }) => {
  const { jePrijavljen, jeAdmin } = useAuth();
  const lokacija = useLocation();

  if (!jePrijavljen) {
    // pamtimo odakle je korisnik dosao da ga posle prijave vratimo nazad
    return <Navigate to="/prijava" state={{ odakle: lokacija.pathname }} replace />;
  }

  if (samoAdmin && !jeAdmin) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <h5 className="alert-heading">Pristup odbijen</h5>
          <p className="mb-0">
            Ova stranica je dostupna samo administratorima.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default ZasticenaRuta;
