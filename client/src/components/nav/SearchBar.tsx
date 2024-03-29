import React from "react";
import { useState, useEffect } from "react";
import "../../styles/search.css";
import "../../styles/SearchBar.css"
import { getImageSource } from "../Slider";

interface BookType {
  naslov: string;
  imeAutor: string;
  prezAutor: string;
  slika: { type: string; data: number[] };
  rating: number;
  idknjiga: number;
}

interface SearchProps {
  books: BookType[];
}

function SearchBar({ books }: SearchProps) {
  const [query, setQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState<BookType[]>([]);

  useEffect(() => {
    if (query.length === 0) {
      setFilteredBooks([]);
    } else {
      const filtered = books
        .filter((book) =>
          book.naslov.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 3);
      setFilteredBooks(filtered);
    }
    console.log(filteredBooks);
  }, [query, books]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // search logic here
    console.log("searching for: ", query);
  };
  return (
    <form className="my-form" onSubmit={handleSubmit}>
      <input
        className="my-input"
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="my-dropdown">
        {filteredBooks.map((book) => (
          <a href={"/book/" + book.idknjiga} key={book.naslov}>
            <div className="search-container">
              <img className="search-img" src={getImageSource(book.slika)} />
              <div className="search-body">
                <div className="search-naslov">{book.naslov}</div>
                <div className="search-autor">
                  {book.imeAutor + " " + book.prezAutor}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </form>
  );
}

export default SearchBar;
