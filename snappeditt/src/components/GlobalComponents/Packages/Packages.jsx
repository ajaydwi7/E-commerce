import React, { useState, useEffect } from "react";
import Tabs from "@/components/GlobalComponents/Tabs/Tabs";
import ImageComparisonSlider from "@/components/GlobalComponents/ImageComparisonSlider/ImageComparisonSlider";
import RightSideCard from "@/components/GlobalComponents/RightSideCard/RightSideCard";
import "./Packages.css";

const Packages = ({ tabNames, tabsContent, title }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Safely access current content
  const currentContent = tabsContent?.[activeTab];

  // Safely handle images array
  const images = currentContent?.images || [];

  // Reset slide when active tab changes
  React.useEffect(() => {
    setCurrentSlide(0);
  }, [activeTab]);

  useEffect(() => {
    // Preload images when currentContent changes
    if (currentContent?.images) {
      currentContent.images.forEach((pair) => {
        pair.forEach((url) => {
          const img = new Image();
          img.src = url;
        });
      });
    }
  }, [currentContent]);

  const changeSlide = (index) => {
    setCurrentSlide(index);
  };

  // Add mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="main-container">
      <h3 className="packages-title">{title}</h3>
      {!isMobile ? (
        // Desktop layout
        <>
          <Tabs tabs={tabNames} activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="content-wrapper">
            {/* Carousel Section */}
            <div className="carousel">
              <div className="carousel-slide">
                {images.length > 0 && images[currentSlide] ? (
                  images[currentSlide].length === 2 ? (
                    // Show comparison slider if two images exist
                    <ImageComparisonSlider
                      key={`${activeTab}-${currentSlide}`}
                      beforeImage={images[currentSlide][0]}
                      afterImage={images[currentSlide][1]}
                    />
                  ) : images[currentSlide].length === 1 ? (
                    // Show single image if only one exists
                    <img
                      src={images[currentSlide][0]}
                      alt="Service preview"
                      className="single-image"
                      loading="lazy"
                    />
                  ) : (
                    <p>No images available</p>
                  )
                ) : (
                  <p>No images available</p>
                )}
              </div>

              {/* Dot Indicators */}
              <div className="dots bottom-dots">
                {images.map((_, index) => (
                  <span
                    key={index}
                    className={`dot ${currentSlide === index ? "active" : ""}`}
                    onClick={() => changeSlide(index)}
                  />
                ))}
              </div>
            </div>

            {/* Right Side Card */}
            {currentContent && (
              <div className="right-side-card-wrapper">
                <RightSideCard
                  title={currentContent.title}
                  description={currentContent.description}
                  price={currentContent.price}
                  features={currentContent.features}
                  addToCartBtn={currentContent.addToCartBtn}
                  moreBtn={currentContent.moreBtn}
                />
              </div>
            )}
          </div>
        </>
      ) : (
        // Mobile accordion layout
        <div className="mobile-tabs-container">
          {tabNames.map((tabName, index) => (
            <div key={index} className="mobile-tab-item">
              <button
                className={`mobile-tab-header ${activeTab === index ? 'active' : ''}`}
                onClick={() => setActiveTab(index === activeTab ? -1 : index)}
              >
                {tabName}
                <span className="mobile-tab-indicator">
                  {activeTab === index ? '−' : '+'}
                </span>
              </button>

              {activeTab === index && (
                <div className="mobile-tab-content">
                  <div className="carousel">
                    {/* Mobile content here */}
                    <div className="carousel-slide">
                      {images.length > 0 && images[currentSlide]?.length === 2 ? (
                        <ImageComparisonSlider
                          key={`${activeTab}-${currentSlide}`}
                          beforeImage={images[currentSlide][0]}
                          afterImage={images[currentSlide][1]}
                        />
                      ) : (
                        <p>No images available</p>
                      )}
                    </div>

                    <div className="dots bottom-dots">
                      {images.map((_, idx) => (
                        <span
                          key={idx}
                          className={`dot ${currentSlide === idx ? "active" : ""}`}
                          onClick={() => changeSlide(idx)}
                        />
                      ))}
                    </div>
                  </div>

                  {tabsContent[index] && (
                    <RightSideCard
                      title={tabsContent[index].title}
                      description={tabsContent[index].description}
                      price={tabsContent[index].price}
                      features={tabsContent[index].features}
                      addToCartBtn={tabsContent[index].addToCartBtn}
                      moreBtn={tabsContent[index].moreBtn}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Packages;
