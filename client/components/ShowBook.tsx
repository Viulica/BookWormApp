import { baseUrl } from "@/App";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ShowBook: React.FC = () => {
  const [myBooks, setMyBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

   
   const {bookId} = useParams();
   
  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/data/book/${bookId}`);

        if (response.ok) {
          const data = await response.json();
        } else {
          // Treba prikazati na zaslon da nema nikakvih knjiga!
          console.log(await response.json());
        }
      } catch (error) {
        console.error("Greška prilikom dohvaćanja knjige:", error);
      }
    };

    fetchBookData();
  }, [bookId]);

  return <div></div>;
};

export default ShowBook;
