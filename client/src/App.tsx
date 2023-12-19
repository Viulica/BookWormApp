// App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


// Uvezite NavBar
import NavBar from '../components/NavBar';

// Komponente za rute
import Home from '../components/Home';
import Login from '../components/Login';
import Profile from '../components/Profile';
import Books from '../components/Books';
import Logout from '../components/Logout';


// Glavna aplikacija sa rutama i NavBar-om
const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <NavBar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/books" element={<Books />} />
            <Route path='/logout' element={<Logout />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
export const baseUrl = 'http://localhost:3000';
