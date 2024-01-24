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
 
insert into korisnik(ime, prezime, datrod, tipkorisnika, korime, lozinka) values 
 ('George', 'Orwell', '1984-6-25', 'autor', 'gorwell', '$2a$10$0fUw5wFVAoRA.8GjDaGXpu5f8B4WNFRJ.epGq85gAuThKf.famNV6'),
('Harper', 'Lee', '1926-4-26', 'autor', 'lharper', '$2a$10$0fUw5wFVAoRA.8GjDaGXpu5f8B4WNFRJ.epGq85gAuThKf.famNV6'),
('Jane', 'Austen', '1775-12-16', 'autor', 'jausten', '$2a$10$0fUw5wFVAoRA.8GjDaGXpu5f8B4WNFRJ.epGq85gAuThKf.famNV6'),
('Scott', 'Fitzgerald', '1896-9-24', 'autor', 'sfitz', '$2a$10$0fUw5wFVAoRA.8GjDaGXpu5f8B4WNFRJ.epGq85gAuThKf.famNV6'),
('Lav', 'Tolstoj', '1828-9-9', 'autor', 'ltolstoj', '$2a$10$0fUw5wFVAoRA.8GjDaGXpu5f8B4WNFRJ.epGq85gAuThKf.famNV6'),
('Alexandre', 'Dumas', '1802-6-24', 'autor', 'adumas', '$2a$10$0fUw5wFVAoRA.8GjDaGXpu5f8B4WNFRJ.epGq85gAuThKf.famNV6'),
('Gustave', 'Flaubert', '1821-12-12', 'autor', 'gflaubert', '$2a$10$0fUw5wFVAoRA.8GjDaGXpu5f8B4WNFRJ.epGq85gAuThKf.famNV6'),
('J.D', 'Salinger', '1919-1-1', 'autor', 'jdsalinger', '$2a$10$0fUw5wFVAoRA.8GjDaGXpu5f8B4WNFRJ.epGq85gAuThKf.famNV6');

insert into knjiga(naslov, zanr, godIzd, opis, isbn, idkorisnik, slika) values
('1984', 'distopija', 1949, 'A dystopian novel that presents a chilling portrayal of a totalitarian regime that exercises extreme control over all aspects of life. The story follows Winston Smith, who begins to question the oppressive system led by the Party and its leader, Big Brother.', '9780451524935', 10, 'https://znanje.hr/product-images/6882dddc-6a4f-436d-8059-5dee2951de26.jpg'),

('Ubiti sojku rugalicu', 'bildungsroman', 1960, 'This novel is set in the Deep South and deals with serious issues like racial injustice and moral growth. It narrates the story of a young girl, Scout Finch, her brother, Jem, and their father, Atticus Finch, an attorney who defends a black man accused of raping a white woman.', '9780060935467', 11, 'https://epqkkxb65h3.exactdn.com/wp-content/uploads/2023/02/m-2908.jpg strip=all&lossy=1&ssl=1'),

('Ponos i predrasude', 'romansa, fikcija', 1813, 'A classic novel in English literature, focusing on the emotional development of the protagonist, Elizabeth Bennet, who learns about the repercussions of hasty judgments and comes to appreciate the difference between superficial goodness and actual goodness.', '1234987654561', 12, 'https://images.penguinrandomhouse.com/cover/9780593622452'),

('Veliki Gatsby', 'tragedija', 1925, 'This novel is set in the Jazz Age on Long Island and provides a critical social history of America in the 1920s. The story is centered around the young and mysterious millionaire Jay Gatsby and his quixotic passion for the beautiful Daisy Buchanan.', '9780743273565', 13, 'https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781982146702/the-great-gatsby-9781982146702_hr.jpg'),

('Rat i mir', 'epski roman', 1865, 'The book, which is in Russian with significant portions in French, chronicles the Napoleonic era within Russia, particularly detailing the French invasion of Russia and its aftermath, through the interconnected lives of five aristocratic families.', '9781400033416', 14, 'https://www.zuzi.hr/media/img/products/5200/lav-nikolajevic-tolstoj-rat-i-mir-dio-prvi-S7QA.webp'),
('Grof Monte Cristo', 'roman', 1844, 'This novel tells the story of Edmond Dantès, a young sailor who is falsely accused of treason and imprisoned. After escaping, he discovers a treasure and reinvents himself as the Count of Monte Cristo to seek revenge against those who wronged him.', '9780140449266', 15, 'https://shop.skolskaknjiga.hr/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/1/7/178990.jpg'),
('Madam Bovary', 'roman', 1857, 'The novel follows Emma Bovary, who lives beyond her means in an attempt to escape the banalities and emptiness of provincial life', '9781501117015', 16, 'https://cdn.kobo.com/book-images/3a9fa608-7950-439d-acf0-27751b69e26e/1200/1200/False/madam-bovary-1.jpg'),
('Lovac u zitu', 'roman', 1957, 'The story is narrated by Holden Caulfield, a teenager who has been expelled from his prep school. Over a weekend before Christmas, he wanders New York City, grappling with themes of angst, alienation, and a critique of superficiality in society. The novel is notable for its portrayal of teenage rebellion and is often read for its exploration of these themes.', '9780060935467', 17, 'https://www.knjigolov.hr/slike/202004081011140.LovacUZitu.jpg');



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
