import React, { useState, useEffect } from 'react'
import "../styles/HamburgerMenu.css"



const HamburgerMenu = () => {

  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
      setIsOpen(!isOpen);
  };

  
  return (
    <nav className="navbar">
        <div className={`hamburger-menu ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
            <div className ="line line1"></div>
            <div className="line line2"></div>
            <div className="line line3"></div>
        </div>
        <ul className={`menu-items ${isOpen ? 'open' : ''}`}>
            <li><a href="/">Home</a></li>
            <li><a href="/allBooks">All Books</a></li>
            <li><a href="allAuthors">All authors</a></li>
            <li><a href="/login">Login</a></li>
            <li><a href="register">Register</a></li>
        </ul>
    </nav>
  )
}

export default HamburgerMenu
