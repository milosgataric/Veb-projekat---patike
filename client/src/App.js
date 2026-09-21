import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ZasticenaRuta from './components/ZasticenaRuta';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Pocetna from './pages/Pocetna';
import DetaljiPatike from './pages/DetaljiPatike';
import Prijava from './pages/Prijava';
import Registracija from './pages/Registracija';
import Korpa from './pages/Korpa';
import MojePorudzbine from './pages/MojePorudzbine';
import Profil from './pages/Profil';
import AdminPatike from './pages/admin/AdminPatike';
import AdminKorisnici from './pages/admin/AdminKorisnici';
import AdminPorudzbine from './pages/admin/AdminPorudzbine';

const NijePronadjeno = () => (
  <div className="container py-5 text-center">
    <h1 className="display-4">404</h1>
    <p className="text-muted">Trazena stranica ne postoji.</p>
    <Link to="/" className="btn btn-dark">
      Nazad na pocetnu
    </Link>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />

          <main style={{ minHeight: 'calc(100vh - 160px)' }}>
            <Routes>
              {/* javne rute - dostupne i gostu */}
              <Route path="/" element={<Pocetna />} />
              <Route path="/patika/:id" element={<DetaljiPatike />} />
              <Route path="/korpa" element={<Korpa />} />
              <Route path="/prijava" element={<Prijava />} />
              <Route path="/registracija" element={<Registracija />} />

              {/* rute za prijavljene korisnike */}
              <Route
                path="/porudzbine"
                element={
                  <ZasticenaRuta>
                    <MojePorudzbine />
                  </ZasticenaRuta>
                }
              />
              <Route
                path="/profil"
                element={
                  <ZasticenaRuta>
                    <Profil />
                  </ZasticenaRuta>
                }
              />

              {/* administratorske rute */}
              <Route
                path="/admin/patike"
                element={
                  <ZasticenaRuta samoAdmin>
                    <AdminPatike />
                  </ZasticenaRuta>
                }
              />
              <Route
                path="/admin/korisnici"
                element={
                  <ZasticenaRuta samoAdmin>
                    <AdminKorisnici />
                  </ZasticenaRuta>
                }
              />
              <Route
                path="/admin/porudzbine"
                element={
                  <ZasticenaRuta samoAdmin>
                    <AdminPorudzbine />
                  </ZasticenaRuta>
                }
              />

              <Route path="*" element={<NijePronadjeno />} />
            </Routes>
          </main>

          <footer className="bg-dark text-white-50 py-4 mt-5">
            <div className="container text-center">
              <small>
                PatikeShop &copy; {new Date().getFullYear()} · Projekat iz
                predmeta Veb orijentisane tehnologije i sistemi
              </small>
            </div>
          </footer>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
