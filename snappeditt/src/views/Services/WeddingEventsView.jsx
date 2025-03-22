import { Header83 } from "@/components/GlobalComponents/Banner/Header";
import PackagesWeddingEvents from "@/components/OurServices/WeddingEvents/PackagesWeOffer/PackagesWeddingEvents";
import WeddingRetouch from "@/components/OurServices/WeddingEvents/AdvanceWeddingServices/AdvanceWeddingServices";
import AlbumRetouch from "@/components/OurServices/WeddingEvents/AdvanceWeddingServices/AlbumRetouch";
import WeddingAddons from "@/components/OurServices/WeddingEvents/WeddingAddOnsSerVices/WeddingAddons";

function WeddingEventsView() {
  // Define the content and images for the Header83 component
  const headerContent = {
    heading: "Wedding & Events",
    description: "Are you unable to deliver photos to clients due to back-to-back shoots in this wedding season? You can enroll in our online Wedding services where our editors will cull-edit images matching exactly your studio style with a quick turnaround time (24-48 hours).",
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
          <PackagesWeddingEvents />
        </section>
        <section>
          <WeddingRetouch />
        </section>
        <section>
          <AlbumRetouch />
        </section>
        <section><WeddingAddons /></section>
      </main>
    </div>
  );
}

export default WeddingEventsView;
