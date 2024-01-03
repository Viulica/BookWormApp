import React from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "./MyCarousel";


  const Home: React.FC = () => {

    return (
      <div>
        <Carousel />
        {/* <button className="btn btn-primary" onClick={handleShowAllBooks}>Sve knjige</button>
           <button className="btn btn-primary" onClick={handleShowAllUsers}>Svi korisnici</button> */}
  
        {/* Prikaz popularnih knjiga! */}
      </div>
    );
  }


export default Home;
