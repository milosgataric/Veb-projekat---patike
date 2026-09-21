import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

// Context cuva podatke o prijavljenom korisniku i deli ih celoj aplikaciji,
// tako da svaka komponenta zna ko je ulogovan i koja mu je uloga.
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // pri pokretanju citamo korisnika iz localStorage da prijava
  // ne bi nestala posle osvezavanja stranice
  const [korisnik, setKorisnik] = useState(() => {
    const sacuvan = localStorage.getItem('korisnik');
    return sacuvan ? JSON.parse(sacuvan) : null;
  });

  const sacuvajSesiju = (podaci) => {
    const { token, ...ostalo } = podaci;
    localStorage.setItem('token', token);
    localStorage.setItem('korisnik', JSON.stringify(ostalo));
    setKorisnik(ostalo);
  };

  const prijava = async (email, lozinka) => {
    const { data } = await api.post('/auth/login', { email, lozinka });
    sacuvajSesiju(data);
    return data;
  };

  const registracija = async (podaci) => {
    const { data } = await api.post('/auth/register', podaci);
    sacuvajSesiju(data);
    return data;
  };

  const odjava = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('korisnik');
    setKorisnik(null);
  };

  // koristi se kada korisnik izmeni svoj profil
  const azurirajKorisnika = (noviPodaci) => {
    localStorage.setItem('korisnik', JSON.stringify(noviPodaci));
    setKorisnik(noviPodaci);
  };

  const vrednost = {
    korisnik,
    jePrijavljen: !!korisnik,
    jeAdmin: korisnik?.uloga === 'admin',
    prijava,
    registracija,
    odjava,
    azurirajKorisnika,
  };

  return <AuthContext.Provider value={vrednost}>{children}</AuthContext.Provider>;
};

// pomocna funkcija da komponente ne moraju svaki put da uvoze Context
export const useAuth = () => useContext(AuthContext);
