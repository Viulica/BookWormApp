// NavBar.tsx
import React from 'react';
import '../styles/NavBar.css';

const NavBar: React.FC = () => {
  return (
    <nav className="navbar">
        <div className='navbar-option'><a href="/">Home</a></div>
        <div className='navbar-option'><a href="/profile">Profile</a></div>
        <div className='navbar-option'><a href="/books">Books</a></div>
        <div className='navbar-option'><a href="/login">Login</a></div>
        <div className='navbar-option'><a href="/logout">Logout</a></div>
    </nav>
  );
};

export default NavBar;
