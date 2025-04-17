import React from "react";
import SEO from "@/components/SEO/SEO";
import { Header83 } from "@/components/GlobalComponents/Banner/Header";
import FloorPlan from "@/components/OurServices/FloorPlan/FloorPlans";


function FloorPlanView() {
  // Define the content and images for the Header83 component
  const headerContent = {
    heading: "Floor Plan",
    description: "Floor Plan is the most popular service enrolled by photographers is used to create a plans of the property. Our expert team can create a 2D/3D floor plan for you based on the rough sketch and detailed measurements.",
    buttons: [
      { title: "Learn How Can We Help You", url: "#" }
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
        title="Snappeditt | Floor Plan | Floor Plan Services"
        description="SnappEditt offers Floor Plan, Extraction High-quality, professional floor plans, and image-editing services in India."
        keywords="Floor Plan, Floor Plan Services, Snappeditt, Real Estate Photography, Image Editing, 2D Floor Plan, 3D Floor Plan"
        author="Snappeditt"
      />
      <main>
        <section>
          {/* Pass the custom content as props to Header83 */}
          <Header83 {...headerContent} />
        </section>
        <section>
          <FloorPlan />
        </section>
      </main>
    </div>
  );
}

export default FloorPlanView;