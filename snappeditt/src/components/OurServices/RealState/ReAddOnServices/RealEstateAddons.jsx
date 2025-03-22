// RealEstateServicesPage.jsx
import AddOnServices from "@/components/GlobalComponents/AddOnServices/AddOnServices";

const RealEstateAddons = () => {
  const realEstateAddons = [
    { id: 1, name: "Sky Replacement", price: "$0.15 – $0.25", priceLabel: "/Image", buttonUrl: '/services/real-estate/sky-replacement' },
    { id: 2, name: "Window Masking", price: "$0.40", priceLabel: "/Image", buttonUrl: '/services/real-estate/sky-replacement' },
    { id: 3, name: "Grass Replacement", price: "$0.40", priceLabel: "/Image", buttonUrl: '/services/real-estate/sky-replacement' },
    { id: 4, name: "Grass Color Enhancement", price: "$0.20", priceLabel: "/Image", buttonUrl: '/services/real-estate/sky-replacement' },
    { id: 5, name: "Reflection Removal", price: "$0.50", priceLabel: "/Image", buttonUrl: '/services/real-estate/sky-replacement' },
    { id: 6, name: "Add TV Images", price: "$0.15", priceLabel: "/Image", buttonUrl: '/services/real-estate/sky-replacement' },
    { id: 7, name: "Add Fire To Fireplace", price: "$0.15", priceLabel: "/Image", buttonUrl: '/services/real-estate/sky-replacement' },
    { id: 8, name: "Color Cast Removal", price: "$1.00", priceLabel: "/Image", buttonUrl: '/services/real-estate/sky-replacement' },

  ];


  return (
    <div>
      {/* Main content */}
      <AddOnServices
        services={realEstateAddons}
        title="Add On's Services"
      />
    </div>
  );
};

export default RealEstateAddons;