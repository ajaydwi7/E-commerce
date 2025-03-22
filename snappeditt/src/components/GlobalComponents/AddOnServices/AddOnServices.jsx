"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@relume_io/relume-ui";
import { useNavigate } from "react-router-dom";


const AddOnServices = ({
  services,
  title = "Add-On's Services",
}) => {
  const navigate = useNavigate();


  const handleAddToCart = (service) => {
    // Add your cart logic here if needed
    navigate(service.buttonUrl);
  };

  if (!services || services.length === 0) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h2 className="text-4xl md:text-5xl font-cursive text-primaryRed mb-2">
          {title}
        </h2>
        <div className="h-0.5 w-full max-w-md bg-gray-800"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="border border-gray-300 p-4 flex flex-col items-center justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
          >
            <div className="text-center mb-4">
              <h3 className="text-xl font-serif italic font-semibold mb-2 group-hover:text-[#FF5A44]">
                {service.name}
              </h3>
              <div className="flex items-center justify-center">
                <span className="text-lg font-bold">{service.price}</span>
                <span className="text-sm text-gray-600">{service.priceLable}</span>
              </div>
            </div>

            <Button
              onClick={() => handleAddToCart(service)}
              className="bg-white text-black border border-black rounded-full px-4 py-2 flex items-center space-x-2 hover:bg-black hover:text-white transition-colors duration-300"
            >
              <ShoppingCart size={16} />
              <span>Add to Cart</span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddOnServices;