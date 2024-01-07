// @ts-ignore
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Book from './Book';
import "../styles/Carousel.css";
import { baseUrl } from "@/App";
import { useEffect, useState } from 'react';

interface BookType {
  naslov: string,
  autor: string,
  src: string,
  rating: number, 
  idknjiga: number
}

interface CarouselProps {
  title: string,
  route: string
}


const MyCarousel = (props: CarouselProps) => {

  const [data, setData] = useState<BookType[]>([]);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    pauseOnHover: true,
  };

  async function fetchData() {
    try {
      const response = await fetch(`${baseUrl}/api/data/${props.route}`);
      console.log(response)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const resdata = await response.json();
      //@ts-ignore
      setData([...resdata]);
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  
  return (
    <div className='carousel-container'>
      <h3 className='carousel-title'>{props.title}</h3>
      <Slider  {...settings}>
            {data.map(book => (
             
              <a href={"/book/" + book.idknjiga}>
                   <div key={book.naslov}>
                    <Book naslov={book.naslov} autor={book.autor} src={book.src} rating={book.rating} />
                </div>
              </ a>
            ))}
      </Slider>
    </div>
  );
}

export default MyCarousel;



