select setval('knjiga_idknjiga_seq', 1, false);
delete from knjiga;

select setval('korisnik_idkorisnik_seq', 1, false);
delete from korisnik;

select setval('poruka_idporuka_seq', 1, false);
delete from poruka;

select setval('recenzija_idrecenzija_seq', 1, false);
delete from recenzija;

insert into korisnik(datrod, korime, lozinka, ime, prezime, info, tipkorisnika) values
('1985-05-15', 'user1', '$2a$10$0fUw5wFVAoRA.8GjDaGXpu5f8B4WNFRJ.epGq85gAuThKf.famNV6', 'Ana', 'Horvat', NULL, 'čitatelj'),
('1999-01-01', 'user2', '$2a$10$0fUw5wFVAoRA.8GjDaGXpu5f8B4WNFRJ.epGq85gAuThKf.famNV6', 'Marko', 'Kovač', NULL, 'čitatelj'),
('1998-08-10', 'user3', '$2a$10$0fUw5wFVAoRA.8GjDaGXpu5f8B4WNFRJ.epGq85gAuThKf.famNV6', 'Petra', 'Novak', NULL, 'čitatelj'),
('1995-05-05', 'user4', '$2a$10$0fUw5wFVAoRA.8GjDaGXpu5f8B4WNFRJ.epGq85gAuThKf.famNV6', 'Ivan', 'Tomić', 'Zovem se Ivan Tomić, 
 do sada sam napisao 20 knjiga, a najviše volim klasike.', 'autor'),
 ('2000-01-04', 'user5', '$2a$10$0fUw5wFVAoRA.8GjDaGXpu5f8B4WNFRJ.epGq85gAuThKf.famNV6', 'Luka', 'Jurić', NULL, 'čitatelj'),
 ('2002-05-03', 'user6', '$2a$10$0fUw5wFVAoRA.8GjDaGXpu5f8B4WNFRJ.epGq85gAuThKf.famNV6', 'Marta', 'Šimić', NULL, 'čitatelj'),
 (NULL, 'admin', '$2a$10$0fUw5wFVAoRA.8GjDaGXpu5f8B4WNFRJ.epGq85gAuThKf.famNV6', NULL, NULL, NULL, 'admin'),
 ('2002-04-04', 'user7', '$2a$10$0fUw5wFVAoRA.8GjDaGXpu5f8B4WNFRJ.epGq85gAuThKf.famNV6', 'Ivana', 'Radić', 'Ja sam Ivana Radić
 i volim čitati i pisati knjige.', 'autor'),
('1980-06-26', 'user8', '$2a$10$0fUw5wFVAoRA.8GjDaGXpu5f8B4WNFRJ.epGq85gAuThKf.famNV6', 'Ana', 'Anić', 'Zovem se Ana Anić i najviše volim 
 poeziju.', 'autor');

insert into knjiga(naslov, zanr, godIzd, opis, isbn, idkorisnik, idautor) values
('1984', 'distopija', 1949, 'A dystopian novel that presents a chilling portrayal of a totalitarian regime that exercises extreme control over all aspects of life. The story follows Winston Smith, who begins to question the oppressive system led by the Party and its leader, Big Brother.', '9780451524935', 4),

('Ubiti sojku rugalicu', 'bildungsroman', 1960, 'This novel is set in the Deep South and deals with serious issues like racial injustice and moral growth. It narrates the story of a young girl, Scout Finch, her brother, Jem, and their father, Atticus Finch, an attorney who defends a black man accused of raping a white woman.', '9780060935467', 8),

('Ponos i predrasude', 'romansa, fikcija', 1813, 'A classic novel in English literature, focusing on the emotional development of the protagonist, Elizabeth Bennet, who learns about the repercussions of hasty judgments and comes to appreciate the difference between superficial goodness and actual goodness.', '1234987654561', 4),

('Veliki Gatsby', 'tragedija', 1925, 'This novel is set in the Jazz Age on Long Island and provides a critical social history of America in the 1920s. The story is centered around the young and mysterious millionaire Jay Gatsby and his quixotic passion for the beautiful Daisy Buchanan.', '9780743273565', 9);

insert into autor(imeautor, prezimeautor, datrod) values 
("George", "Orwell", "1984-6-25"),
("Harper", "Lee", "1926-4-26"),
("Jane", "Austen", "1775-12-16")
("Scott", "Fitzgerald", "1896-9-24")


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
