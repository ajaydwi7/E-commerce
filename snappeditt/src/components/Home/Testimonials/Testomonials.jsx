import React, { useState, useEffect, useRef } from 'react';
import './TestimonialSlider.css';
import AvatarMan from '../../../assets/images/avatar-man.webp';
import AvatarWoman from '../../../assets/images/avatar-women.webp';

const TestimonialSection = () => {
  const testimonials = [
    {
      img: AvatarMan,
      quote: "I first engaged Snapp Editt for the editing of my real estate photos a few months ago. What has set them apart from other editors is their willingness to communicate, fix any issues and reliability. Very happy with their work.",
      name: 'Alain',
      role: 'Real Estate Photographer, Australia'
    },
    {
      img: AvatarMan,
      quote: "I couldn’t be happier with the service I’ve received from Snapp Editt. They consistently provide exactly what I require - high quality image processing with a quick turnaround time. Highly recommend!",
      name: 'David',
      role: 'Architecture and Real Estate Photography, UK'
    },
    {
      img: AvatarMan,
      quote: "Snapp Editt have been amazing. I send them basic, unprocessed images of my clients' property, and in a quick time span they return exquisitely retouched images that really improve the look of my real estate listings.",
      name: 'Russell',
      role: 'Interior Photographer, USA'
    },
    {
      img: AvatarMan,
      quote: "I have been working with Snapp Editt for very long time, I am really happy with the quality of the images, the turnaround time is amazing and they are so reliable. Sean is very approachable, I can't recommend them enough!",
      name: 'Tiago B',
      role: 'Fashion Photographer, Australia'
    },


  ];

  const [active, setActive] = useState(0);
  const [autorotate, setAutorotate] = useState(true);
  const autorotateTiming = 7000;
  const testimonialsRef = useRef(null);

  useEffect(() => {
    let autorotateInterval;
    if (autorotate) {
      autorotateInterval = setInterval(() => {
        setActive(prev => (prev + 1 === testimonials.length ? 0 : prev + 1));
      }, autorotateTiming);
    }
    return () => clearInterval(autorotateInterval);
  }, [autorotate, testimonials.length]);

  useEffect(() => {
    heightFix();
    window.addEventListener('resize', heightFix);
    return () => window.removeEventListener('resize', heightFix);
  }, [active]);

  const heightFix = () => {
    if (testimonialsRef.current) {
      testimonialsRef.current.style.height = `${testimonialsRef.current.children[active]?.offsetHeight}px`;
    }
  };

  return (
    <section className="testimonial-section">
      <div className="section-header">
        <h2>What Our Clients Say</h2>
        <p>See what our customers have to say about our services.</p>
      </div>

      <div className="testimonial-container">
        <div className="gradient-bg"></div>
        <div className="image-container">
          <div className="image-wrapper">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`image-item ${active === index ? 'active' : ''}`}
              >
                <img
                  src={testimonial.img}
                  alt={testimonial.name}
                  className="testimonial-image"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="text-container" ref={testimonialsRef}>
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`text-item ${active === index ? 'active' : ''}`}
            >
              <blockquote className="testimonial-quote">
                {testimonial.quote}
              </blockquote>
              <span>{testimonial.name}<br /> {testimonial.role}</span>
              <span className='mobile-author-name'>{testimonial.name}</span>

            </div>
          ))}
        </div>

        {/* Mobile Dot Indicators */}
        <div className="buttons-container mobile-only">
          {testimonials.map((testimonial, index) => (
            <button
              key={index}
              className={`dot-indicator ${active === index ? 'active' : ''}`}
              onClick={() => {
                setActive(index);
                setAutorotate(false);
              }}
              aria-label={`View ${testimonial.name}'s testimonial`}
            />
          ))}
        </div>

        {/* Desktop Buttons */}
        <div className="buttons-container desktop-only">
          {testimonials.map((testimonial, index) => (
            <button
              key={index}
              className={`button-item ${active === index ? 'active' : ''}`}
              onClick={() => {
                setActive(index);
                setAutorotate(false);
              }}
              onMouseEnter={() => setAutorotate(false)}
              onMouseLeave={() => setAutorotate(true)}
            >
              <span className="button-text">
                {testimonial.name} - {testimonial.role}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
