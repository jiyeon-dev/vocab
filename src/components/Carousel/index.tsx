import { useState, useMemo } from "react";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ItemCard from "./Item";
import { Button } from "../ui/button";
import { FaShuffle, FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { Vocabulary } from "@/types";

export default function Carousel({ data }: { data: Vocabulary[] }) {
  const [slider, setSlider] = useState<Slider>();
  const [slideIndex, setSlideIndex] = useState(1);

  const settings = useMemo<Settings>(
    () => ({
      infinite: true,
      dots: false,
      speed: 300,
      arrows: false,
      beforeChange: (_: number, next: number) => setSlideIndex(next + 1),
    }),
    []
  );

  const handleNext = () => {
    (slider as Slider).slickNext();
  };
  const handlePrev = () => {
    (slider as Slider).slickPrev();
  };
  const handleShuffle = () => {
    const random = Math.floor(Math.random() * data.length); // 0 ~ data.length
    (slider as Slider).slickGoTo(random);
  };

  return (
    <>
      <Slider
        asNavFor={slider}
        ref={(sliderRef: Slider) => setSlider(sliderRef)}
        {...settings}
      >
        {data.map((item: Vocabulary) => (
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
