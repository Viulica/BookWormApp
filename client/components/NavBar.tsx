// NavBar.tsx
import React from 'react';
import '../styles/NavBar.css';

const NavBar: React.FC = () => {

  const token = sessionStorage.getItem("token");

  return (
    <nav className="navbar">
      <div className='navbar-option'><a href="/">Home</a></div>
      <div className='navbar-option'><a href="/profile">Profile</a></div>
      <div className='navbar-option'><a href="/myBooks">Books</a></div>
      {!token && <div className='navbar-option'><a href="/login">Login</a></div>}
      {token && <div className='navbar-option'><a href="/logout">Logout</a></div>}
    </nav>
    
  );
};

export default NavBar;
