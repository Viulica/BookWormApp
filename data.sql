CREATE TABLE KORISNIK
(
  idKorisnik SERIAL NOT NULL,
  datRod DATE NOT NULL,
  korIme VARCHAR(255) NOT NULL,
  lozinka VARCHAR(255) NOT NULL,
  ime VARCHAR(255),
  prezime VARCHAR(255),
  info TEXT,
  tipKorisnika VARCHAR(10) NOT NULL,
  PRIMARY KEY (idKorisnik)
);

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
  FOREIGN KEY (idKorisnik) REFERENCES KORISNIK(idKorisnik)
);

CREATE TABLE PORUKA
(
  idPoruka SERIAL NOT NULL,
  txtPoruka TEXT NOT NULL,
  vremOzn DATE NOT NULL,
  idKorisnik INT,
  saljeidKorisnik INT,
  PRIMARY KEY (idPoruka),
  FOREIGN KEY (idKorisnik) REFERENCES KORISNIK(idKorisnik),
  FOREIGN KEY (saljeidKorisnik) REFERENCES KORISNIK(idKorisnik)
);

CREATE TABLE cita
(
  status VARCHAR(50) NOT NULL,
  idKnjiga INT NOT NULL,
  idKorisnik INT NOT NULL,
  PRIMARY KEY (idKnjiga, idKorisnik),
  FOREIGN KEY (idKnjiga) REFERENCES KNJIGA(idKnjiga),
  FOREIGN KEY (idKorisnik) REFERENCES KORISNIK(idKorisnik)
);

CREATE TABLE recenzija
(
  idRecenzija SERIAL NOT NULL,
  ocjena INT NOT NULL,
  txtRecenzija TEXT NOT NULL,
  idKnjiga INT NOT NULL,
  idKorisnik INT NOT NULL,
  PRIMARY KEY (idRecenzija),
  FOREIGN KEY (idKnjiga) REFERENCES KNJIGA(idKnjiga),
  FOREIGN KEY (idKorisnik) REFERENCES KORISNIK(idKorisnik),
  UNIQUE (idKnjiga, idKorisnik)
);

CREATE TABLE prati
(
  idKorisnik1 INT NOT NULL,
  idKorisnik2 INT NOT NULL,
  PRIMARY KEY (idKorisnik1, idKorisnik2),
  FOREIGN KEY (idKorisnik1) REFERENCES KORISNIK(idKorisnik),
  FOREIGN KEY (idKorisnik2) REFERENCES KORISNIK(idKorisnik)
);