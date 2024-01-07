// NavBar.tsx
import React, { useEffect, useState } from "react";
import NavItem from "./NavItem";
import SearchBar from "./SearchBar";
import "../../styles/NavItem.css"
import "../../styles/SearchBar.css"
import "../../styles/NavBar.css"
import { baseUrl } from "@/App";
import { useNavigate } from "react-router-dom";

interface BookType {
  naslov: string,
  imeAutor: string,
  prezAutor: string,
  slika : string,
  rating: number, 
}

const NavBar: React.FC = () => {
  const storedToken = sessionStorage.getItem("token");

  const [role, setRole] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [myUserId, setMyUserId] = useState<number>(0);
  const [data, setData] = useState<BookType[]>([]);
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  const fetchBooks = async() => {

    try {

      const response = await fetch(`${baseUrl}/api/data/allBooks`);
      if (response.ok) {
        const data = await response.json();
        setData(data);
      }

    } catch(error) {
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
          setLoading(false);
        }
        else if (response.status === 401) {
          navigate('/login');
        }
        else {
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
    }
    else {
      setRole("user");
    }
  };

  useEffect(() => {
    fetchMyUserId();
    fetchGetRole();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [])

  return (
    !loading && (
      <nav className="my-container">
        <ul className="my-navbar">
        <NavItem path={currentPath} href="/">Home</NavItem>
        <NavItem path={currentPath}  href="/allBooks">All books</NavItem>
        <NavItem path={currentPath}  href="/allAuthors">All authors</NavItem>
        {storedToken && <NavItem path={currentPath}  href={"/profile/" + myUserId}>Profile</NavItem>}
        {(storedToken && role !== "admin") && <NavItem path={currentPath} href={"/myBooks/" + myUserId}>My Books</NavItem>}
        {(storedToken && role === "admin") && <NavItem path={currentPath} href="/addBook">Add Book</NavItem>}
        {storedToken && <NavItem path={currentPath} href="/inbox">Inbox</NavItem>}
        {!storedToken && <NavItem path={currentPath}  href="/login">Login</NavItem>}
        {!storedToken && <NavItem path={currentPath}  href="/register">Register</NavItem>}
        {storedToken && <NavItem path={currentPath}  href="/logout">Logout</NavItem>}
      <SearchBar books={data}></SearchBar>
      </ul>
    </nav>
    )
  );
};

export default NavBar;
