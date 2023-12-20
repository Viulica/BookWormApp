import React from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
   const navigate = useNavigate();

   const handleShowAllBooks = () => {
      console.log("Show all books!");
      navigate('/allBooks');
      window.location.reload();
   }

   const handleShowAllUsers = () => {
      console.log("Show all users");
   }
   return (
      <div>
         <h1>Home Page</h1>
         <button onClick={handleShowAllBooks}>Sve knjige</button>
         <button onClick={handleShowAllUsers}>Svi korisnici</button>
      </div>
   );
}

export default Home;
