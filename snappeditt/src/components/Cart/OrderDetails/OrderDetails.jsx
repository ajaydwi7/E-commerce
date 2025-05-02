import React, { useState } from "react";
import { useGlobalContext } from "@/components/GlobalContext/GlobalContext";
import { Link } from "react-router-dom";
import { CircleMinus } from "lucide-react";
import "./OrderDetails.css";

const OrderDetails = ({ service }) => {
  const { serviceStore } = useGlobalContext();
  const { updateCartQuantity, removeFromCart } = serviceStore;
  const [inputValue, setInputValue] = useState(service.quantity.toString());
  const [currentQuantity, setCurrentQuantity] = useState(service.quantity);

  // Construct the service URL
  const serviceUrl = `/services/${service.categorySlug}/${service.serviceSlug}`;

  // Calculate the correct price
  const finalPrice = service.finalPrice ?? service.basePrice;

  const handleQuantityChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    setInputValue(rawValue);
  };

  const handleUpdateQuantity = () => {
    const parsed = Math.max(1, parseInt(inputValue) || currentQuantity);
    setInputValue(parsed.toString());
    setCurrentQuantity(parsed);
    updateCartQuantity(service.serviceId, parsed);
  };

  const handleRemove = () => {
    if (!service.serviceId) {
      console.error("Missing service ID for removal");
      return;
    }
    removeFromCart(service.serviceId);
  };

  return (
    <div className="order-details">
      <div className="order-detail">
        <div className="left-side">
          <Link to={serviceUrl}>
            <img src={service.featureImage} alt={service.serviceName} />
          </Link>
        </div>
        <div className="right-side">
          <h3>
            <Link className="text-primaryRed" to={serviceUrl}>
              {service.serviceName}
            </Link>
          </h3>

          {/* Display Variation Type & Option */}
          {service.selectedVariations && service.selectedVariations.length > 0 ? (
            <div className="variation-info">
              {service.selectedVariations.map((variation, index) => (
                <p key={index}>
                  <strong>{variation.variationType}: </strong> {variation.optionName}
                </p>
              ))}
            </div>
          ) : (
            <p><strong>Standard Price Applied</strong></p>
          )}

          {/* Display Additional Form Data */}
          {service.formData && (
            <ul>
              {Object.entries(service.formData)
                .filter(([key]) => key !== "Image Number" && key !== "retouchingType")
                .map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {value}
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>

      {/* Price Calculation */}
      <div className="order-price">
        <p>Price</p>
        <h3>${finalPrice.toFixed(2)}</h3>
      </div>

      {/* Quantity Input */}
      <div className="quantity">
        <p>Quantity</p>
        <div className="flex items-start space-x-2">
          <input
            type="number"
            min="1"
            value={inputValue}
            onChange={handleQuantityChange}
            onBlur={() => {
              if (inputValue.trim() === "") {
                setInputValue(currentQuantity.toString());
                return;
              }
              const parsed = Math.max(1, parseInt(inputValue) || currentQuantity);
              setInputValue(parsed.toString());
              setCurrentQuantity(parsed);
            }}
            className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryRed text-center"
          />
          <button className="px-4 py-1 bg-primaryRed text-white font-medium rounded-md hover:bg-red-700 transition-all" onClick={handleUpdateQuantity}>
            Update
          </button>
        </div>
      </div>

      {/* Remove Item */}
      <div className="remove">
        <button onClick={handleRemove}><CircleMinus /></button>
      </div>
    </div>
  );
};

export default OrderDetails;
