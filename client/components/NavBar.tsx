// NavBar.tsx
import React from 'react';

const NavBar: React.FC = () => {

  const token = sessionStorage.getItem("token");

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className='container'>

        <ul className='navbar-nav'>
          <li className='nav-item'><a href="/" className='nav-link'>Home</a></li>
          <li className='nav-item'><a href="/profile" className='nav-link'>Profile</a></li>
          <li className='nav-item'><a href="/myBooks/" className='nav-link'>My Books</a></li>
          <li className='nav-item'><a href="/inbox" className='nav-link'>Inbox</a></li>
          {!token && <li className='nav-item'><a href="/login" className='nav-link'>Login</a></li>}
          {token && <li className='nav-item'><a href="/logout" className='nav-link'>Logout</a></li>}
        </ul>
      </div>
      
    </nav>
    
  );
};

export default NavBar;
