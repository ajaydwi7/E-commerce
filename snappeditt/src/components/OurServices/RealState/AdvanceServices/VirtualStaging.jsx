import React, { useState } from 'react';
import ImageComparisonSlider from '@/components/GlobalComponents/ImageComparisonSlider/ImageComparisonSlider';
import { useNavigate } from 'react-router-dom';

const VirtualStaging = () => {
  const navigate = useNavigate();
  const service = {
    title: "Virtual Staging",
    price: "$0.00 – $25.00/Image",
    description: "Our professional editors will add furniture virtually to the empty room image. With this service, it allows buyers to visualize themselves in the home. We use Modern, Contemporary, Traditional, Urban style furniture depending on the client's requirement.",
    buttonUrl: '/services/real-estate/virtual-staging',
    images: [
      [
        new URL('@/assets/images/Declutter-SPH-Raw-1.jpg', import.meta.url).href,
        new URL('@/assets/images/Declutter-SPH-Corrected-1.jpg', import.meta.url).href
      ],
      [
        new URL('@/assets/images/Declutter-SPH-Raw-2.jpg', import.meta.url).href,
        new URL('@/assets/images/Declutter-SPH-Corrected-2.jpg', import.meta.url).href
      ],
      [
        new URL('@/assets/images/Declutter-SPH-Corrected-3.jpg', import.meta.url).href,
        new URL('@/assets/images/Declutter-SPH-Raw-3.jpg', import.meta.url).href
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

  return (
    <div className="de-clutter-container">
      <div className="carousel-section">
        <div className="details-area">
          <h4 className="details-title">{service.title}</h4>
          <p className="price-range">{service.price}</p>
          <button onClick={() => (handleAddToCartBtn(service))} className="add-to-cart-btn">Add to Cart</button>
          <button onClick={() => (handleAddToCartBtn(service))} className="details-btn">More Details</button>
          <p className="service-description">{service.description}</p>
        </div>

        {/* Image Comparison Slider */}
        <div className="image-slider-wrapper">
          <ImageComparisonSlider
            beforeImage={service.images[currentSlide][0]} // Before image (first in the pair)
            afterImage={service.images[currentSlide][1]}  // After image (second in the pair)
          />

          {/* Dot Indicators */}
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

export default VirtualStaging;
