import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Tabs from "@/components/GlobalComponents/Tabs/Tabs";
import ImageComparisonSlider from "@/components/GlobalComponents/ImageComparisonSlider/ImageComparisonSlider";
import "./OurServices.css";

import { CircleArrowRight } from "lucide-react";


import {
  Exposure,
  Manual,
  Retouching,
  Floor,
  Virtual,
  DayToDusk,
  ColorBalance,
  Cropping,
  Culling,
  Preset,
  Dodging,
  Address,
  ECommerce,
  Apparel,
  Jewelry,
  Fashion,
  Composite,
  GhostMannequin,
  Pregnancy,
  Newborn,
  Sports,
  Screen,
  Extraction,
  ClippingPath,
} from "./comparisonSlider";

const OurServices = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [lineWidth, setLineWidth] = useState(40); // Start with 40%
  const [lastScrollY, setLastScrollY] = useState(window.scrollY); // Track last scroll position

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // In the useEffect scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;

      // Slow down the animation by reducing the sensitivity
      setLineWidth(prevWidth => {
        let newWidth = prevWidth;
        if (scrollDelta > 0) { // Scrolling down
          newWidth = Math.min(prevWidth + 0.5, 40); // Reduced from +2 to +0.5
        } else if (scrollDelta < 0) { // Scrolling up
          newWidth = Math.max(prevWidth - 0.5, 0); // Reduced from -2 to -0.5
        }
        return newWidth;
      });

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Reset currentSlide to 0 whenever the active tab changes
  React.useEffect(() => {
    setCurrentSlide(0);
  }, [activeTab]);

  const tabs = [
    "Real Estate",
    "3D Services",
    "Wedding Events",
    "Product eCommerce",
    "People Retouching",
    "Clipping Path & Extraction",
  ];

  const tabDetails = [
    {
      description:
        "Successful real estate sales rely heavily on great photographs that persuade buyers to hit that BUY button. Leverage our expertise to manage your image inventory with a turnaround time of fewer than 12 hours with consistent results.",
      iconItems: [
        { icon: Exposure, text: "Single Exposure" },
        { icon: Manual, text: "Manual Blending" },
        { icon: Retouching, text: "Retouching" },
        { icon: Floor, text: "Floor Plans" },
        { icon: Virtual, text: "Virtual Staging" },
        { icon: DayToDusk, text: "Day to Dusk" },
      ],
      buttonText: "Check Our Packages",
      buttonLink: "/real-estate",
      images: [
        [new URL('@/assets/images/Real-Estate-Manual_Blending-Raw-3.jpg', import.meta.url).href,
        new URL('@/assets/images/Real-Estate-Manual_Blending-Corrected-3.jpg', import.meta.url).href],
        [new URL('@/assets/images/Real-Estate-Architechture_Retouching-Raw-2.jpg', import.meta.url).href,
        new URL('@/assets/images/Real-Estate-Architechture_Retouching-Corrected-2.jpg', import.meta.url).href],
      ],

    },
    {
      description:
        "Snapp Editt specialize in creating high quality Architectural 3D Rendering Services, Interior Rendering and 3D floor plans – delivered quickly, and cost effectively. We bring your vision to life! Our team will help you to put your imagination into practical mock-up with the help of 3D realistic rendering.",
      iconItems: [
        { icon: Floor, text: "3D Floor Plans" },
        { icon: Virtual, text: "3D Rendering" },
      ],
      buttonText: "Check Our Packages",
      buttonLink: "/3d-services",
      images: [
        [new URL('@/assets/images/3D-Rendering-P-3.jpg', import.meta.url).href, null],
        [new URL('@/assets/images/3D-Rendering-1.jpg', import.meta.url).href, null

        ],
        [new URL('@/assets/images/3D-Rendering-3.jpg', import.meta.url).href, null

        ],
      ],
    },
    {
      description:
        "Are you a professional Events or Wedding photographer looking to learn and expand your photography business? Then you’ve come to the right place. Let our professional editor handle your burden of editing/culling thousands of images matching exactly your style to make your experience fast, easy, and consistent.",
      iconItems: [
        { icon: ColorBalance, text: "Color Balance" },
        { icon: Address, text: "Album Retouch" },
        { icon: Cropping, text: "Cropping & Straightening" },
        { icon: Culling, text: "Culling" },
        { icon: Preset, text: "Preset" },
        { icon: Dodging, text: "Dodging & Burning" },
      ],
      buttonText: "Check Our Packages",
      buttonLink: "/wedding-events",
      images: [
        [new URL('@/assets/images/Wedding-Events-HP-Raw-1.jpg', import.meta.url).href,
        new URL('@/assets/images/Wedding-Events-HP-Corrected-1.jpg', import.meta.url).href,
        ],

        [new URL('@/assets/images/Wedding-Events-HP-Raw-2.jpg', import.meta.url).href,
        new URL('@/assets/images/Wedding-Events-HP-Corrected-2.jpg', import.meta.url).href
        ],
      ],
    },
    {
      description:
        "Online shopping has improved the lives of consumers all over the world and has also helped business owners to run the business efficiently. By enrolling in our Product Retouching services will help your business to sell products to the targeted audience even without touching or feeling it through an eCommerce portal or virtually keeping your business a step ahead of the competitors.",
      iconItems: [
        { icon: ECommerce, text: "eCommerce Retouching" },
        { icon: Apparel, text: "Apparel Retouching" },
        { icon: Jewelry, text: "Jewelry Retouching" },
        { icon: Fashion, text: "Fashion Retouching" },
        { icon: Composite, text: "Composite Retouching" },
        { icon: GhostMannequin, text: "Ghost Mannequin" },
      ],
      buttonText: "Check Our Packages",
      buttonLink: "/products-ecommerce",
      images: [
        [new URL('@/assets/images/Product-eComm-HP-Raw-1-2048x1365.jpg', import.meta.url).href,
        new URL('@/assets/images/Product-eComm-HP-Corrected-1-2048x1365.jpg', import.meta.url).href,
        ],

        [new URL('@/assets/images/Product-eComm-SHP-Raw-3.jpg', import.meta.url).href,
        new URL('@/assets/images/Product-eComm-SHP-Corrected-3.png', import.meta.url).href
        ],
      ],
    },
    {
      description:
        "Are you not able to deliver the retouched photos as you are busy with your photoshoot schedule and looking for someone to retouch photos? If yes, then you are at the correct place our retouchers can help you reduce your workload and produce the images matching exactly your studio style by enrolling in our People Retouching editing service.",
      iconItems: [
        { icon: Pregnancy, text: "Pregnancy Retouching" },
        { icon: Newborn, text: "Newborn Retouching" },
        { icon: Sports, text: "Sports Retouching" },
        { icon: GhostMannequin, text: "Portrait Retouching" },
        { icon: Composite, text: "Composite Retouching" },
        { icon: Fashion, text: "Fashion Retouching" },
      ],
      buttonText: "Check Our Packages",
      buttonLink: "/people-retouching",
      images: [
        [new URL('@/assets/images/Baby-SPH-Raw-3.jpg', import.meta.url).href,
        new URL('@/assets/images/Baby-SPH-Corrected-3.jpg', import.meta.url).href,
        ],
        [new URL('@/assets/images/Baby-P-Raw-1-scaled.jpg', import.meta.url).href,
        new URL('@/assets/images/Baby-P-Corrected-1-scaled.jpg', import.meta.url).href
        ],
        [new URL('@/assets/images/Pregnacy-SHP-Raw-2.jpg', import.meta.url).href,
        new URL('@/assets/images/Pregnacy-SHP-Corrected-2.jpg', import.meta.url).href
        ],
      ],
    },
    {
      description:
        "Are you failing to deliver corrected images to your client due to back to back photoshoots? If yes, we can assure you to deliver photos where the background needs to be removed or make transparent for e-commerce product photos. We can also help you create path clipping for pieces of jewelry.",
      iconItems: [

        { icon: Preset, text: "Background Removal" },
        { icon: Screen, text: "Blue Screen Removal​" },
        { icon: Screen, text: "Green Screen Removal" },
        { icon: Extraction, text: "Extraction" },
        { icon: ClippingPath, text: "Clipping Path" },
        { icon: ClippingPath, text: "CP with Shadows & Reflection" },
      ],
      buttonText: "Check Our Packages",
      buttonLink: "/clipping-path-extraction",
      images: [
        [new URL('@/assets/images/Clipping-Path-HP-RAW-1.jpg', import.meta.url).href,
        new URL('@/assets/images/Clipping-Path-HP-Corrected-1.jpg', import.meta.url).href
        ],
        [new URL('@/assets/images/Sports-RAW-scaled.jpg', import.meta.url).href,
        new URL('@/assets/images/Sport-Done-scaled.jpg', import.meta.url).href
        ],

        [new URL('@/assets/images/Clipping-Path-HP-RAW-2-2048x1363.jpg', import.meta.url).href,
        new URL('@/assets/images/Clipping-Path-HP-Corrected-2-2048x1363.jpg', import.meta.url).href
        ],
      ],
    },
    // Add more tab details as required
  ];

  const currentContent = tabDetails[activeTab];

  const changeSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div id="services" className="container">
      <h2 className="service-title">Services We Offer......</h2>
      {!isMobile && (
        <div
          className="dynamic-line"
          style={{
            width: `${lineWidth}%`,
            transition: "width 0.5s ease-in-out",
          }}
        ></div>
      )}

      {/* Mobile Accordion */}
      {isMobile ? (
        <div className="mobile-tabs">
          {tabs.map((tab, index) => (
            <div
              key={index}
              className={`mobile-tab-item ${activeTab === index ? 'active' : ''}`}
            >
              <button
                className="mobile-tab-header"
                onClick={() => setActiveTab(activeTab === index ? -1 : index)}
              >
                {tab}
                <span className="mobile-tab-indicator">
                  {activeTab === index ? '−' : '+'}
                </span>
              </button>

              {activeTab === index && (
                <div className="mobile-tab-content">
                  <div className="content-columns">
                    <div className="left-column">
                      <p>{tabDetails[index].description}</p>
                      <div className="icon-items">
                        {tabDetails[index].iconItems.map((item, idx) => (
                          <div className="icon-item" key={idx}>
                            <img src={item.icon} alt={item.text} className="svg-icon" loading="lazy" />
                            {item.text}
                          </div>
                        ))}
                      </div>
                      <button className="check-packages-btn">
                        <Link to={tabDetails[index].buttonLink}>
                          {tabDetails[index].buttonText}
                          <CircleArrowRight className="inline px-{2px}" />
                        </Link>
                      </button>
                    </div>

                    <div className="right-column">
                      <div className="carousel">
                        <div className="carousel-slide">
                          {tabDetails[index].images[currentSlide]?.[0] && (
                            tabDetails[index].images[currentSlide][1] ? (
                              <ImageComparisonSlider
                                beforeImage={tabDetails[index].images[currentSlide][0]}
                                afterImage={tabDetails[index].images[currentSlide][1]}
                              />
                            ) : (
                              <img
                                src={tabDetails[index].images[currentSlide][0]}
                                alt="Service"
                                className="single-image"
                                loading="lazy"
                              />
                            )
                          )}
                        </div>
                        <div className="dots bottom-dots">
                          {tabDetails[index].images.map((_, idx) => (
                            <span
                              key={idx}
                              className={`dot ${currentSlide === idx ? "active" : ""}`}
                              onClick={() => changeSlide(idx)}
                            ></span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

          ))}
        </div>
      ) : (
        /* Desktop Layout */
        <>

          {/* Tabs Component */}
          <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="content-wrapper">
            {/* Left Column */}
            <div className="left-column">
              <h3>{currentContent.title}</h3>
              <p>{currentContent.description}</p>
              <div className="icon-items">
                {currentContent.iconItems.map((item, index) => (
                  <div className="icon-item" key={index}>
                    <img src={item.icon} alt={item.text} className="svg-icon" loading="lazy" />
                    {item.text}
                  </div>
                ))}
              </div>
              <button className="check-packages-btn">
                <Link to={currentContent.buttonLink}>{currentContent.buttonText}<CircleArrowRight className="inline px-{2px}" /></Link>
              </button>
            </div>

            {/* Right Column with Slider */}
            <div className="right-column">
              <div className="carousel">
                <div className="carousel-slide">
                  {currentContent?.images?.[currentSlide]?.[0] ? (
                    currentContent.images[currentSlide].length === 1 || !currentContent.images[currentSlide][1] ? (
                      // Render a single image directly
                      <img
                        src={currentContent.images[currentSlide][0]}
                        alt="Service Image"
                        className="single-image"
                        loading="lazy"
                      />
                    ) : (
                      <ImageComparisonSlider
                        beforeImage={currentContent.images[currentSlide][0]}
                        afterImage={currentContent.images[currentSlide][1]}
                      />

                    )
                  ) : (
                    // Fallback if no images are available
                    <p>No images available</p>
                  )}
                </div>

                {/* Dot Indicators */}
                <div className="dots bottom-dots">
                  {currentContent.images.map((_, index) => (
                    <span
                      key={index}
                      className={`dot ${currentSlide === index ? "active" : ""}`}
                      onClick={() => changeSlide(index)}
                    ></span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OurServices;
