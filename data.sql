
select setval('knjiga_idknjiga_seq', 1, false);
delete from knjiga;

select setval('korisnik_idkorisnik_seq', 1, false);
delete from korisnik;

select setval('poruka_idporuka_seq', 1, false);
delete from poruka;

select setval('recenzija_idrecenzija_seq', 1, false);
delete from recenzija;

insert into korisnik(datrod, korime, lozinka, ime, prezime, info, tipkorisnika) values
('1985-05-15', 'user1', 'pass', 'Ana', 'Horvat', NULL, 'čitatelj'),
('1999-01-01', 'user2', 'pass', 'Marko', 'Kovač', NULL, 'čitatelj'),
('1998-08-10', 'user3', 'pass', 'Petra', 'Novak', NULL, 'čitatelj'),
('1995-05-05', 'user4', 'pass', 'Ivan', 'Tomić', 'Zovem se Ivan Tomić, 
 do sada sam napisao 20 knjiga, a najviše volim klasike.', 'autor'),
 ('2000-01-04', 'user5', 'pass', 'Luka', 'Jurić', NULL, 'čitatelj'),
 ('2002-05-03', 'user6', 'pass', 'Marta', 'Šimić', NULL, 'čitatelj'),
 (NULL, 'admin', 'pass', NULL, NULL, NULL, 'admin'),
 ('2002-04-04', 'user7', 'pass', 'Ivana', 'Radić', 'Ja sam Ivana Radić
 i volim čitati i pisati knjige.', 'autor'),
('1980-06-26', 'user8', 'pass', 'Ana', 'Anić', 'Zovem se Ana Anić i najviše volim 
 poeziju.', 'autor');

insert into knjiga(naslov, zanr, godIzd, opis, isbn, idkorisnik) values
('Miris Lavande', 'Romantična drama', 2020, 'Uzbudljiva ljubavna priča smještena 
na slikovitu farmu lavande u Provansi, gdje neočekivana romansa cvjeta između 
mlade umjetnice i misterioznog farmera.', '1234567890123', 4),

('Sjena nebeskih anđela', 'Fantazija', 2019, 'Fantastična saga koja prati mladog 
junaka kroz magični svijet gdje se bori protiv zlih sila, otkriva svoje vlastite moći i 
susreće nevjerojatna stvorenja.', '9876543210987', 8),

('Izgubljeno vrijeme', 'Znanstvena fikcija', 2018, 'Znanstvena fikcija koja istražuje 
koncept vremenskih petlji, gdje glavni lik pokušava promijeniti prošlost kako bi spasio 
voljenu osobu, suočavajući se s neočekivanim posljedicama.', '1234987654561', 4),

('Šapat noći', 'poezija', 2022, 'Poezija "Šapat Noći" otkriva ljepotu i čaroliju noći. 
 Sjene, mjesečina i zvijezde postaju tihi plesači u tajanstvenom spektaklu pri zalasku sunca. 
 Sanjarimo o svjetlima neba, a srce odjekuje u melodiji noći. Noćne rijeke snova teku niz 
 kamenje sna, ostavljajući iza sebe tragove nezaboravnih putovanja u svijetu mašte. Ljubav, 
 poput nevidljive niti, plete se kroz prostor i vrijeme, spajajući nas s nebeskim pričama. 
 U tišini cvjetova, povjetarac donosi šapat noći, a sjećanja mirišu na prolaznost trenutka u 
 toj večernjoj idili.', '9781234567890', 9);


insert into poruka(txtPoruka, vremOzn, idPosiljatelj, idPrimatelj) values
('Pozdrav, Ana! Kako si?', '2023-12-13', 5, 1),
('Poštovana, Ivana! Sviđaju mi se Vaše knjige.', '2022-09-10', 1, 8),
('Pozdrav, Luka! Dobro sam, a ti?', '2023-12-14', 1, 5);


insert into cita(idkorisnik, status, idknjiga) values
(1, 'Želim pročitati', 2),
(4, 'Trenutno čitam', 1);


insert into recenzija(idkorisnik, ocjena, txtRecenzija, idknjiga) values
(1, 5, NULL, 2),
(4, 5, 'Knjiga je odlična, preporučam!', 1),
(3, 2, 'Kakvo je ovo smeće?', 4);

insert into prati(idkorisnik1, idkorisnik2) values
(1, 8),
(1, 5),
(5, 1);

/*
-- Ako neki korisnik želi dodati još tekst uz ocjenu koju je već prethodno postavio.
update recenzija
set txtRecenzija = 'Volio bih pročitati ovu knjigu, autor ima dobru reputaciju.'
where idkorisnik = 1 and idknjiga = 2;
*/

-- delete from korisnik where idkorisnik = 9;

select * from korisnik;
select * from knjiga;
select * from poruka;
select * from cita;
select * from recenzija;
select * from prati;

/*
select ime || ' ' || prezime as ime_i_prezime, naslov, opis
from korisnik join knjiga using(idkorisnik)
*/


/*
select txtporuka, idposiljatelj, idprimatelj, ime || ' ' || prezime as poslao
	from poruka join korisnik on idposiljatelj = idkorisnik;
*/
