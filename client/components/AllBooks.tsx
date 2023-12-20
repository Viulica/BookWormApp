import { baseUrl } from "@/App";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


interface Book {
   idknjiga: number;
   naslov: string;
   zanr: string;
   godizd: number;
   opis: string;
   isbn: string;
   idkorisnik: number,
   ime: string,
   prezime: string,
   datrod: number,
   info: string
 }
 

const AllBooks: React.FC = () => {
   const navigate = useNavigate();

   const [allBooks, setAllBooks] = useState<Book[]>([]);


   const handleReturnBack = () => {
      navigate('/home');
      window.location.reload();
   }

   useEffect(() => {
      const fetchAllBooks = async () => {
         try {
            const promise = await fetch(`${baseUrl}/api/data/allBooks`);

            if (promise.ok) {
               const data = await promise.json();
               setAllBooks(data);
            }
            else {
               console.log(promise);
            }
         }
         catch (error) {
            console.log("Greška prilikom dohvaćanja svih knjiga: ", error);
         }
      }

      fetchAllBooks();
   }, []);

   const printAllBooks = () => {
      console.log(allBooks);
   }

   return (
      <div>
         <h1>All books</h1>
         <button onClick={handleReturnBack}>Natrag</button>
         {
            allBooks.map((book, index) => (
               <div key={index}>
                  <a href="#">{book.ime} {book.prezime} : {book.naslov} ({ book.godizd })</a>
               </div>
            ))
         }
         <button onClick={printAllBooks}>Print (pogledaj console)</button>
      </div>
   );
}

export default AllBooks;
