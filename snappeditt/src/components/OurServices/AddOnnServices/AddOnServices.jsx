"use client"
import { ShoppingCart } from "lucide-react"
import { Button } from "@relume_io/relume-ui";
import { useNavigate } from "react-router-dom";

export default function AddOnServices() {
  const navigate = useNavigate()

  const services = [
    { id: 1, name: "Sky Replacement", price: "$0.15 – $0.25", priceLabel: "/Image", buttonUrl: '/services/real-estate/sky-replacement' },
    { id: 2, name: "Window Masking", price: "$0.40", priceLabel: "/Image", buttonUrl: '/services/real-estate/window-masking' },
    { id: 3, name: "Grass Replacement", price: "$0.40", priceLabel: "/Image", buttonUrl: '/services/real-estate/grass-replacement' },
    { id: 4, name: "Grass Color Enhancement", price: "$0.20", priceLabel: "/Image", buttonUrl: '/services/real-estate/green-color-enhancement' },
    { id: 5, name: "Reflection Removal", price: "$0.50", priceLabel: "/Image", buttonUrl: '/services/real-estate/reflection-removal' },
    { id: 6, name: "Add TV Images", price: "$0.15", priceLabel: "/Image", buttonUrl: '/services/real-estate/add-tv-images' },
    { id: 7, name: "Add Fire To Fireplace", price: "$0.15", priceLabel: "/Image", buttonUrl: '/services/real-estate/add-fire-to-fireplace' },
    { id: 8, name: "Color Cast Removal", price: "$1.00", priceLabel: "/Image", buttonUrl: '/services/real-estate/color-cast-removal' },
  ]

  const handleAddToCartBtn = (service) => {
    // Add your cart logic here if needed
    navigate(service.buttonUrl); // Navigate to the service's URL
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h2 className="text-4xl md:text-5xl font-cursive text-primaryRed mb-2">Add-On's Services</h2>
        <div className="h-0.5 w-full max-w-md mx-auto bg-gray-800"></div>
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
                <span className="text-sm text-gray-600">{service.priceLabel}</span>
              </div>
            </div>

            <Button
              onClick={() => (handleAddToCartBtn(service))}
              className="bg-white text-black border border-black rounded-full px-4 py-2 flex items-center space-x-2 hover:bg-black hover:text-white transition-colors duration-300"
            >
              <ShoppingCart size={16} />
              <span>Add to Cart</span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

