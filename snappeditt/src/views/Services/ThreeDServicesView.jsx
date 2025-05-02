import React from "react";
import SEO from "@/components/SEO/SEO";
import { Header83 } from "@/components/GlobalComponents/Banner/Header";
import OfferServices from "@/components/OurServices/3dServices/ServicesOffer/OfferServices";
import ThreeDRendring from "@/components/OurServices/3dServices/ServicesOffer/3DRendring";

function ThreeDdServicesView() {
  // Define the content and images for the Header83 component
  const headerContent = {
    heading: "3D Services",
    description: "Snapp Editt specialize in creating high quality Architectural 3D Rendering Services, Interior Rendering and 3D floor plans – delivered quickly, and cost effectively. We bring your vision to life! Our team will help you to put your imagination into practical mock-up with the help of 3D realistic rendering.",
    buttons: [
      {
        title: "Learn How Can We Help You", url: "#three-d-services",
      }
    ],
    images: [
      { src: new URL('@/assets/images/Real-Estate-Architechture_Retouching-Corrected-1.jpg', import.meta.url).href, alt: "Real Estate Image 1" },
      {
        src: new URL('@/assets/images/Real-Estate-Architechture_Retouching-Corrected-2.jpg', import.meta.url).href, alt: "Real Estate Image 2"
      },
      { src: new URL('@/assets/images/Real-Estate-Architechture_Retouching-Corrected-3.jpg', import.meta.url).href, alt: "Real Estate Image 3" },
      { src: new URL('@/assets/images/Real-Estate-Architechture_Retouching-S-Corrected-1.jpg', import.meta.url).href, alt: "Real Estate Image 4" },
      { src: new URL('@/assets/images/Real-Estate-Architechture_Retouching-S-Corrected-3.jpg', import.meta.url).href, alt: "Real Estate Image 5" },
      { src: new URL('@/assets/images/Real-Estate-Custom_Retouch_Corrected.jpg', import.meta.url).href, alt: "Real Estate Image 6" },
      { src: new URL('@/assets/images/Real-Estate-HDR-Basic-Corrected-1.jpg', import.meta.url).href, alt: "Real Estate Image 7" },
      { src: new URL('@/assets/images/Real-Estate-HDR-Basic-Corrected-2.jpg', import.meta.url).href, alt: "Real Estate Image 8" },
      { src: new URL('@/assets/images/Real-Estate-HDR-Basic-S-Corrected-3.jpg', import.meta.url).href, alt: "Real Estate Image 9" },
      // Add more images as needed
    ],
  };

  return (
    <div>
      <SEO
        title="Snappeditt | 3d Rendering services| Interior Design"
        description="We Specialise in 3D Floorplans, 3D Architectural Renderings, Real Estate & Building Projects, 3D Interior Designs, and more! We provide the best 3D Rendering Services."
        keywords="3D services, photo editing, retouching, 3D rendering, architectural rendering"
      />
      <main>
        <section>
          {/* Pass the custom content as props to Header83 */}
          <Header83 {...headerContent} />
        </section>
        <section id="three-d-services">
          <OfferServices />
        </section>
        <section>
          <ThreeDRendring />
        </section>
      </main>
    </div>
  );
}

export default ThreeDdServicesView;
