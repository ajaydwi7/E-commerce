import React from 'react';
import './InfoSection.css';  // Import CSS for styling

const InfoSection = () => {
  return (
    <div className="info-container">
      <div className="left-info">
        <div className="info-box">
          <h2 className="info-title">Unbreakable <span className='infotitle-text'>Trust</span></h2>
          <p className="info-description">
            SnappEdit is a professional editing and post-production studio that delivers consistent results with a personal touch.<br />
            We know how time-consuming and draining editing can be after real estate or wedding shoots—that’s where we come in to save your time and boost your productivity.
            <br />
            Whether you're new to outsourcing post-production or looking for a better option, we're here to make it easier for you!
          </p>
        </div>
      </div>

      {/* Right Content */}
      <div className="right-info">
        {/* Red Text Section */}
        <div className="content-box">
          <h2 >Let's Discover A Brand-New Dimension In Photo Editing & Retouching Services.</h2>
          <p>
            We are a leading outsourcing Professional Editing / Retouching service provider from Mumbai, India. We are currently serving a wide range of clients in diverse sectors such as Digital Studios, Photographers, Photography companies, Ad agencies, Real Estate agencies, E-Commerce, Fashion, etc. from all around the globe at cost-effective rates.
          </p>
          <a className="read-more-btn" href='/about-us' >Read More</a>
        </div>
      </div>
      <div className="custom-shape-divider-bottom-1734074870">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="shape-fill"></path>
        </svg>
      </div>
    </div>

  );
};

export default InfoSection;
