import React, { useState, useEffect } from "react";
import StarRating from "./StarRating";
import { getImageSource } from "./Slider";

interface Book {
  idknjiga: number;
  naslov: string;
  godizd: number;
  imeAutor: string;
  prezAutor: string;
  brojRecenzija: number;
  brojOsvrta: number;
  prosjekOcjena: number;
  slika: { type: string; data: number[] };
}

interface BookCardProps {
    book: Book,
    index: number
}

const BookCard = ({book, index}: BookCardProps) => {
  return (
    <div>
      <a href={"/book/" + book.idknjiga}
                // key={index}
                className="book-link"
              >
                <div className={`book`} id={`book-${index + 1}`}>
                  <div className="book-image">
                    <img src={getImageSource(book.slika)} alt="Book cover" />
                    {/* <img src={getImageSource(book.slika)} alt="Book cover" /> */}
                  </div>
                  <div className="book-title-and-published">
                    {book.naslov + " (" + book.godizd + ")"}
                  </div>
                  <div className="book-author">
                    {"by " + book.imeAutor + " " + book.prezAutor}
                  </div>
                  <div className="book-number-of-ratings">
                    {book.brojRecenzija + " ratings"}
                  </div>
                  <div className="book-number-of-reviews">
                    {book.brojOsvrta + " reviews"}
                  </div>
                  <div className="book-avg-rating">
                    <StarRating rating={book.prosjekOcjena} />
                    <span>{book.prosjekOcjena}</span>
                  </div>
                </div>
              </a>
    </div>
  )
}

export default BookCard
