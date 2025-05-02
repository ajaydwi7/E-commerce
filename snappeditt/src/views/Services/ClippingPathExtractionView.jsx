import React from "react";
import SEO from "@/components/SEO/SEO";
import { Header83 } from "@/components/GlobalComponents/Banner/Header";
import PackagesClippingPathExtraction from "@/components/OurServices/ClippingPathExtraction/PackagesClippingPathExtraction/PackagesClippingPathExtraction";


function ClippingPathExtractionView() {
  // Define the content and images for the Header83 component
  const headerContent = {
    heading: "Clipping Path ~ Extraction",
    description: "Clipping Path is the most popular service enrolled by photographers is used to create a picture-perfect cut-out of the subject. Our expert’s Clip path by manually cutting out 2D images using Image Editing Software. It is most useful for eCommerce Products, Jewellery, Portraits, Sports, School, etc industry.",
    buttons: [
      { title: "Learn How Can We Help You", url: "#clipping-path-packages" }
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
        title="Snappeditt | Clipping Path Service | Background Removal"
        description="SnappEditt offers Clipping Path, Extraction High-quality, professional clipping paths, and image-editing services in India."
        keywords="clipping path, extraction, photo editing, retouching, eCommerce photography"
      />
      <main>
        <section>
          {/* Pass the custom content as props to Header83 */}
          <Header83 {...headerContent} />
        </section>
        <section id="clipping-path-packages">
          <PackagesClippingPathExtraction />
        </section>
      </main>
    </div>
  );
}

export default ClippingPathExtractionView;
