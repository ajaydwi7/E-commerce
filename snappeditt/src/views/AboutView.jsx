import React from 'react';
import SEO from '../components/SEO/SEO';
import AboutBanner from '../components/GlobalComponents/Banner/PageBanner';
import MissionVision from '../components/AboutUs/MissionVision/MissionVision';
import missionVisionImage from "@/assets/images/missionVission.png";
import OurValues from '../components/AboutUs/Values/ourValues';
import WhyChooseUs from '../components/AboutUs/WhyChooseUs/WhyChooseUs';
import ImageGallery from '../components/AboutUs/Gallery/Gallery';

const AboutView = () => {
  const scrollToSection = (sectionId) => {
    const section = document.querySelector(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <div>
      <SEO
        title="About Us | SnappEditt"
        description="SnappEditt is a photo editing company that specializes in providing high-quality photo editing services to photographers and businesses. Our team of experienced editors is dedicated to delivering exceptional results that meet the unique needs of our clients."
        keywords="photo editing, retouching, ecommerce editing, background removal"
      />
      <main>
        <section className="about-banner">
          <AboutBanner scrollToSection={scrollToSection}></AboutBanner>
        </section>
        <section className='missonVission' id='missionVision'>
          <MissionVision
            title='Mission & Vision'
            content="Our vision is to be the best and first choice for all the photographers/companies worldwide for their post-production requirement.
            Our Mission is to save time, money and efforts of all our partners by providing best quality, fast turnaround time and proactive customer support."
            missionVisionImage={missionVisionImage}
          />

        </section>
        <section className='our-values'>
          <OurValues></OurValues>
        </section>
        <section className='why-choose-us'>
          <WhyChooseUs></WhyChooseUs>
        </section>
        <section className='image-gallery'>
          <ImageGallery></ImageGallery>
        </section>
      </main>
    </div>
  );
};

export default AboutView;
