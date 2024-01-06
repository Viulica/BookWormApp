import React, { useState, useEffect } from "react";
import StarRating from "./StarRating";
import "../styles/Slider.css";

interface Book {
  idknjiga: number;
  naslov: string;
  godizd: number;
  imeAutor: string;
  prezAutor: string;
  brojRecenzija: number;
  brojOsvrta: number;
  prosjekOcjena: number;
  slika?: string;
}

interface SliderProps {
  books: Book[];
  id: number;
}

export const getImageSource = (bookData: any) => {
  if (bookData && bookData.type === "Buffer" && bookData.data) {
    const uint8Array = new Uint8Array(bookData.data);
    const byteArray = Array.from(uint8Array);
    const base64Image = btoa(String.fromCharCode.apply(null, byteArray));
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;
    return imageUrl;
  }
  return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBmaWxsPSIjMDAwMDAwIiBkPSJNMzAgMy40MTRMMjguNTg2IDJMMiAyOC41ODZMMy40MTQgMzBsMi0ySDI2YTIuMDAzIDIuMDAzIDAgMCAwIDItMlY1LjQxNHpNMjYgMjZINy40MTRsNy43OTMtNy43OTNsMi4zNzkgMi4zNzlhMiAyIDAgMCAwIDIuODI4IDBMMjIgMTlsNCAzLjk5N3ptMC01LjgzMmwtMi41ODYtMi41ODZhMiAyIDAgMCAwLTIuODI4IDBMMTkgMTkuMTY4bC0yLjM3Ny0yLjM3N0wyNiA3LjQxNHpNNiAyMnYtM2w1LTQuOTk3bDEuMzczIDEuMzc0bDEuNDE2LTEuNDE2bC0xLjM3NS0xLjM3NWEyIDIgMCAwIDAtMi44MjggMEw2IDE2LjE3MlY2aDE2VjRINmEyLjAwMiAyLjAwMiAwIDAgMC0yIDJ2MTZ6Ii8+PC9zdmc+";
};

const Slider: React.FC<SliderProps> = ({ books, id }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalBooks = books.length;

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && currentPage > 1) {
        setCurrentPage((prevPage) => prevPage - 1);
      } else if (e.key === "ArrowRight" && currentPage < totalBooks) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    };
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [currentPage, totalBooks]);

  const updateSlider = () => {
    const bookWidth = document.querySelector(".book")?.clientWidth || 0;
    const translateValue = -(currentPage - 1) * bookWidth;

    document
      .querySelector(".books")
      ?.setAttribute("style", `transform: translateX(${translateValue}px)`);
  };

  const handlePrevClick = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    } else {
      setCurrentPage(totalBooks);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalBooks) {
      setCurrentPage((prevPage) => prevPage + 1);
    } else {
      setCurrentPage(1);
    }
  };

  useEffect(() => {
    updateSlider();
  }, [currentPage]);

  return (
    <>
      <div className="slider-container">
        <div>
          <button onClick={handlePrevClick}>&#60;</button>
          <div className={"books-" + id}>
            {books.slice(currentPage - 1, currentPage).map((book, index) => (
              <a
                href={"/book/" + book.idknjiga}
                key={index}
                className="book-link"
              >
                <div className={`book`} id={`book-${index + 1}`}>
                  <div className="book-image">
                    <img src={book.slika} alt="Book cover" />
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
            ))}
          </div>
          <button onClick={handleNextClick}>&#62;</button>
        </div>
        <div className="page-indicator">{currentPage + "/" + totalBooks}</div>
      </div>
    </>
  );
};

export default Slider;
