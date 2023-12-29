import { baseUrl } from "@/App";
import React, { useEffect, useState } from "react";

const ShowBook: React.FC = () => {
   

  const bookId = window.location.href.split("/").at(window.location.href.split("/").length - 1);

  const [bookData, setBookData] = useState<any>(null);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/data/book/${bookId}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setBookData(data);
        } else {
          // Treba prikazati na zaslon da nema nikakvih knjiga!
          console.log(await response.json());
        }
      } catch (error) {
        console.error("Greška prilikom dohvaćanja knjige:", error);
      }
    };

    fetchBookData();
  }, []);

  return (
    <>
      {bookData && (
        <>
          <div className="container">
            <p className="p-1">Title: {bookData.naslov}</p>
            <p className="p-1" data-id={bookData.autorKnjiga.idkorisnik}>Author:
            <a href={"/profile/" + bookData.autorKnjiga.idkorisnik} className="text-primary text-decoration-underline">{bookData.autorKnjiga.ime + " " + bookData.autorKnjiga.prezime}</a></p>
            <p className="p-1">Genre: { bookData.zanr}</p>
            <p className="p-1">Published: {bookData.godizd}</p>
            <p className="p-1">Description: { bookData.opis}</p>
          </div>

          <hr  className="my-4"/>
          <div className="container">
            <h2 className="display-7">Recenzije</h2>
            
            {
              bookData.recenzije.map((recenzija: any, index: any) => (
                // console.log(recenzija, index)
                <div key={index}>
                  <p className="p-4">
                    <a href={"/profile/" + recenzija.idAutorRecenzija}
                      className="text-primary text-decoration-underline">{recenzija.autorRecenzijaIme + " " + recenzija.autorRecenzijaPrezime}</a>
                    : {JSON.stringify(recenzija)}</p>
                </div>
              ))
            }
          </div>
        </>
      )}
    </>
  );
};

export default ShowBook;
