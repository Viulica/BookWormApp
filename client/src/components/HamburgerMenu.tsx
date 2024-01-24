import React, { useState, useEffect } from "react";
import "../styles/HamburgerMenu.css";
import { baseUrl, storedToken } from "@/App";
import { useNavigate } from "react-router-dom";
import SearchBar from "./nav/SearchBar";

interface BookType {
  naslov: string;
  imeAutor: string;
  prezAutor: string;
  slika: { type: string; data: number[] };
  rating: number;
  idknjiga: number;
}

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const [role, setRole] = useState<string>("");
  const [myUserId, setMyUserId] = useState<number>(0);
  const [data, setData] = useState<BookType[]>([]);
  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/data/allBooks`);
      if (response.ok) {
        const data = await response.json();
        setData(data);
      }
    } catch (error) {
      console.log("Greška prilikom dohvaćanja knjiga:", error);
    }
  };

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

  const fetchGetRole = async () => {
    if (storedToken) {
      try {
        const response = await fetch(`${baseUrl}/api/data/profile/getRole`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${storedToken}`,
          },
        });

        if (response.ok) {
          const data = await response.text();
          setRole(data);
        }
      } catch (error) {
        console.error("Greška prilikom dohvaćanja uloge:", error);
      }
    } else {
      setRole("user");
    }
  };

  useEffect(() => {
    fetchMyUserId();
    fetchGetRole();
    fetchBooks();
  }, []);

  useEffect(() => {
    fetchGetRole();
  }, [role]);

  return (
    <nav className="navbar">
      <div
        className={`hamburger-menu ${isOpen ? "open" : ""}`}
        onClick={toggleMenu}
      >
        <div className="line line1"></div>
        <div className="line line2"></div>
        <div className="line line3"></div>
      </div>
      <ul className={`menu-items ${isOpen ? "open" : ""}`}>
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/allBooks">All Books</a>
        </li>
        <li>
          <a href="allAuthors">All authors</a>
        </li>
        {storedToken && (
          <li>
            <a href={"/profile/" + myUserId}>Profile</a>
          </li>
        )}
        {storedToken && role !== "admin" && (
          <li>
            <a href={"/myBooks/" + myUserId}>My Books</a>
          </li>
        )}
        {storedToken && role === "admin" && (
          <li>
            <a href="/addBook">Add Book</a>
          </li>
        )}
        {storedToken && role !== "admin" && (
          <li>
            <a href="/inbox">Inbox</a>
          </li>
        )}
        {!storedToken && (
          <li>
            <a href="/login">Login</a>
          </li>
        )}
        {!storedToken && (
          <li>
            <a href="register">Register</a>
          </li>
        )}
        {storedToken && (
          <li>
            <a href="/logout">Logout</a>
          </li>
        )}
        <SearchBar books={data}></SearchBar>
      </ul>
    </nav>
  );
};

export default HamburgerMenu;
