import { baseUrl, storedToken } from "@/App";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "./Slider";

const AllBooks: React.FC = () => {
  const navigate = useNavigate();
  const [allBooks, setAllBooks] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAllBooks = async () => {
      try {
        const promise = await fetch(`${baseUrl}/api/data/allBooks`, {
          method: "GET",
          headers: {
            "Contenty-type": "application/json",
          },
        });

        if (promise.ok) {
          const data = await promise.json();
          console.log(data);
          setAllBooks(data);
        } else {
          console.log(promise);
        }
      } catch (error) {
        console.log("Greška prilikom dohvaćanja svih knjiga: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllBooks();
  }, []);

  return !loading && allBooks ? (
    <div className="container allBooks">
      <Slider books={allBooks} id={4} />
    </div>
  ) : (
    <p className="p-4">Loading...</p>
  );
};

export default AllBooks;
