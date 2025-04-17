import React from "react";
import SEO from "@/components/SEO/SEO";
import { Header83 } from "@/components/GlobalComponents/Banner/Header";
import RealEstatePackages from "@/components/OurServices/RealState/PackagesRealState/PackagesRealState";
import DayToDusk from "@/components/OurServices/RealState/AdvanceServices/DayToDusk";
import DeClutterObjects from "@/components/OurServices/RealState/AdvanceServices/DeClutterObjects";
import UAVRetouching from "../../components/OurServices/RealState/AdvanceServices/UAVRetouching";
import VirtualStaging from "@/components/OurServices/RealState/AdvanceServices/VirtualStaging";
import RealEstateAddons from "@/components/OurServices/RealState/ReAddOnServices/RealEstateAddons";



function RealStateView() {
  // Define the content and images for the Header83 component
  const headerContent = {
    heading: "Real Estate",
    description: "This service is suited for Real Estate and Architectural photographers. With our latest techniques and software’s we create natural and stunning images for the real estate and hotel/architecture industry along with faster turnaround time which is utmost required as per the current market trends. Starting from basic HDR to layered blending (Manual Blending) our team can do any type of editing, including custom edits exactly matching your studio style.",
    buttons: [
      {
        title: "Learn How Can We Help You",
        url: "#packages",
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
        title="Snappeditt | Best Real Estate Photo Editing"
        description="Real Estate Photo Editing services from basic to advance retouching. We can do any type of editing, Starting from basic HDR, and custom edits exactly matching your studio style."
        keywords="real estate, photo editing, retouching, real estate photography, property listing"
      />
      <main>
        <section>
          {/* Pass the custom content as props to Header83 */}
          <Header83 {...headerContent} />
        </section>
        <section className="packages-section" id="packages">
          <RealEstatePackages />
        </section>
        <section className="advance-section">
          <DayToDusk />
        </section>
        <section>
          <DeClutterObjects />
        </section>
        <section>
          <UAVRetouching />
        </section>
        <section>
          <VirtualStaging />
        </section>
        <section><RealEstateAddons /></section>
      </main>
    </div>
  );
}

export default RealStateView;