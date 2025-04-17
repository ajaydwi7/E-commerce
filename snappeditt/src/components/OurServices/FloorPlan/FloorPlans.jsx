import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { CircleCheck, CircleX } from "lucide-react";

const FloorPlan = () => {
  const navigate = useNavigate()
  const service = {
    title: "Floor Plans",
    price: "$10.00 – $18.00/Floor",
    description: "Present your buyers with Floor Plans that engages them more with the property. Our professional and experienced team can create a 2D/3D floor plan for you based on the rough sketch and detailed measurements. Below are the types of floor plans.",
    buttonUrl: '/services/floor-plan/2d-floor-plan',
    features: [
      { name: '2D Black and White floor plan', included: true },
      { name: '2D Black and White floor plan with Furniture', included: true },
      { name: '2D Color floor plan', included: true },
      { name: '2D Color floor plan with Furniture', included: true },
      { name: '2D Textured floor plan', included: true },
      { name: '2D Textured floor plan with Furniture', included: true },

    ],
    // Multiple sets of image pairs for the comparison slider
    images: [
      [
        new URL('@/assets/images/Day-to-Dusk-SHP-Raw-1.jpg', import.meta.url).href,
      ],
      [
        new URL('@/assets/images/Day-to-Dusk-SHP-Raw-2.jpg', import.meta.url).href,
      ],
      [
        new URL('@/assets/images/Day-to-Dusk-SHP-Raw-3.jpg', import.meta.url).href,
      ]
    ]
  };

  const handleAddToCartBtn = (service) => {
    // Add your cart logic here if needed
    navigate(service.buttonUrl); // Navigate to the service's URL
  };

  const [currentSlide, setCurrentSlide] = useState(0);

  const changeSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % service.images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + service.images.length) % service.images.length);
  };

  const underlineRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (underlineRef.current) {
        const newWidth = Math.min(50 + scrollPosition / 10, 350); // Adjust size based on scroll
        underlineRef.current.style.width = `${newWidth}px`;
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="advance-container">
      <div className="carousel-container">
        <div className="carousel-content">
          {/* Image Comparison Slider Carousel */}
          {/* Image Carousel */}
          <div className="image-slider-container">
            <img src={service.images[currentSlide][0]} alt="Raw" className="carousel-image" loading='lazy' />
            <FaArrowLeft onClick={prevSlide} className="carousel-control prev" size={30} /> {/* Use arrow icon */}
            <FaArrowRight onClick={nextSlide} className="carousel-control next" size={30} /> {/* Use arrow icon */}
            {/* Dots for controlling the image carousel */}
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
            <button onClick={() => (handleAddToCartBtn(service))} className="add-to-cart-btn">Add to Cart</button>
            <button onClick={() => (handleAddToCartBtn(service))} className="details-btn">
              More Details</button>
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

export default FloorPlan;
