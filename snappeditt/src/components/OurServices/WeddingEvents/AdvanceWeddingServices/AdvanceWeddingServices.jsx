import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import ImageComparisonSlider from '@/components/GlobalComponents/ImageComparisonSlider/ImageComparisonSlider';
import { CircleCheck, CircleX } from 'lucide-react';



const WeddingRetouch = () => {
  const navigate = useNavigate()
  const service = {
    title: "Wedding Retouch",
    price: "$1.00/Image",
    description: "Get your best shots retouched in detailed and add beauty to your work. Just send us your photos and our team of experts will do all the post-production work for you.",
    buttonUrl: '/services/wedding/wedding-events-retouch',
    features: [
      { name: 'Basic Retouching', included: true },
      { name: 'Blemishes Removal - Basic & Detailed', included: true },
      { name: 'Stray Hair Removal', included: true },
      { name: 'Teeth Whitening', included: true },
      { name: 'Dark Circle Removal', included: true },
      { name: 'Dress Crease Removal', included: true },
      { name: 'Custom Requirements', included: true },

    ],
    // Multiple sets of image pairs for the comparison slider
    images: [
      [
        new URL('@/assets/images/Album-Retouch-SHP-Raw-1-scaled.jpg', import.meta.url).href,
        new URL('@/assets/images/Album-Retouch-SHP-Corrected-1-scaled.jpg', import.meta.url).href
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
            <button onClick={() => (handleAddToCartBtn(service))}
              className="add-to-cart-btn">Add to Cart</button>
            <button onClick={() => (handleAddToCartBtn(service))} className="details-btn">More Details</button>
            <p className="description">{service.description}</p>
            <ul className="features-list">
              {service.features.map((feature, index) => (
                <li key={index}>
                  <span className='px-1'>{feature.included ? <CircleCheck className='text-green-500' /> : <CircleX className='text-primaryRed' />}</span> {feature.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeddingRetouch;
