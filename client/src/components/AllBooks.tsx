import { baseUrl, storedToken } from "@/App";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "./Slider";



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
            <Slider books={allBooks} id={4} />
         </div>
      )
   );
}

export default AllBooks;
