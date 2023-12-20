// App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


// Uvezite NavBar
import NavBar from '../components/NavBar';

// Komponente za rute
import Home from '../components/Home';
import Login from '../components/Login';
import Profile from '../components/Profile';
import MyBooks from '../components/MyBooks';
import Logout from '../components/Logout';
import AllBooks from '../components/AllBooks';
import AddBook from '../components/AddBook';
import ShowBook from '../components/ShowBook';


// Glavna aplikacija sa rutama i NavBar-om
const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <NavBar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/myBooks" element={<MyBooks />} />
            <Route path='/logout' element={<Logout />} />
            <Route path='/allBooks' element={<AllBooks />} />
            <Route path='/addBook' element={<AddBook />} />
            <Route path='/book/:id' element={<ShowBook />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
export const baseUrl = 'http://localhost:3000';
