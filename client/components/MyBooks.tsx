import { baseUrl } from "@/App";
import { useEffect, useState } from "react";
import  { useNavigate, Link } from "react-router-dom";

const MyBooks: React.FC = () => {
  const [myBooks, setMyBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooksData = async () => {
      const storedToken = sessionStorage.getItem("token");
      if (storedToken) {
        try {
          const response = await fetch(`${baseUrl}/api/data/profile/reader/myBooks`, {
            headers: {
              Authorization: `${storedToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setMyBooks(data);
          } else {
             // Treba prikazati na zaslon da nema nikakvih knjiga!
             console.log(await response.json());
          }
        } catch (error) {
          console.error("Greška prilikom dohvaćanja knjiga:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setTimeout(() => {
          navigate("/login");
          window.location.reload();
        }, 1500);
      }
    };

     fetchBooksData();
  }, []);

  return (
    <div>
      <h1>Books</h1>
      {loading && <p>Učitavanje popisa mojih knjiga...</p>}
      {myBooks.length > 0 && (
        <div>
          <p>My books:</p>
              {myBooks.length > 0 ? (
                  myBooks.map((book, index) => (
                    <div key={index}>
                      <Link to={`/book/${book.idknjiga}`}>
                        {book.imeAutor} {book.prezAutor} : {book.naslov} (
                        {book.godizd}) - (status: {book.status})
                      </Link>
                  </div>
                  ))
              ) : (<div>Nema ništa</div>)}
        </div>
      )}
    </div>
  );
};

export default MyBooks;
