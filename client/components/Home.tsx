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
         <h1 className="display-4">Welcome to BookWormApp</h1>
         {/* <button className="btn btn-primary" onClick={handleShowAllBooks}>Sve knjige</button>
         <button className="btn btn-primary" onClick={handleShowAllUsers}>Svi korisnici</button> */}
      
         {/* Prikaz popularnih knjiga! */}
      </div>
   );
}

export default Home;
