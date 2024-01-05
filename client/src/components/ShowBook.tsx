import { baseUrl, storedToken } from "@/App";
import React, { ReactEventHandler, useEffect, useState } from "react";
import StarRating from "./StarRating";
import "../styles/ShowBook.css";
import { useNavigate } from "react-router-dom";
import {EditIcon} from "./EditIcon";
import {DeleteIcon} from "./DeleteIcon";
import { InfoIcon } from "./InfoIcon";

const ShowBook: React.FC = () => {
  const bookId = window.location.href
    .split("/")
    .at(window.location.href.split("/").length - 1);

  const [bookData, setBookData] = useState<any>(null);
  const [ratings, setRatings] = useState<any>([]);
  const [myRating, setMyRating] = useState<any>({
    idkorisnik: 0,
    ocjena: 0,
    txtrecenzija: null,
    idknjiga: 0
  });
  const [showRateWindow, setShowRateWindow] = useState<boolean>(false);
  const [userRatingText, setUserRatingText] = useState<string>("");
  const [reviewError, setReviewError] = useState<boolean>(false);
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
  }

  const closeBookDetailsWindow = () => {
    setShowBookDetails(false);
  }

  const fetchBookData = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/data/book/${bookId}`);

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setBookData(data);
      }
      else if (response.status === 401) {
        navigate('/login');
      }
      else {
        // Treba prikazati na zaslon da nema nikakvih knjiga!
        console.log(await response.json());
      }
    } catch (error) {
      console.error("Greška prilikom dohvaćanja knjige:", error);
    }
  };

  const fetchBookStatus = async () => {
    if (storedToken) {
      try {
        const response = await fetch(`${baseUrl}/api/data/saved/${bookId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${storedToken}`
          },
        })

        const data = await response.json();
        console.log(data);
        setBookStatus(data.statusNumber);
      } catch (error) {
        console.error("Greška prilikom dohvaćanja knjige:", error);
      }
    }
  }

  const fetchRatings = async () => {
    if (storedToken) {
      try {
        const response = await fetch(`${baseUrl}/api/data/getRatings/${bookId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${storedToken}`
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setRatings(data);
        }
        else if (response.status === 401) {
          navigate('/login');
        }
        else {
          console.log(await response.json);
        }
      } catch (error) {
        console.error("Greška prilikom dohvaćanja recenzije:", error);
      }
    }
  };

  const fetchMyRating = async () => {
    if(storedToken){
      try {
        const response = await fetch(`${baseUrl}/api/data/myRating/${bookId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${storedToken}`
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setMyRating(data);
        }
        else if (response.status === 401) {
          navigate('/login');
        }
      }
      catch (error) {
        console.error("Greška prilikom dohvaćanja moje recenzije:", error);
      }
    }
  }

  const handleRate = async (param: number, txtrecenzija: string) => {
    const ocjena = param;
    console.log(txtrecenzija);
    const data = {
      ocjena, txtrecenzija
    };

    console.log(data);
    
    if (storedToken) {
      try {
        const response = await fetch(`${baseUrl}/api/data/rate/${bookId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${storedToken}`
          },
          body: JSON.stringify(data)
        })

        if (response.ok) {
          console.log(await response.json());
          window.location.reload();
        }
        else if (response.status === 401) {
          navigate('/login');
        }
      }
      catch (error) {
        console.error("Greška prilikom objavljivanja recenzije:", error);
      }
    }
  }

  const handleDeleteRate = async (idrecenzija: number) => {
    if (storedToken) {
      try {
        const response = await fetch(`${baseUrl}/api/data/deleteRating/${idrecenzija}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${storedToken}`
          }
        })
        
        console.log(await response.json());
        if (response.ok) {
          window.location.reload();
        }
        else if (response.status === 401) {
          navigate('/login');
        }
      } catch (error) {
        console.error("Greška prilikom brisanja recenzije:", error);
      }
    }
  }

  useEffect(() => {
    fetchBookData();
    fetchBookStatus();
    fetchMyRating();
    fetchRatings();
  }, []);

  const handleBookStatus = async (e: any) => {
    // console.log(e.target.value);
    console.log(e.target);

    document.querySelectorAll('.status').forEach(btn => {
      if (btn.classList.contains('btn-success')) {
        btn.classList.toggle('btn-success');
      }
    });
    
    document.getElementById(`${e.target.id}`)?.classList.toggle('btn-success');

    if (storedToken) {
      const statusNumber = e.target.id;
      try {
        const response = await fetch(`${baseUrl}/api/data/saveBook/${bookId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${storedToken}`
          },
          body: JSON.stringify({statusNumber})
        })

        console.log(await response.text());
        fetchBookStatus();
      } catch (error) {
        console.error("Greška prilikom brisanja recenzije:", error);
      }
    }


  }

  return (
    <>
      {bookData && (
        <>
          <div className="container">
            <p className="p-1">Title: {bookData.naslov}</p>
            <p className="p-1" data-id={bookData.idkorisnikAutor}>
              Author: <a href={"/profile/" + bookData.idkorisnikAutor}
                        className="text-primary text-decoration-underline">
                        {bookData.imeAutor + " " + bookData.prezAutor}
                      </a>
            </p>
            <p className="p-1">
              <button className={bookStatus === 1 ? "btn btn-success": "btn status"} id="1" onClick={(e) => handleBookStatus(e)}>
                Read
              </button>

              <button className={bookStatus === 2 ? "btn btn-success": "btn status"} id="2" onClick={(e) => handleBookStatus(e)}>
                Currently reading
              </button>
              
              <button className={bookStatus === 3 ? "btn btn-success": "btn status"} id="3" onClick={(e) => handleBookStatus(e)}>
                Want to read
              </button>
            </p>
            <p className="p-1">Description: {bookData.opis}</p>
            <p className="p-1"><a onClick={openBookDetailsWindow}><InfoIcon/></a></p>
            <div>
              <div>
                My rating:
              </div>
              {/* My rating */}
              <p className="p-1">
                <StarRating
                  rating={myRating.ocjena}
                  onRatingChange={(newRating) => {
                    if (newRating === myRating.ocjena) {
                      newRating = 0;
                    }
                    setMyRating({...myRating, ocjena: newRating});
                    handleRate(newRating, myRating.txtrecenzija);
                  }} />
              </p>
              <div>
                {myRating.txtrecenzija ? 
                  <p className="p-1">
                      <a className="delete-icon" onClick={() => {handleDeleteRate(myRating.idrecenzija)}}><DeleteIcon /></a>
                      <a className="edit-icon" onClick={openRateWindow}><EditIcon /></a>
                      {myRating.txtrecenzija}
                    </p>
                  :
                    <p className="p-1">
                      <a className="btn btn-primary" onClick={openRateWindow}>Rate</a>
                    </p>
                }
              </div>
            </div>
            <p className="p-1">
              <a
                href={"/inbox?idReciever=" + bookData.idkorisnikAutor}
                className="btn btn-primary"
              >
                Send message to author
              </a>
            </p>
          </div>

          <hr className="my-4" />
          <div className="container">
            <h2 className="display-7">Ratings</h2>
            <div>
              {ratings.map((rating: any, index: any) => (
                <div key={index}>
                  <p className="p-4">
                    <a
                      href={"/profile/" + rating.idkorisnik}
                      className="text-primary text-decoration-underline"
                    >
                      {rating.korime}
                    </a>
                    <StarRating rating={rating.ocjena} />
                  </p>
                  {rating.txtrecenzija && <p>{rating.txtrecenzija}</p>}
                </div>
              ))}
            </div>
          </div>

          {showRateWindow && (
            <div className="background">
              <div className="window-rate">
                <span className="exit" onClick={closeRateWindow}>
                  &times;
                </span>
                <div>Write rating!</div>
                {reviewError ? (
                  <div>
                    <p className="error-text">Missing data</p>
                  </div>
                ) : (
                  <></>
                )}
                <div>
                  <textarea
                    rows={10}
                    cols={30}
                    className="textarea-review"
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
                      if (userRatingText === "") {
                        setReviewError(true);
                      } else {
                        setReviewError(false);
                          setMyRating({...myRating, txtrecenzija: userRatingText});
                          handleRate(myRating.ocjena, userRatingText);
                      }
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
                <span className="exit" onClick={closeBookDetailsWindow}>&times;</span>
                <div>
                    <p className="p-1">Genre: {bookData.zanr}</p>
                    <p className="p-1">Published: {bookData.godizd}</p>
                </div>
              </div>
            </div>
          )}

        </>
      )}
    </>
  );
};

export default ShowBook;
