// @ts-ignore
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BookCard from "./BookCard";
import "../styles/Carousel.css";
import { baseUrl } from "@/App";
import { useEffect, useState } from "react";

interface BookType {
  idknjiga: number;
  naslov: string;
  godizd: number;
  imeAutor: string;
  prezAutor: string;
  brojRecenzija: number;
  brojOsvrta: number;
  prosjekOcjena: number;
  slika: { type: string; data: number[] };
}

interface CarouselProps {
  title: string;
  route: string;
}

const MyCarousel = (props: CarouselProps) => {
  const [data, setData] = useState<BookType[]>([]);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow:
      window.innerWidth <= 768
        ? 1
        : window.innerWidth > 768 && window.innerWidth < 1024
        ? 2
        : 3,
    slidesToScroll: 1,
    autoplay: true,
    pauseOnHover: true,
  };

  async function fetchData() {
    try {
      const response = await fetch(`${baseUrl}/api/data/${props.route}`);
      console.log(response);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const resdata = await response.json();
      //@ts-ignore
      setData([...resdata]);
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="carousel-container">
      <h3 className="carousel-title">{props.title}</h3>
      <Slider {...settings}>
        {data.map((book, index) => (
          <div key={book.naslov}>
            <BookCard book={book} index={index} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default MyCarousel;
