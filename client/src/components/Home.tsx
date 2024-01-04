import React from "react";
import Carousel from "./MyCarousel";
import { storedToken } from "@/App";


  const Home: React.FC = () => {

    return (
      <div>
        <Carousel title="Najpopularnije knjige"/>
        {/* <button className="btn btn-primary" onClick={handleShowAllBooks}>Sve knjige</button>
           <button className="btn btn-primary" onClick={handleShowAllUsers}>Svi korisnici</button> */}
  
        {/* Prikaz popularnih knjiga! */}
<<<<<<< Updated upstream
        <Carousel title="Najbolje ocijenjene"/>

=======

        <a href="/allBooks" className="btn btn-primary">All books</a>
        <a href="/allAuthors" className="btn btn-primary">All authors</a>
>>>>>>> Stashed changes
      </div>
    );
  }


export default Home;
