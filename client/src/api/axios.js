import axios from 'axios';

// Centralna instanca za komunikaciju sa backendom.
// Svi zahtevi iz aplikacije idu preko nje.
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Interceptor koji uz svaki zahtev automatski salje JWT token,
// ako je korisnik prijavljen. Tako ne moramo rucno da ga dodajemo
// u svakoj komponenti.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor za odgovore - ako token istekne (401),
// izbacujemo korisnika iz aplikacije.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const naZasticenojStrani = !['/prijava', '/registracija'].includes(
        window.location.pathname
      );
      if (localStorage.getItem('token') && naZasticenojStrani) {
        localStorage.removeItem('token');
        localStorage.removeItem('korisnik');
        window.location.href = '/prijava';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
