import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

const DetaljiPatike = () => {
  const { id } = useParams();
  const { dodaj } = useCart();

  const [patika, setPatika] = useState(null);
  const [ucitava, setUcitava] = useState(true);
  const [greska, setGreska] = useState('');
  const [velicina, setVelicina] = useState('');
  const [kolicina, setKolicina] = useState(1);
  const [poruka, setPoruka] = useState('');

  useEffect(() => {
    const ucitaj = async () => {
      try {
        const { data } = await api.get(`/patike/${id}`);
        setPatika(data);
        if (data.velicine.length > 0) setVelicina(data.velicine[0]);
      } catch (err) {
        setGreska('Patika nije pronadjena.');
      } finally {
        setUcitava(false);
      }
    };
    ucitaj();
  }, [id]);

  const dodajUKorpu = () => {
    if (!velicina) {
      setPoruka('Izaberite velicinu.');
      return;
    }
    dodaj(patika, Number(velicina), Number(kolicina));
    setPoruka('Proizvod je dodat u korpu.');
    setTimeout(() => setPoruka(''), 3000);
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

  if (greska) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{greska}</div>
        <Link to="/" className="btn btn-dark">
          Nazad na katalog
        </Link>
      </div>
    );
  }

  const naStanju = patika.kolicinaNaStanju > 0;

  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Katalog</Link>
          </li>
          <li className="breadcrumb-item active">{patika.naziv}</li>
        </ol>
      </nav>

      <div className="row g-4">
        <div className="col-md-6">
          <img
            src={patika.slika}
            alt={patika.naziv}
            className="img-fluid rounded shadow-sm w-100"
            style={{ maxHeight: '450px', objectFit: 'cover' }}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/600x450?text=Patika';
            }}
          />
        </div>

        <div className="col-md-6">
          <span className="badge bg-secondary mb-2">{patika.brend}</span>
          <h2>{patika.naziv}</h2>

          <p className="fs-3 fw-bold text-dark">
            {patika.cena.toLocaleString('sr-RS')} RSD
          </p>

          <p>{patika.opis}</p>

          <table className="table table-sm">
            <tbody>
              <tr>
                <th style={{ width: '40%' }}>Brend</th>
                <td>{patika.brend}</td>
              </tr>
              <tr>
                <th>Kategorija</th>
                <td>{patika.kategorija}</td>
              </tr>
              <tr>
                <th>Boja</th>
                <td>{patika.boja || 'nije navedena'}</td>
              </tr>
              <tr>
                <th>Dostupnost</th>
                <td>
                  {naStanju ? (
                    <span className="text-success">
                      Na stanju ({patika.kolicinaNaStanju} kom.)
                    </span>
                  ) : (
                    <span className="text-danger">Rasprodato</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          {naStanju && (
            <div className="row g-2 align-items-end mb-3">
              <div className="col-6">
                <label className="form-label">Velicina</label>
                <select
                  className="form-select"
                  value={velicina}
                  onChange={(e) => setVelicina(e.target.value)}
                >
                  {patika.velicine.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-6">
                <label className="form-label">Kolicina</label>
                <input
                  type="number"
                  className="form-control"
                  min="1"
                  max={patika.kolicinaNaStanju}
                  value={kolicina}
                  onChange={(e) => setKolicina(e.target.value)}
                />
              </div>
            </div>
          )}

          <button
            className="btn btn-dark btn-lg w-100"
            onClick={dodajUKorpu}
            disabled={!naStanju}
          >
            {naStanju ? 'Dodaj u korpu' : 'Trenutno nedostupno'}
          </button>

          {poruka && (
            <div className="alert alert-success mt-3 mb-0">
              {poruka} <Link to="/korpa">Pogledaj korpu</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetaljiPatike;
