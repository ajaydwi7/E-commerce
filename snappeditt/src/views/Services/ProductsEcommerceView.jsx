import React from "react";
import SEO from "@/components/SEO/SEO";
import { Header83 } from "@/components/GlobalComponents/Banner/Header";
import PackagesECommerce from "@/components/OurServices/ProductsECommerce/PackagesECommerce/PackagesECommerce";

function ProductECommerceView() {
  // Define the content and images for the Header83 component
  const headerContent = {
    heading: "Products ~ eCommerce",
    description: "Photographers or Business owners who want to sell or showcase their products to improve customer’s buying experience can avail of this service. In this service, we offer products retouching, clipping path, deep etching, Extraction, Background removal/change, Composite Retouching, Ghost Mannequin, etc.",
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
        title="Snappeditt | E-Commerce Products Retouching Services"
        description="Products/eCommerce Photo Editing Services. we offer product retouching, clipping path, deep etching, Extraction, Background removal/change, Composite Retouching, Ghost Mannequins, etc."
        keywords="ecommerce photo editing, product photo editing, retouching, ecommerce photography, product photography"
      />
      <main>
        <section>
          {/* Pass the custom content as props to Header83 */}
          <Header83 {...headerContent} />
        </section>
        <section>
          <PackagesECommerce />
        </section>
      </main>
    </div>
  );
}

export default ProductECommerceView;
