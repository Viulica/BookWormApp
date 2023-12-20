import { baseUrl } from "@/App";
import { useEffect, useState } from "react";

const MyBooks: React.FC = () => {
   const [myBooks, setMyBooks] = useState<any[]>([]);

   useEffect(() => {
      const fetchBooksData = async () => {
         try {
            const storedToken = sessionStorage.getItem("token");
            if (storedToken) {
               const response = await fetch(`${baseUrl}/api/data/myBooks`, {
                  headers: {
                     Authorization: `${storedToken}`,
                   },
               });

               if (response.ok) {
                  const data = await response.json();
                  const extractedBooks = data.extractedBooks;
                  console.log(extractedBooks);
                  setMyBooks(extractedBooks);
               } else {
                  console.log(response);
               }
            }
         } catch (error) {
            console.error('Greška prilikom dohvaćanja knjiga:', error);
         }
      };

      fetchBooksData();
   }, []);

   return (
      <div>
         <h1>Books</h1>
         <div>My books:</div>
         <div>
         </div>
      </div>
   );
};

export default MyBooks;
