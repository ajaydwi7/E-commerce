import React, { useState } from 'react';
import ImageComparisonSlider from '@/components/GlobalComponents/ImageComparisonSlider/ImageComparisonSlider';
import './AdvanceServices.css';
import { useNavigate } from 'react-router-dom';
import { CircleCheck, CircleX } from "lucide-react";

const DayToDusk = () => {
  const navigate = useNavigate()

  const service = {
    title: "Day To Dusk",
    price: "$4.00/Image",
    description: "With our Virtual Twilight service, we convert your day shot of your exterior property to a stunning and beautiful dusk/ twilight shot.",
    buttonUrl: '/services/real-estate/day-to-dusk',
    features: [
      { name: 'Outdoor Sky Replacement', included: true },
      { name: 'Brightness & Contrast Adjustment', included: true },
      { name: 'Turn On Lights', included: true },
      { name: 'Shadow Removal', included: true },
      { name: 'Vertical & Horizontal Straightening', included: true },

    ],
    // Multiple sets of image pairs for the comparison slider
    images: [
      [
        new URL('@/assets/images/Day-to-Dusk-SHP-Raw-1.jpg', import.meta.url).href,
        new URL('@/assets/images/Day-to-Dusk-SHP-Corrected-1.jpg', import.meta.url).href
      ],
      [
        new URL('@/assets/images/Day-to-Dusk-SHP-Raw-2.jpg', import.meta.url).href,
        new URL('@/assets/images/Day-to-Dusk-SHP-Corrected-2.jpg', import.meta.url).href
      ],
      [
        new URL('@/assets/images/Day-to-Dusk-SHP-Raw-3.jpg', import.meta.url).href,
        new URL('@/assets/images/Day-to-Dusk-SHP-Corrected-3.jpg', import.meta.url).href
      ]
    ]
  };

  const handleAddToCartBtn = (service) => {
    // Add your cart logic here if needed
    navigate(service.buttonUrl); // Navigate to the service's URL
  };
  // State to manage which image slider is currently active
  const [currentSlide, setCurrentSlide] = useState(0);

  const changeSlide = (index) => {
    setCurrentSlide(index);
  };


  return (
    <div className="advance-container">
      <h3 className="advance-title">Advanced Services We Provide...</h3>

      <div className="carousel-container">
        <div className="carousel-content">
          {/* Image Comparison Slider Carousel */}
          <div className="image-slider-container">
            <ImageComparisonSlider
              beforeImage={service.images[currentSlide][0]} // Before image (first in the pair)
              afterImage={service.images[currentSlide][1]}  // After image (second in the pair)
            />
            {/* Dots for controlling the image comparison slider */}
            <div className="dots">
              {service.images.map((_, index) => (
                <span
                  key={index}
                  className={`dot ${currentSlide === index ? 'active' : ''}`}
                  onClick={() => changeSlide(index)}
                />
              ))}
            </div>
          </div>
          <div className="content-area">
            <h4 className='content-area-title'>{service.title}</h4>
            <p className="price">{service.price}</p>
            <button onClick={() => (handleAddToCartBtn(service))} className="add-to-cart-btn">
              Add to Cart</button>
            <button onClick={() => (handleAddToCartBtn(service))} className="details-btn">
              More Details
            </button>
            <p className="description">{service.description}</p>
            <ul className="features-list">
              {service.features.map((feature, index) => (
                <li key={index}>
                  <span className='pr-1'>{feature.included ? <CircleCheck className='text-green-500' /> : <CircleX className='text-primaryRed' />}</span> {feature.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayToDusk;
