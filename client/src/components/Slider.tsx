import React, { useState, useEffect } from "react";
import "../styles/Slider.css";
import BookCard from "./BookCard";

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

interface SliderProps {
  books: Book[];
  id: number;
}

export const getImageSource = (imageData: {
  type: string;
  data: number[];
}): string => {
  if (imageData) {
    const blob = new Blob([new Uint8Array(imageData.data)], {
      type: "image/jpeg",
    });
    const imageUrl = URL.createObjectURL(blob);
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
    <div className="body">
      <div className="slider-container">
        <div>
          <button onClick={handlePrevClick}>&#60;</button>
          <div className={"books-" + id}>
            {books.slice(currentPage - 1, currentPage).map((book, index) => (
              <BookCard index={index} book={book} key={index} />
            ))}
          </div>
          <button onClick={handleNextClick}>&#62;</button>
        </div>
        <div className="page-indicator">{currentPage + "/" + totalBooks}</div>
      </div>
    </div>
  );
};

export default Slider;
