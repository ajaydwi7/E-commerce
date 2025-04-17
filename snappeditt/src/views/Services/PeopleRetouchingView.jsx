import React from "react";
import SEO from "@/components/SEO/SEO";
import { Header83 } from "@/components/GlobalComponents/Banner/Header";
import PackagesPeopleRetouching from "@/components/OurServices/PeopleRetouching/PackagesPeopleRetouching";


function PeopleRetouchingView() {
  // Define the content and images for the Header83 component
  const headerContent = {
    heading: "People Retouching",
    description: "In this service, we primarily focus on enhancing the person’s image by keeping the true colors and natural tone of the skin. Our professional editors focus on editing the image more naturally rather than over retouching the image. This service is mostly used by photographers shooting Portrait, Headshots, Pregnancy, Baby, School, Sports, Fashion, Beauty, Advertising, Corporate Events, etc.",
    buttons: [
      { title: "Learn How Can We Help You" }
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
        title="Snappeditt | Portrait Photo Editing Services"
        description="We Offer Photo Editing & Retouching Services for Portraits, Headshots, Pregnancy, Baby, School, Sports, Fashion, Beauty, Advertising, Corporate Events, etc."
        keywords="people retouching, photo editing, retouching, portrait photography, headshot photography"
      />
      <main>
        <section>
          {/* Pass the custom content as props to Header83 */}
          <Header83 {...headerContent} />
        </section>
        <section>
          <PackagesPeopleRetouching />
        </section>
      </main>
    </div>
  );
}

export default PeopleRetouchingView;
