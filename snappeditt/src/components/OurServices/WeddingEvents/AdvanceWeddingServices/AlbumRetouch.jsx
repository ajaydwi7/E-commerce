import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import ImageComparisonSlider from '@/components/GlobalComponents/ImageComparisonSlider/ImageComparisonSlider';
import { CircleCheck, CircleX } from 'lucide-react';

const AlbumRetouch = () => {
  const navigate = useNavigate()
  const service = {
    title: "Album Retouch",
    price: "$2.50/Spread",
    description: "In this service we will retouch the images from album spread/pages based on your style/requirement. It’s a complete custom process and detailed instructions would be required to process the images. We work on PSD files.",
    buttonUrl: '/services/wedding/album-retouch/',
    features: [
      { name: 'Basic Retouching', included: true },
      { name: 'Skin Retouching', included: true },
      { name: 'Dress Crease Removal', included: true },
      { name: 'Background Repair', included: true },
      { name: 'Teeth Whitening', included: true },
      { name: 'Custom Requirements', included: true },
    ],
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

  const [currentSlide, setCurrentSlide] = useState(0);

  const changeSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="de-clutter-container">

      <div className="carousel-section">
        {/* Content Area on the Left */}
        <div className="details-area">
          <h4 className="details-title">{service.title}</h4>
          <p className="price-range">{service.price}</p>
          <button onClick={() => (handleAddToCartBtn(service))} className="add-to-cart-btn">Add to Cart</button>
          <button onClick={() => (handleAddToCartBtn(service))} className="details-btn">More Details</button>
          <p className="service-description">{service.description}</p>
          <ul className="features-list">
            {service.features.map((feature, index) => (
              <li key={index}>
                <span className='px-1'>{feature.included ? <CircleCheck className='text-green-500' /> : <CircleX className='text-primaryRed' />}</span> {feature.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Image Comparison Slider on the Right */}
        <div className="image-slider-wrapper">
          <ImageComparisonSlider
            beforeImage={service.images[currentSlide][0]} // Before image (first in the pair)
            afterImage={service.images[currentSlide][1]}  // After image (second in the pair)
          />
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

export default AlbumRetouch;
