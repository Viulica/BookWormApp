// App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Uvezite NavBar
import NavBar from "./components/nav/NavBar";

// Komponente za rute
import Home from "../src/components/Home";
import Login from "../src/components/Login";
import Profile from "../src/components/Profile";
import MyProfile from "../src/components/MyProfile";
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
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/changeProfile" element={<ChangeProfile />} />
            <Route path="/myBooks" element={<MyBooks />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/allBooks" element={<AllBooks />} />
            <Route path="/addBook" element={<AddBook />} />
            <Route path="/book/:id" element={<ShowBook />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/messages/:id" element={<Messages param=""/>} />
          </Routes>
      </div>
    </Router>
  );
};

export default App;
export const baseUrl = "http://localhost:3000";
