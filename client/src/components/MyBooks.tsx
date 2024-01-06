import { baseUrl, storedToken } from "@/App";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MyBooks.css";
import Slider from "./Slider";

const MyBooks: React.FC = () => {
  const [savedBooks, setSavedBooks] = useState<any>({});
  const [myUserId, setMyUserId] = useState<number>(0);
  const profileId = window.location.href
    .split("/")
    .at(window.location.href.split("/").length - 1);
  console.log(profileId);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthor, setIsAuthor] = useState<boolean>(false);
  const navigate = useNavigate();

  const fetchMyUserId = async () => {
    if (storedToken) {
      try {
        const response = await fetch(`${baseUrl}/api/data/getUserId`, {
          headers: {
            Authorization: `${storedToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setMyUserId(data);
        } else if (response.status === 401) {
          navigate("/login");
        } else {
          console.log(await response.json());
        }
      } catch (error) {
        console.log("Greška prilikom dohvaćanja userId:", error);
      }
    }
  };

  const fetchProfileData = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/data/profile/${profileId}`, {
        headers: {
          Authorization: `${storedToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setIsAuthor(data.tipkorisnika === "autor");
      } else if (response.status === 401) {
        navigate("/login");
      } else {
        console.log(await response.json());
      }
    } catch (error) {
      console.log("Greška prilikom dohvaćanja userId:", error);
    }
  };

  const fetchSavedBooksData = async () => {
    console.log("fetchSavedBooksData", profileId);
    if (storedToken) {
      try {
        const response = await fetch(
          `${baseUrl}/api/data/profile/reading/${profileId}`,
          {
            headers: {
              Authorization: `${storedToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setSavedBooks({...data});
        } else if (response.status === 401) {
          navigate("/login");
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

  useEffect(() => {
    fetchMyUserId();
    fetchProfileData();
    fetchSavedBooksData();
  }, []);

  return (
    <div>
      {loading ? (
        <p className="p-4">Loading...</p>
      ) : (
        <>
            <div className="container">

            {(savedBooks["Read"].length > 0 || savedBooks['Currently reading'].length > 0 || savedBooks['Want to read'].length > 0) ? (
              <>
                {savedBooks["Read"].length > 0 ? (
                  <>
                    <h1 className="display-6">Saved</h1>
                    <div className="read">
                      <p className="p-1 book-status">Read</p>
                      <Slider books={savedBooks["Read"]} id={1} />
                    </div>
                    <hr className="my-4" />
                  </>
                ) : (
                  <></>
                )}

                {savedBooks["Currently reading"].length > 0 ? (
                  <>
                    <div className="currently-reading">
                      <p className="p-1 book-status">Currently reading</p>
                      <Slider books={savedBooks["Currently reading"]} id={2} />
                    </div>
                    <hr className="my-4" />
                  </>
                ) : (
                  <></>
                )}

                {savedBooks["Want to read"].length > 0 ? (
                  <>
                    <div className="want-to-read">
                      <p className="p-1 book-status">Want to read</p>
                      <Slider books={savedBooks["Want to read"]} id={3} />
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <p className="p-4">User doesn't have any saved book!</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MyBooks;
