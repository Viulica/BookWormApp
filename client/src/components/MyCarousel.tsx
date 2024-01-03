// @ts-ignore
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Book from './Book';
import img1 from "../images/1984.jpeg"
import img2 from "../images/gatsby.jpeg"
import img3 from "../images/pride.jpeg"
import img4 from "../images/mockingbird.jpg"
import "../styles/Carousel.css";


const MySlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    pauseOnHover: true,
  };

  return (
    <Slider  {...settings}>
      <div>
        <Book src={img1} autor="George Orwell" naslov='1984' rating={4}/>
      </div>
      <div>
      <Book src={img2} autor="F.Scott Fitzgerlad" naslov='Veliki Gatsby' rating={4}/>
      </div>
      <div>
      <Book src={img3} autor="Jane Austen" naslov='Ponos i predrasude' rating={5}/>
      </div>
      <div>
      <Book src={img4} autor="Harper Lee" naslov='Ubiti sojku rugalicu' rating={3}/>
      </div>
    </Slider>
  );
}

export default MySlider;
