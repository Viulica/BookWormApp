// App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Uvezite NavBar
import NavBar from "./components/nav/NavBar";

// Komponente za rute
import Home from "../src/components/Home";
import Login from "../src/components/Login";
import ProfileRedirect from "./components/ProfileRedirect";
import ChangeProfile from "../src/components/ChangeProfile";
import MyBooks from "../src/components/MyBooks";
import Logout from "../src/components/Logout";
import AllBooks from "../src/components/AllBooks";
import AddBook from "../src/components/AddBook";
import ShowBookRedirect from "../src/components/ShowBookRedirect";
import Inbox from "../src/components/Inbox";
import Messages from "../src/components/Messages";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css"
import Register from "./components/Register";
import AllAuthors from "./components/AllAuthors";
import ChangeBookInfo from "./components/ChangeBookInfo";

// Glavna aplikacija sa rutama i NavBar-om
const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile/:id" element={<ProfileRedirect />} />
            <Route path="/changeProfile" element={<ChangeProfile />} />
            <Route path="/myBooks/:id" element={<MyBooks />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/allBooks" element={<AllBooks />} />
            <Route path="/allAuthors" element={<AllAuthors />} />
            <Route path="/addBook" element={<AddBook />} />
            <Route path="/book/:id" element={<ShowBookRedirect />} />
            <Route path="/changeBookInfo/:id" element={<ChangeBookInfo/>} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/inbox?idReciever=:id" element={<Messages/>} />
          </Routes>
      </div>
    </Router>
  );
};

export default App;
export const baseUrl = "http://localhost:3000";
export const storedToken = sessionStorage.getItem('token');
