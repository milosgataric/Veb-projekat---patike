import { createContext, useContext, useEffect, useState } from 'react';

// Korpa se cuva u localStorage kako bi prezivela osvezavanje stranice.
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [stavke, setStavke] = useState(() => {
    const sacuvano = localStorage.getItem('korpa');
    return sacuvano ? JSON.parse(sacuvano) : [];
  });

  useEffect(() => {
    localStorage.setItem('korpa', JSON.stringify(stavke));
  }, [stavke]);

  // Jedna stavka je jedinstvena po kombinaciji patike I velicine -
  // iste patike u dve velicine su dve odvojene stavke.
  const dodaj = (patika, velicina, kolicina = 1) => {
    setStavke((prethodne) => {
      const postoji = prethodne.find(
        (s) => s.patikaId === patika._id && s.velicina === velicina
      );

      if (postoji) {
        return prethodne.map((s) =>
          s.patikaId === patika._id && s.velicina === velicina
            ? { ...s, kolicina: s.kolicina + kolicina }
            : s
        );
      }

      return [
        ...prethodne,
        {
          patikaId: patika._id,
          naziv: patika.naziv,
          brend: patika.brend,
          cena: patika.cena,
          slika: patika.slika,
          maxKolicina: patika.kolicinaNaStanju,
          velicina,
          kolicina,
        },
      ];
    });
  };

  const izmeniKolicinu = (patikaId, velicina, novaKolicina) => {
    if (novaKolicina < 1) return;
    setStavke((prethodne) =>
      prethodne.map((s) =>
        s.patikaId === patikaId && s.velicina === velicina
          ? { ...s, kolicina: novaKolicina }
          : s
      )
    );
  };

  const izbaci = (patikaId, velicina) => {
    setStavke((prethodne) =>
      prethodne.filter(
        (s) => !(s.patikaId === patikaId && s.velicina === velicina)
      )
    );
  };

  const isprazni = () => setStavke([]);

  const ukupnaCena = stavke.reduce((zbir, s) => zbir + s.cena * s.kolicina, 0);
  const ukupnoKomada = stavke.reduce((zbir, s) => zbir + s.kolicina, 0);

  return (
    <CartContext.Provider
      value={{
        stavke,
        dodaj,
        izmeniKolicinu,
        izbaci,
        isprazni,
        ukupnaCena,
        ukupnoKomada,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
