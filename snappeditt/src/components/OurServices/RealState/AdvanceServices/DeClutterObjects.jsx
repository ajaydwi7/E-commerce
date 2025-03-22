import React, { useState } from 'react';
import ImageComparisonSlider from '@/components/GlobalComponents/ImageComparisonSlider/ImageComparisonSlider';
import './AdvanceRight.css';
import { useNavigate } from 'react-router-dom';
import { CircleCheck, CircleX } from "lucide-react";


const DeClutterObjects = () => {
  const navigate = useNavigate()

  const service = {
    title: "De-Clutter Objects",
    price: "$0.00 - $5.00/Image",
    description: "Get rid of unwanted objects from the images virtually to make the property more appealing with our De-Clutter Object service.",
    buttonUrl: '/services/real-estate/digital-declutter',
    features: [
      { name: 'Wires & Cords Removal', included: true },
      { name: 'Photographers & Tripod Reflection Removal', included: true },
      { name: 'Agent Sign Board, Garbage Bin Removal', included: true },
      { name: 'Swimming Pool Hose Removal', included: true },
      { name: 'Furniture, other objects Removal', included: true },
    ],
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
        {/* Content Area on the Left */}
        <div className="details-area">
          <h4 className="details-title">{service.title}</h4>
          <p className="price-range">{service.price}</p>
          <button onClick={() => (handleAddToCartBtn(service))} className="add-to-cart-btn">Add to Cart</button>
          <button onClick={() => (handleAddToCartBtn(service))} className="details-btn">
            More Details</button>
          <p className="service-description">{service.description}</p>
          <ul className="features-list">
            {service.features.map((feature, index) => (
              <li key={index}>
                <span className='pr-1'>{feature.included ? <CircleCheck className='text-green-500' /> : <CircleX className='text-primaryRed' />}</span> {feature.name}
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

export default DeClutterObjects;
