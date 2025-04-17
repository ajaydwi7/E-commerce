import React, { useState, useEffect, useRef } from 'react';
import './ImageComparisonSlider.css';

const ImageComparisonSlider = ({ beforeImage, afterImage }) => {
  const [sliderValue, setSliderValue] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const overlayRef = useRef(null);
  const comparisonLineRef = useRef(null);
  const handleRef = useRef(null);
  const sliderRef = useRef(null);
  const directionRef = useRef(1);

  const handleSliderChange = (e) => {
    const value = e.target.value;
    setSliderValue(value);
  };

  useEffect(() => {
    const overlay = overlayRef.current;
    const comparisonLine = comparisonLineRef.current;
    const handle = handleRef.current;

    overlay.style.width = `${sliderValue}%`;
    comparisonLine.style.left = `${sliderValue}%`;
    handle.style.left = `${sliderValue}%`;
  }, [sliderValue]);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const slider = sliderRef.current;
    const rect = slider.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newValue = (offsetX / rect.width) * 100;
    setSliderValue(Math.min(Math.max(newValue, 0), 100));
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging && !isHovered) {
        setSliderValue((prev) => {
          let newValue = prev + directionRef.current;
          if (newValue >= 100 || newValue <= 0) {
            directionRef.current *= -1;
          }
          return Math.min(Math.max(newValue, 0), 100);
        });
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isDragging, isHovered]);

  // Add touch events to ImageComparisonSlider.jsx
  useEffect(() => {
    const handleTouchMove = (e) => {
      if (!isDragging) return;
      const slider = sliderRef.current;
      const rect = slider.getBoundingClientRect();
      const offsetX = e.touches[0].clientX - rect.left;
      const newValue = (offsetX / rect.width) * 100;
      setSliderValue(Math.min(Math.max(newValue, 0), 100));
    };

    sliderRef.current.addEventListener('touchmove', handleTouchMove);
    return () => {
      sliderRef.current?.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isDragging]);

  useEffect(() => {
    const slider = sliderRef.current;
    slider.addEventListener('mousemove', handleMouseMove);
    slider.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    slider.addEventListener('mouseenter', () => setIsHovered(true));
    slider.addEventListener('mouseleave', () => setIsHovered(false));

    return () => {
      slider.removeEventListener('mousemove', handleMouseMove);
      slider.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      slider.removeEventListener('mouseenter', () => setIsHovered(true));
      slider.removeEventListener('mouseleave', () => setIsHovered(false));
    };
  }, [isDragging]);

  return (
    <div className="comparison-image-slider" ref={sliderRef}>
      {/* Image Containers */}
      <div className="comparison-image-wrapper">
        <img src={afterImage} alt="After" className="after-image" loading='lazy' />
      </div>
      <div className="comparison-image-wrapper comparison-overlay" ref={overlayRef}>
        <img src={beforeImage} alt="Before" className="before-image" loading='lazy' />
      </div>

      {/* Comparison Line */}
      <div className="comparison-line" ref={comparisonLineRef}></div>

      {/* Handle */}
      <div className="comparison-handle" ref={handleRef}>
        <div className="handle-circle"></div>
      </div>

      {/* Slider Input */}
      <input
        type="range"
        min="0"
        max="100"
        value={sliderValue}
        className="img-slider"
        onChange={handleSliderChange}
        aria-label="Image Comparison Slider"
      />
    </div>
  );
};

export default ImageComparisonSlider;
