import React, {useState} from "react";

type CarouselProps = {
    slides: string[];
};

const Carousel: React.FC<CarouselProps> = ({slides}) => {
    const [currentSlide, setCurrentSlide] = useState<number>(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev+1) % slides.length)
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev-1) % slides.length)
    };

    return (
        <div className="carousel">
            <button onClick={prevSlide}>Previous</button>
                <div className="slide">
                    <img src={slides[currentSlide]} alt={`Slide ${currentSlide}`}/>
                </div>
            <button onClick={nextSlide}>Next</button>
        </div>
    );
};

export default Carousel;