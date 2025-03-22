// RealEstateServicesPage.jsx
import AddOnServices from "@/components/GlobalComponents/AddOnServices/AddOnServices";

const WeddingAddons = () => {
  const weddingAddons = [
    { id: 1, name: "Cropping & Straightening", price: "$0.02", priceLabel: "/Image", buttonUrl: '/services/wedding/wedding-events-cropping-straightening' },
    { id: 2, name: "Cropping", price: "$0.02", priceLabel: "/Image", buttonUrl: '/services/wedding/cropping' },
    { id: 3, name: "Vintage", price: "$0.01", priceLabel: "/Image", buttonUrl: '/services/wedding/wedding-events-vintage' },
    { id: 4, name: "Red Eye Removal", price: "$0.01", priceLabel: "/Image", buttonUrl: '/services/wedding/wedding-events-red-eye-removal' },
    { id: 5, name: "Dodging & Burning", price: "$0.03", priceLabel: "/Image", buttonUrl: '/services/wedding/wedding-events-dodging-and-burning' },
    {
      id: 6, name: "B/W Conversion", price: "$0.01", priceLabel: "/Image", buttonUrl: '/services/wedding//wedding-events-black-white'
    },
    { id: 7, name: "Categorize", price: "$0.02", priceLabel: "/Image", buttonUrl: '/services/wedding/wedding-events-categorize' },
    { id: 8, name: "Renaming & Renumbering", price: "$0.02", priceLabel: "/Image", buttonUrl: '/services/wedding/wedding-events-re-number-re-naming' },
    {
      id: 8, name: "Gallery Upload", price: "$0.03", priceLabel: "/Image", buttonUrl: '/services/wedding/wedding-events-gallery-upload'
    },
    {
      id: 8, name: "JPEG Output", price: "$0.03", priceLabel: "/Image", buttonUrl: '/services/wedding/wedding-events-jpeg-output'
    },
  ];


  return (
    <div>
      {/* Main content */}
      <AddOnServices
        services={weddingAddons}
        title="Add On's Services"
      />
    </div>
  );
};

export default WeddingAddons;