import { baseUrl, storedToken } from "@/App";
import React, { useEffect, useState } from "react";
import StarRating from "../StarRating";
import "../../styles/ShowBook.css";
import { useNavigate } from "react-router-dom";
import { EditIcon } from "../EditIcon";
import { DeleteIcon } from "../DeleteIcon";
import { InfoIcon } from "../InfoIcon";

const UserViewShowBook: React.FC = () => {
  const bookId = window.location.href
    .split("/")
    .at(window.location.href.split("/").length - 1);
  const [bookData, setBookData] = useState<any>(null);
  const [ratings, setRatings] = useState<any>([]);
  const [showBookDetails, setShowBookDetails] = useState<boolean>(false);
  const navigate = useNavigate();

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
        console.log(data);
        setBookData(data);
      } else if (response.status === 401) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Greška prilikom dohvaćanja knjige:", error);
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
         console.log(data);
         setRatings(data);
         } else if (response.status === 401) {
         navigate("/login");
         } 
      } catch (error) {
         console.error("Greška prilikom dohvaćanja recenzije:", error);
      }
    };

  useEffect(() => {
     fetchBookData();
     fetchRatings();
  }, []);

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
                <img src={bookData.slika} alt="Book cover" />
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
                </div>
                
                <div className="book-details-description">
                  Description: {bookData.opis}
                </div>
                <div className="book-details-more-info">
                  <a onClick={openBookDetailsWindow} className="info-icon">
                    <InfoIcon />
                  </a>
                </div>
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

export default UserViewShowBook;
