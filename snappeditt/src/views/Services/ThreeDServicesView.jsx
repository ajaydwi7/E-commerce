import { Header83 } from "@/components/GlobalComponents/Banner/Header";
import OfferServices from "@/components/OurServices/3dServices/ServicesOffer/OfferServices";
import ThreeDRendring from "@/components/OurServices/3dServices/ServicesOffer/3DRendring";

function ThreeDdServicesView() {
  // Define the content and images for the Header83 component
  const headerContent = {
    heading: "3D Services",
    description: "Snapp Editt specialize in creating high quality Architectural 3D Rendering Services, Interior Rendering and 3D floor plans – delivered quickly, and cost effectively. We bring your vision to life! Our team will help you to put your imagination into practical mock-up with the help of 3D realistic rendering.",
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
      <main>
        <section>
          {/* Pass the custom content as props to Header83 */}
          <Header83 {...headerContent} />
        </section>
        <section>
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
