import { baseUrl, storedToken } from "@/App";
import React, { useEffect, useState } from "react";
import StarRating from "../StarRating";
import "../../styles/ShowBook.css";
import { useNavigate } from "react-router-dom";
import { EditIcon } from "../EditIcon";
import { DeleteIcon } from "../DeleteIcon";
import { InfoIcon } from "../InfoIcon";
import { getImageSource } from "../Slider";

const ReaderViewShowBook: React.FC = () => {
  const bookId = window.location.href
    .split("/")
    .at(window.location.href.split("/").length - 1);
  const [bookData, setBookData] = useState<any>(null);
  const [ratings, setRatings] = useState<any>([]);
  const [myRating, setMyRating] = useState<any>({
    idkorisnik: 0,
    ocjena: 0,
    txtrecenzija: null,
    idknjiga: 0,
  });
  const [showRateWindow, setShowRateWindow] = useState<boolean>(false);
  const [userRatingText, setUserRatingText] = useState<string>("");
  const [showBookDetails, setShowBookDetails] = useState<boolean>(false);
  const [bookStatus, setBookStatus] = useState<number>(0);
  const navigate = useNavigate();

  const openRateWindow = () => {
    if (myRating.txtrecenzija) {
      setUserRatingText(myRating.txtrecenzija);
    }
    setShowRateWindow(true);
  };

  const closeRateWindow = () => {
    setShowRateWindow(false);
  };

  const openBookDetailsWindow = () => {
    setShowBookDetails(true);
  };

  const closeBookDetailsWindow = () => {
    setShowBookDetails(false);
  };

  const fetchBookData = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/data/book/${bookId}`);

      if (response.ok) {
        const data = await response.json();
        setBookData(data);
      } else if (response.status === 401) {
        navigate("/login");
      } 
    } catch (error) {
      console.error("Greška prilikom dohvaćanja knjige:", error);
    }
  };

  const fetchBookStatus = async () => {
    if (storedToken) {
      try {
        const response = await fetch(`${baseUrl}/api/data/saved/${bookId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${storedToken}`,
          },
        });

        const data = await response.json();
        setBookStatus(data.statusNumber);
      } catch (error) {
        console.error("Greška prilikom dohvaćanja knjige:", error);
      }
    }
  };

  const fetchRatings = async () => {
   try {
      const response = await fetch(
      `${baseUrl}/api/data/getRatings/${bookId}`,
      {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
         },
      }
      );

      if (response.ok) {
      const data = await response.json();
      setRatings(data);
      } else if (response.status === 401) {
      navigate("/login");
      } 
   } catch (error) {
      console.error("Greška prilikom dohvaćanja recenzije:", error);
   }
 };

  const fetchMyRating = async () => {
    if (storedToken) {
      try {
        const response = await fetch(`${baseUrl}/api/data/myRating/${bookId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${storedToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setMyRating(data);
        } else if (response.status === 401) {
          navigate("/login");
        }
      } catch (error) {
        console.error("Greška prilikom dohvaćanja moje recenzije:", error);
      }
    }
  };

  const handleRate = async (param: number, txtrecenzija: string) => {
    const ocjena = param;
    console.log(txtrecenzija);
    const data = {
      ocjena,
      txtrecenzija,
    };

    console.log(data);

    if (storedToken) {
      try {
        const response = await fetch(`${baseUrl}/api/data/rate/${bookId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${storedToken}`,
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          console.log(await response.json());
          window.location.reload();
        } else if (response.status === 401) {
          navigate("/login");
        }
      } catch (error) {
        console.error("Greška prilikom objavljivanja recenzije:", error);
      }
    }
  };

  const handleDeleteRate = async (idrecenzija: number) => {
    if (storedToken) {
      try {
        const response = await fetch(
          `${baseUrl}/api/data/deleteRating/${idrecenzija}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${storedToken}`,
            },
          }
        );

        console.log(await response.json());
        if (response.ok) {
          window.location.reload();
        } else if (response.status === 401) {
          navigate("/login");
        }
      } catch (error) {
        console.error("Greška prilikom brisanja recenzije:", error);
      }
    }
  };

  useEffect(() => {
    fetchBookData();
    fetchRatings();
    fetchMyRating();
    fetchBookStatus();
  }, []);


  const handleBookStatus = async (e: any) => {
    console.log(e.target);

    document.querySelectorAll(".status").forEach((btn) => {
      if (btn.classList.contains("btn-success")) {
        btn.classList.toggle("btn-success");
      }
    });

    document.getElementById(`${e.target.id}`)?.classList.toggle("btn-success");

    if (storedToken) {
      const statusNumber = e.target.id;
      try {
        const response = await fetch(`${baseUrl}/api/data/saveBook/${bookId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${storedToken}`,
          },
          body: JSON.stringify({ statusNumber }),
        });

        console.log(await response.text());
        fetchBookStatus();
      } catch (error) {
        console.error("Greška prilikom brisanja recenzije:", error);
      }
    }
  };

  return (
    <>
      {bookData && (
        <div className="content">

          {/* <div className="go-back">
            <a href="" className="btn btn-primary">
              Back
            </a>
          </div> */}
          <div className="book-details-title">
            <h1 className="display-5">Title: {bookData.naslov}</h1>
          </div>

          <div className="container-show-book">
            <div className="book-image-and-details">
              <div className="book-image">
                <img src={getImageSource(bookData.slika)} alt="Book cover" />
              </div>
              <div className="book-details">
                <div
                  className="book-details-author"
                  data-id={bookData.idkorisnikAutor}
                >
                  <span>
                    Author:{" "}
                    <a
                      href={"/profile/" + bookData.idkorisnikAutor}
                      className="text-primary text-decoration-underline"
                    >
                      {bookData.imeAutor + " " + bookData.prezAutor}
                    </a>
                  </span>
                  <span>
                     <a
                     href={"/inbox?idReciever=" + bookData.idkorisnikAutor}
                     className="btn btn-warning"
                     >
                     Send message
                     </a>
                  </span>
                </div>
                <div className="book-details-description">
                  Description: {bookData.opis}
                </div>
                <div className="book-details-more-info">
                  <a onClick={openBookDetailsWindow} className="info-icon">
                    <InfoIcon />
                  </a>
                </div>
                <div className="book-details-reading-status">
                  <button
                    className={
                      bookStatus === 1
                        ? "btn btn-success"
                        : "btn btn-outline-success"
                    }
                    id="1"
                    onClick={(e) => handleBookStatus(e)}
                  >
                    Read
                  </button>

                  <button
                    className={
                      bookStatus === 2
                        ? "btn btn-success"
                        : "btn btn-outline-success"
                    }
                    id="2"
                    onClick={(e) => handleBookStatus(e)}
                  >
                    Currently reading
                  </button>

                  <button
                    className={
                      bookStatus === 3
                        ? "btn btn-success"
                        : "btn btn-outline-success"
                    }
                    id="3"
                    onClick={(e) => handleBookStatus(e)}
                  >
                    Want to read
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="container-book-my-rating">
            <div>
               <div>My rating:</div>
               {/* My rating */}
               <div className="book-my-rating-stars">
               <StarRating
                  rating={myRating.ocjena}
                  onRatingChange={(newRating) => {
                     if (newRating === myRating.ocjena) {
                     newRating = 0;
                     }
                     setMyRating({ ...myRating, ocjena: newRating });
                     handleRate(newRating, myRating.txtrecenzija);
                  }}
               />
               </div>
               <div className="book-my-rating-icons-and-txtrating">
               {myRating.txtrecenzija ? (
                  <>
                     <div className="book-my-rating-icons">
                     <a
                        className="delete-icon"
                        onClick={() => {
                           handleDeleteRate(myRating.idrecenzija);
                        }}
                     >
                        <DeleteIcon />
                     </a>
                     <a className="edit-icon" onClick={openRateWindow}>
                        <EditIcon />
                     </a>
                     </div>
                     <div className="book-my-rating-txtrating">
                     {myRating.txtrecenzija}
                     </div>
                  </>
               ) : (
                  <div className="book-my-rating-rate">
                     <a className="btn btn-primary" onClick={openRateWindow}>
                     Rate
                     </a>
                  </div>
               )}
               </div>
            </div>
          </div>

          <div className="horizontal-line"></div>
          
          <div className="container-book-ratings">
            <div>
              <div className="book-ratings-title">Ratings</div>

              <div className="book-ratings">
                {ratings.map((rating: any, index: any) => (
                  <div key={index} className="book-rating">
                    <div className="book-rating-username-and-stars">
                      <StarRating rating={rating.ocjena} />
                      <a
                        href={"/profile/" + rating.idkorisnik}
                        className="text-primary text-decoration-underline"
                      >
                        {rating.korime}
                      </a>
                    </div>
                    {rating.txtrecenzija && (
                      <div className="book-rating-txtrating">
                        {rating.txtrecenzija}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {showRateWindow && (
            <div className="background">
              <div className="window-rate">
                <span className="exit" onClick={closeRateWindow}>
                  &times;
                </span>
                <div>Write rating!</div>
                <div>
                  <textarea
                    rows={10}
                    cols={30}
                    className="form-control"
                    id="textarea-review"
                    value={userRatingText}
                    onChange={(e) => {
                      setUserRatingText(e.target.value);
                    }}
                  ></textarea>
                </div>
                <div>
                  <button
                    className="btn btn-primary"
                    id="post-review"
                    onClick={() => {
                      setMyRating({
                        ...myRating,
                        txtrecenzija: userRatingText,
                      });
                      handleRate(myRating.ocjena, userRatingText);
                    }}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          )}

          {showBookDetails && (
            <div className="background">
              <div className="window-book-details">
                <span className="exit" onClick={closeBookDetailsWindow}>
                  &times;
                </span>
                <div className="more-info">
                  <p className="p-1">ISBN: {bookData.isbn}</p>
                  <p className="p-1">Genre: {bookData.zanr}</p>
                  <p className="p-1">Published: {bookData.godizd}</p>
                  <p className="p-1">
                    Author's date of birth: {bookData.datrod}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ReaderViewShowBook;
