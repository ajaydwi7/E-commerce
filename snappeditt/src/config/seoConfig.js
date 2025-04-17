export const SEO_CONFIG = {
  home: {
    title:
      "Professional Editing Services | Photo Retouching Services | SnappEditt",
    description:
      "SnappEditt offers expert Photo Post-Production Services to ensure you get perfect-picture photos at cost-effective rates. We are currently serving a wide range of clients all around the globe. View the list of photo retouching services ⟾ and order online!",
    keywords: "Professional Editing Services",
    schemaType: "Service",
    structuredData: {
      name: "Snappedit",
      image: "https://snappeditt.com/src/assets/images/SE-1.png",
      priceRange: "$$",
      telephone: ["+1-239-494-5666", "+1-781-451-3932"],
      address: {
        "@type": "PostalAddress",
        streetAddress: "123 Photo Lane",
        addressLocality: "Mumbai",
        addressRegion: "Maharashtra, India.",
      },
    },
  },
  about: {
    title: "Snappeditt | Professional Photo Editing Services",
    description:
      "SnappEditt is a Professional Photo Editing Service to ensure you get Perfect-Picture Photos at cost-effective rates. View the list of photo retouching services.",
    keywords:
      "about SnappEditt, photo editing team, SnappEditt mission, SnappEditt vision",
    canonical: "https://snappeditt.com/about-us",
    schemaType: false,
    structuredData: {
      description: "Professional photo editing company since 2020",
      foundingDate: "2020-01-01",
    },
  },
  services: {
    title: "Photo Editing Services - Background Removal & Retouching",
    description:
      "Professional photo editing services including background removal, color correction, image masking, and product photo editing.",
    schemaType: "ItemList",
    structuredData: {
      itemListElement: [
        {
          "@type": "Service",
          name: "Background Removal",
          description: "Precise background removal services",
          offers: {
            "@type": "Offer",
            price: "0.40",
            priceCurrency: "USD",
          },
        },
      ],
    },
  },
  pricing: {
    title: "Photo Editing Pricing - Transparent Plans",
    description:
      "Affordable pricing starting at $0.40/image with volume discounts for bulk orders.",
    schemaType: "PriceSpecification",
  },
  // Add other pages similarly
};
