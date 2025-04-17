import React from "react";
import SEO from "@/components/SEO/SEO";
import { ContactBanner } from "@/components/ContactUs/ContactBanner/ContactBanner";
import ContactDetailSection from "@/components/ContactUs/ContactDetailSection/ContactDetailSection";
import FaqSection from "@/components/ContactUs/FaqSction/FaqSection";
import ContactForm from "@/components/ContactUs/ContactForm/ContactForm"; // Default import


function ContactUsView() {

  return (
    <div>
      <SEO
        title="Contact Us | SnappEditt"
        description="Get in touch with SnappEditt for all your photo editing needs. Our team is ready to assist you with any inquiries or requests you may have."
        keywords="contact, photo editing, retouching, ecommerce editing, background removal"
      />
      <main>
        <section className="contact-banner">
          {/* Pass the custom content as props to Header83 */}
          <ContactBanner />
        </section>
        <section>
          <ContactDetailSection />
        </section>
        <section>
          <ContactForm />
        </section>
        <section>
          <FaqSection />
        </section>
      </main>
    </div>
  );
}

export default ContactUsView;
