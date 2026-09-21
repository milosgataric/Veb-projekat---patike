import { Link } from 'react-router-dom';

const PatikaKartica = ({ patika, kurs }) => {
  const naStanju = patika.kolicinaNaStanju > 0;

  // ako je kursna lista ucitana, prikazujemo i cenu u evrima
  const cenaUEvrima =
    kurs && kurs.kursevi && kurs.kursevi.EUR
      ? (patika.cena * kurs.kursevi.EUR).toFixed(2)
      : null;

  return (
    <div className="card h-100 shadow-sm">
      <div style={{ height: '220px', overflow: 'hidden' }}>
        <img
          src={patika.slika}
          className="card-img-top h-100 w-100"
          alt={patika.naziv}
          style={{ objectFit: 'cover' }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=Patika';
          }}
        />
      </div>

      <div className="card-body d-flex flex-column">
        <span className="badge bg-secondary align-self-start mb-2">
          {patika.brend}
        </span>

        <h5 className="card-title">{patika.naziv}</h5>

        <p className="card-text text-muted small flex-grow-1">
          {patika.opis.length > 80
            ? patika.opis.slice(0, 80) + '...'
            : patika.opis}
        </p>

        <div className="mb-2">
          <span className="fs-5 fw-bold">
            {patika.cena.toLocaleString('sr-RS')} RSD
          </span>
          {cenaUEvrima && (
            <span className="text-muted small ms-2">~ {cenaUEvrima} EUR</span>
          )}
        </div>

        {naStanju ? (
          <span className="badge bg-success align-self-start mb-3">
            Na stanju: {patika.kolicinaNaStanju}
          </span>
        ) : (
          <span className="badge bg-danger align-self-start mb-3">
            Trenutno rasprodato
          </span>
        )}

        <Link to={`/patika/${patika._id}`} className="btn btn-dark w-100 mt-auto">
          Detaljnije
        </Link>
      </div>
    </div>
  );
};

export default PatikaKartica;
