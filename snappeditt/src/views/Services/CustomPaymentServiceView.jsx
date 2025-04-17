import SEO from "@/components/SEO/SEO.jsx";
import CustomPaymentForm from "../../components/OurServices/CustomPaymentService/CustomPaymentService.jsx";


function CustomPayementServiceView() {
  return (
    <div>
      <SEO
        title="Snappeditt | Digital Photo Editing Services"
        description="We Provide Image Post-Production Services to ensure you get perfect-picture photos at cost-effective rates. We are currently serving a wide range of clients all around the globe."
        keywords="photo editing, retouching, ecommerce editing, background removal"
      />
      <main>
        <section>
          <CustomPaymentForm />
        </section>
      </main>
    </div>
  )
}

export default CustomPayementServiceView;