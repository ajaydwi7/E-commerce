import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const OfferServices = () => {
  const service = {
    title: "3D Floor Plans",
    price: "$0.00 – $60.00/Image",
    description: "Unlike a 2D Floor Plan, a 3D Floor Plan includes perspective which makes it easier for you to understand the size and layout of a space. 3D Floor Plan renderings give depth and detail to traditionally used 2D floor plans. These types of floor cut renderings allow potential buyers to envision themselves in the home or building and understand the spatial arrangement of various areas within the property. 3D Floor Plans are useful for real estate marketing, home staging, and home design projects.",
    buttonUrl: '/services/3d-services/3d-floor-plan',
    images: [
      [
        new URL('@/assets/images/3D-Floor-Plan-1.jpg', import.meta.url).href
      ],
      [
        new URL('@/assets/images/3D-Floor-Plan-2.jpg', import.meta.url).href
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
      <h3 className="packages-title">Services we provide.....
        <span ref={underlineRef} className="underline"></span>
      </h3>
      <div className="carousel-container">
        <div className="carousel-content">
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
            <button className="add-to-cart-btn"><Link to={service.buttonUrl} className='
              text-black'>Add to Cart</Link></button>
            <button className="details-btn"><Link to={service.buttonUrl} className='
              text-black'>More Details</Link></button>
            <p className="description">{service.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferServices;

