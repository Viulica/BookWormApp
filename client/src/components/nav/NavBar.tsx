// NavBar.tsx
import React, { useEffect, useState } from "react";
import NavItem from "./NavItem";
import SearchBar from "./SearchBar";
import "../../styles/NavItem.css"
import "../../styles/SearchBar.css"
import "../../styles/NavBar.css"
import { baseUrl } from "@/App";
import { useNavigate } from "react-router-dom";


const NavBar: React.FC = () => {
  const storedToken = sessionStorage.getItem("token");


  const [myUserId, setMyUserId] = useState<number>(0);
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

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

  useEffect(() => {
    fetchMyUserId();
  }, []);

  return (
    <nav className="my-container">
        <ul className="my-navbar">
        <NavItem path={currentPath} href="/">Home</NavItem>
        <NavItem path={currentPath}  href="/allBooks">All books</NavItem>
        <NavItem path={currentPath}  href="/allAuthors">All authors</NavItem>
        {storedToken && <NavItem path={currentPath}  href={"/profile/" + myUserId}>Profile</NavItem>}
        {storedToken && <NavItem path={currentPath}  href="/myBooks/">My Books</NavItem>}
        {storedToken && <NavItem path={currentPath} href="/inbox">Inbox</NavItem>}
        {!storedToken && <NavItem path={currentPath}  href="/login">Login</NavItem>}
        {!storedToken && <NavItem path={currentPath}  href="/register">Register</NavItem>}
        {storedToken && <NavItem path={currentPath}  href="/logout">Logout</NavItem>}
      <SearchBar></SearchBar>
      </ul>
    </nav>
  );
};

export default NavBar;
