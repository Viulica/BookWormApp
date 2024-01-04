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
        <Carousel title="Najbolje ocijenjene"/>
      </div>
    );
  }


export default Home;
