-- KORISNIK tablica
CREATE TABLE KORISNIK
(
  idKorisnik SERIAL NOT NULL,
  datRod DATE,
  korIme VARCHAR(255) NOT NULL,
  lozinka VARCHAR(255) NOT NULL,
  ime VARCHAR(255),
  prezime VARCHAR(255),
  info TEXT,
  tipKorisnika VARCHAR(10) NOT NULL,
  PRIMARY KEY (idKorisnik)
);

-- KNJIGA tablica
CREATE TABLE KNJIGA
(
  idKnjiga SERIAL NOT NULL,
  naslov VARCHAR(255) NOT NULL,
  žanr VARCHAR(50) NOT NULL,
  godIzd INT NOT NULL,
  opis TEXT NOT NULL,
  ISBN VARCHAR(13) NOT NULL,
  idKorisnik INT NOT NULL,
  PRIMARY KEY (idKnjiga),
  FOREIGN KEY (idKorisnik) REFERENCES KORISNIK(idKorisnik) ON DELETE CASCADE
);

-- PORUKA tablica
CREATE TABLE PORUKA
(
  idPoruka SERIAL NOT NULL,
  txtPoruka TEXT NOT NULL,
  vremOzn DATE NOT NULL,
  idPosiljatelj INT,
  idPrimatelj INT,
  PRIMARY KEY (idPoruka),
  FOREIGN KEY (idPosiljatelj) REFERENCES KORISNIK(idKorisnik) ON DELETE CASCADE,
  FOREIGN KEY (idPrimatelj) REFERENCES KORISNIK(idKorisnik) ON DELETE CASCADE
);

-- CITA tablica
CREATE TABLE CITA
(
  idKorisnik INT NOT NULL,
  status VARCHAR(50) NOT NULL,
  idKnjiga INT NOT NULL,
  PRIMARY KEY (idKnjiga, idKorisnik),
  FOREIGN KEY (idKnjiga) REFERENCES KNJIGA(idKnjiga) ON DELETE CASCADE,
  FOREIGN KEY (idKorisnik) REFERENCES KORISNIK(idKorisnik) ON DELETE CASCADE
);

-- RECENZIJA tablica
CREATE TABLE RECENZIJA
(
  idRecenzija SERIAL NOT NULL,
  idKorisnik INT NOT NULL,
  ocjena INT NOT NULL,
  txtRecenzija TEXT,
  idKnjiga INT NOT NULL,
  PRIMARY KEY (idRecenzija),
  FOREIGN KEY (idKnjiga) REFERENCES KNJIGA(idKnjiga) ON DELETE CASCADE,
  FOREIGN KEY (idKorisnik) REFERENCES KORISNIK(idKorisnik) ON DELETE CASCADE,
  UNIQUE (idKnjiga, idKorisnik)
);

-- PRATI tablica
-- Korisnik1 prati Korisnik2
CREATE TABLE PRATI
(
  idKorisnik1 INT NOT NULL,
  idKorisnik2 INT NOT NULL,
  PRIMARY KEY (idKorisnik1, idKorisnik2),
  FOREIGN KEY (idKorisnik1) REFERENCES KORISNIK(idKorisnik) ON DELETE CASCADE,
  FOREIGN KEY (idKorisnik2) REFERENCES KORISNIK(idKorisnik) ON DELETE CASCADE,
  CHECK (idKorisnik1 != idKorisnik2)
);
