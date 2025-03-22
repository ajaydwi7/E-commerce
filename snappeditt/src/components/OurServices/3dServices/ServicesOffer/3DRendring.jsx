import React, { useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
const ThreeDRendring = () => {
  const service = {
    title: "3D Rendering",
    price: "$0.00 – $250.00/Image",
    description: "Snapp Editt offers offers a variety of 3D rendering services to create visualizations that bring your projects to life right before your eyes. We can create 3D architectural renderings for construction, real estate and building projects, 3D interior renderings for home renovation projects, and much more!",
    buttonUrl: '/services/3d-services/3d-rendering',
    images: [
      [
        new URL('@/assets/images/3D-Rendering-1.jpg', import.meta.url).href,

      ],
      [
        new URL('@/assets/images/3D-Rendering-2.jpg', import.meta.url).href,

      ],
      [
        new URL('@/assets/images/3D-Rendering-3.jpg', import.meta.url).href
      ]
    ]
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

  return (
    <div className="de-clutter-container">

      <div className="carousel-section">
        {/* Content Area on the Left */}
        <div className="details-area">
          <h4 className="details-title">{service.title}</h4>
          <p className="price-range">{service.price}</p>
          <button className="add-to-cart-btn"><Link to={service.buttonUrl} className='
              text-black'>Add to Cart</Link></button>
          <button className="details-btn"><Link to={service.buttonUrl} className='
              text-black'>More Details</Link></button>
          <p className="service-description">{service.description}</p>
        </div>

        {/* Image Comparison Slider on the Right */}
        <div className="image-slider-wrapper">
          <img src={service.images[currentSlide][0]} alt="Raw" className="carousel-image" />
          <FaArrowLeft onClick={prevSlide} className="carousel-control prev" size={30} /> {/* Use arrow icon */}
          <FaArrowRight onClick={nextSlide} className="carousel-control next" size={30} /> {/* Use arrow icon */}
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
      </div>
    </div>
  );
};

export default ThreeDRendring;
