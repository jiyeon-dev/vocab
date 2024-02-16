import { useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ItemCard from "./Item";
import { Button } from "../ui/button";
import { FaShuffle, FaArrowLeft, FaArrowRight } from "react-icons/fa6";

export default function Carousel({ data }) {
  let sliderRef = useRef(null);
  const [slideIndex, setSlideIndex] = useState(1);

  const settings = {
    dot: false,
    infinite: true,
    speed: 300,
    arrows: false,
    lazyLoad: true,
    beforeChange: (_, next) => setSlideIndex(next + 1),
  };

  const handleNext = () => {
    sliderRef.slickNext();
  };
  const handlePrev = () => {
    sliderRef.slickPrev();
  };
  const handleShuffle = () => {
    const random = Math.floor(Math.random() * data.length); // 0 ~ data.length
    sliderRef.slickGoTo(random);
  };

  return (
    <>
      <Slider
        ref={(slider) => {
          sliderRef = slider;
        }}
        {...settings}
      >
        {data.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </Slider>

      {/* Slide number */}
      <div className='flex justify-center items-center mb-10 select-none'>
        <span>
          {slideIndex} / {data.length}
        </span>
      </div>

      {/* Slider control buttons */}
      <div className='row-span-2 flex justify-around items-start mb-5 mx-16'>
        <Button
          variant='ghost'
          className='rounded-full w-16 h-16'
          onClick={handlePrev}
        >
          <FaArrowLeft size={30} />
        </Button>
        <Button
          variant='ghost'
          className='rounded-full w-16 h-16'
          onClick={handleShuffle}
        >
          <FaShuffle size={30} />
        </Button>
        <Button
          variant='ghost'
          className='rounded-full w-16 h-16'
          onClick={handleNext}
        >
          <FaArrowRight size={30} />
        </Button>
      </div>
    </>
  );
}
