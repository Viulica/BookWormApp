import { baseUrl, storedToken } from "@/App";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



const AllBooks: React.FC = () => {
   const navigate = useNavigate();
   const [allBooks, setAllBooks] = useState<any>([]);

   useEffect(() => {
      const fetchAllBooks = async () => {
         try {
            const promise = await fetch(`${baseUrl}/api/data/allBooks`, {
               method: 'GET',
               headers: {
                  'Contenty-type': 'application/json'
               }
            });

            if (promise.ok) {
               const data = await promise.json();
               console.log(data);
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


   return (
      allBooks && (
         <div className="container allBooks">
            {allBooks.map((book: any, index: any) => (
               <div className="book" key={index}>
                  <div className="book-title">
                     <a href={"/book/" + book.idknjiga} className="text-primary text-decoration-underline">{book.naslov + " (" + book.godizd + ")"}</a>
                  </div>
                  <div className="book-author">
                     <a href={"/profile/" + book.idkorisnikAutor}>{ book.imeAutor + " " + book.prezAutor}</a>
                  </div>
               </div>
            ))}
         </div>
      )
   );
}

export default AllBooks;
