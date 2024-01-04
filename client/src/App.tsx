// App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Uvezite NavBar
import NavBar from "./components/nav/NavBar";

// Komponente za rute
import Home from "../src/components/Home";
import Login from "../src/components/Login";
import Profile from "./components/Profile";
import ChangeProfile from "../src/components/ChangeProfile";
import MyBooks from "../src/components/MyBooks";
import Logout from "../src/components/Logout";
import AllBooks from "../src/components/AllBooks";
import AddBook from "../src/components/AddBook";
import ShowBook from "../src/components/ShowBook";
import Inbox from "../src/components/Inbox";
import Messages from "../src/components/Messages";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css"
import Register from "./components/Register";

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
            <Route path="/profile/:id" element={<Profile />} />
            {/* <Route path="/profile/:id" element={<Profile />} /> */}
            <Route path="/changeProfile" element={<ChangeProfile />} />
            <Route path="/myBooks" element={<MyBooks />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/allBooks" element={<AllBooks />} />
            <Route path="/addBook" element={<AddBook />} />
            <Route path="/book/:id" element={<ShowBook />} />
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
