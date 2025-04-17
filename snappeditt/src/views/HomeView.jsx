import SEO from "@/components/SEO/SEO";
import Banner from "@/components/Home/Banner/Banner";
import Benefits from "@/components/Home/Benefits/Benefits";
import InfoSection from "@/components/Home/Informations/InfoSection";
import OurServices from "@/components/Home/Services/OurServices";
import TimelineSection from "@/components/Home/Timeline/timelineSection";
import TestimonialSection from "@/components/Home/Testimonials/Testomonials";

function HomeView() {
  return (
    <div>
      <SEO
        title="SnappEditt | Professional Editing Services | Photo Retouching Services"
        description="SnappEditt offers expert Photo Post-Production Services to ensure you get perfect-picture photos at cost-effective rates. We are currently serving a wide range of clients all around the globe. View the list of photo retouching services ⟾ and order online!"
        keywords="photo editing, retouching, ecommerce editing, background removal"
      />
      <main>
        <section className="hero-section">
          <Banner />
        </section>
        <section className="benefits-section"></section>
        <section>
          <Benefits />
        </section>
        <section className="info-section">
          <InfoSection />
        </section>
        <section className="services-section">
          <OurServices />
        </section>
        <section className="timeline-section">
          <TimelineSection />
        </section>
        <section className="testomonials-section">
          <TestimonialSection />
        </section>
      </main>
    </div>
  );
}

export default HomeView;
