import React from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "./Carousel";
import img1 from "../images/img1.png"
import img2 from "../images/img2.png"


  const Home: React.FC = () => {
    const slides: string[] = [img1, img2];

    return (
      <div>
        <Carousel slides={slides} />
        {/* <button className="btn btn-primary" onClick={handleShowAllBooks}>Sve knjige</button>
           <button className="btn btn-primary" onClick={handleShowAllUsers}>Svi korisnici</button> */}
  
        {/* Prikaz popularnih knjiga! */}
      </div>
    );
  }


export default Home;
