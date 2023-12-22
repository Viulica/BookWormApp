// App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


// Uvezite NavBar
import NavBar from '../components/NavBar';

// Komponente za rute
import Home from '../components/Home';
import Login from '../components/Login';
import Profile from '../components/Profile';
import MyProfile from '../components/MyProfile';
import ChangeProfile from '../components/ChangeProfile';
import MyBooks from '../components/MyBooks';
import Logout from '../components/Logout';
import AllBooks from '../components/AllBooks';
import AddBook from '../components/AddBook';
import ShowBook from '../components/ShowBook';
import Inbox from '../components/Inbox';
import 'bootstrap/dist/css/bootstrap.min.css';


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
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/profile/:id" element={<Profile/>} />
            <Route path="/changeProfile" element={ <ChangeProfile/> } />
            <Route path="/myBooks" element={<MyBooks />} />
            <Route path='/logout' element={<Logout />} />
            <Route path='/allBooks' element={<AllBooks />} />
            <Route path='/addBook' element={<AddBook />} />
            <Route path='/book/:id' element={<ShowBook />} />
            <Route path='/inbox' element={<Inbox/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
export const baseUrl = 'http://localhost:3000';
