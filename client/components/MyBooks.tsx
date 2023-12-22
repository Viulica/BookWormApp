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
      {
        loading ?
          <p className="p-4">Učitavanje popisa mojih knjiga...</p> :
          <>
            <div className="container">
              <h1 className="display-6">My Books</h1>
              
              <div className="container">
                <hr className="my-4" />

                {myBooks.length > 0 ?
                  
                  (myBooks.map((book, index) => (
                    <div key={index} className="container">
                      <div>
                        <a href={"/book/" + book.idknjiga}
                          className="text-primary text-decoration-underline">
                          {JSON.stringify(book)}
                        </a>
                      </div>
                      <hr className="my-4" />
                    </div>
                  ))) :
                  
                  <>Ništa</>
                }
              </div>
            </div>
          
          </>
      }
    </div>
  );
};

export default MyBooks;
