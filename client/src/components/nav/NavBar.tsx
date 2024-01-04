// NavBar.tsx
import React from "react";
import NavItem from "./NavItem";
import SearchBar from "./SearchBar";
import "../../styles/NavItem.css"
import "../../styles/SearchBar.css"
import "../../styles/NavBar.css"


const NavBar: React.FC = () => {
  const token = sessionStorage.getItem("token");

  return (
    <nav className="my-container">
        <ul className="my-navbar">
        <NavItem href="/">Home</NavItem>
        <NavItem href="/my-profile">Profile</NavItem>
        <NavItem href="/myBooks/">My Books</NavItem>
        <NavItem href="/inbox">Inbox</NavItem>
      {!token && <NavItem href="/login">Login</NavItem>}
      {token && <NavItem href="/logout">Logout</NavItem>}
      <SearchBar></SearchBar>
      </ul>
    </nav>
  );
};

export default NavBar;
