import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// import axios from "axios";
import { useGlobalContext } from "@/components/GlobalContext/GlobalContext";
import ServiceForm from "@/components/GlobalComponents/ServiceForm/ServiceForm";
import ImageComparisonSlider from "@/components/GlobalComponents/ImageComparisonSlider/ImageComparisonSlider";
import RealEstateAddons from "./ReAddOnServices/RealEstateAddons";
import WeddingAddons from "../WeddingEvents/WeddingAddOnsSerVices/WeddingAddons";
import { toast } from "react-toastify";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Import } from "lucide-react";

const ServicePage = () => {
  const { categorySlug, serviceSlug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSlider, setActiveSlider] = useState(0);
  const [selectedVariations, setSelectedVariations] = useState({});
  const [formData, setFormData] = useState({ quantity: 1 });
  const [formConfig, setFormConfig] = useState([]);

  const { serviceStore } = useGlobalContext();
  const { addToCart, state: { cart } } = serviceStore;



  useEffect(() => {
    if (service?.images) {
      service.images.forEach((imagePair) => {
        const preloadBefore = new Image();
        preloadBefore.src = imagePair.before;
        if (imagePair.after) {
          const preloadAfter = new Image();
          preloadAfter.src = imagePair.after;
        }
      });
    }
  }, [service]);

  // Updated active slider preload
  useEffect(() => {
    if (service?.images?.[activeSlider]) {
      const imgBefore = new Image();
      imgBefore.src = service.images[activeSlider].before;
      if (service.images[activeSlider].after) {
        const imgAfter = new Image();
        imgAfter.src = service.images[activeSlider].after;
      }
    }
  }, [activeSlider, service?.images]);

  useEffect(() => {
    const fetchService = async () => {
      console.log("Fetching data from:", `${import.meta.env.VITE_API_URL}/services/${categorySlug}/${serviceSlug}`);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/services/${categorySlug}/${serviceSlug}`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const fetchedService = await response.json();

        if (!fetchedService) {
          throw new Error("Empty service data received.");
        }

        setService(fetchedService);
        loadFormConfig(fetchedService); // Ensure form fields are loaded

      } catch (err) {
        setError("Error fetching service data. Please try again later.");
        console.error("Service fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [categorySlug, serviceSlug]);


  // Auto-select single-option required variations
  useEffect(() => {
    if (service?.variationTypes) {
      const autoSelections = {};
      service.variationTypes.forEach(vt => {
        // Auto-select if there's only one option, regardless of required status
        if (vt.options.length === 1) {
          autoSelections[vt.name] = vt.options[0];
        }
      });
      setSelectedVariations(autoSelections);
    }
  }, [service]);

  const loadFormConfig = (service) => {
    const config = [
      {
        name: "Order name",
        label: "Order name",
        type: "text",
        required: true,
        placeholder: "Order Name",
      },
      {
        name: "Order Image",
        label: "Order Image",
        type: "text",
        required: true,
        placeholder: "Provide WeTransfer Dropbox or any cloud-based link for RAW images.",
      },
      {
        name: "Additionals Order Details",
        label: "Additionals Order Details",
        type: "textarea",
        required: true,
        placeholder: "Additionals Order Details...",
      },
    ];
    setFormConfig(config);
  };

  const handleVariationSelect = (variationType, option) => {
    setSelectedVariations(prev => {
      // Toggle selection if clicking the same option
      if (prev[variationType.name]?._id === option._id) {
        const newState = { ...prev };
        delete newState[variationType.name];
        return newState;
      }
      return { ...prev, [variationType.name]: option };
    });
  };

  // In the calculatePrice function, add null checks
  // Update price calculation to use names temporarily
  const calculatePrice = () => {
    if (!service) return 0;

    const selectedNames = Object.values(selectedVariations)
      .filter(v => v)
      .map(v => v.name);

    const combination = service.priceCombinations.find(pc =>
      pc.combination.length === selectedNames.length &&
      pc.combination.every(name => selectedNames.includes(name))
    );

    return combination ? combination.price : service.basePrice;
  };

  const handleAddToCart = () => {
    if (!service) return;

    // Validate required variations (including auto-selected ones)
    const requiredVariations = service.variationTypes.filter(vt => vt.required);
    const missingVariations = requiredVariations.some(vt => {
      const hasSelection = selectedVariations[vt.name] ||
        (vt.options.length === 1 && vt.required);
      return !hasSelection;
    });

    if (missingVariations) {
      toast.error("Please select all required options");
      return;
    }

    // Validate form data
    const missingFormFields = formConfig
      .filter(field => field.required)
      .some(field => !formData[field.name]);

    if (missingFormFields) {
      toast.error("Please fill all required fields");
      return;
    }

    // Prepare cart item with all selections
    const finalSelections = { ...selectedVariations };
    service.variationTypes?.forEach(vt => {
      if (vt.options.length === 1 && vt.required) {
        finalSelections[vt.name] = vt.options[0];
      }
    });

    const cartItem = {
      serviceId: service._id,
      serviceName: service.name,
      basePrice: service.basePrice,
      finalPrice: calculatePrice(),
      quantity: parseInt(formData.quantity),
      featureImage: service.featureImage,
      selectedVariations: Object.entries(finalSelections).map(([type, option]) => ({
        variationType: type,
        optionId: option._id,
        optionName: option.name
      })),
      formData: formData,
    };

    addToCart(cartItem);
    toast.success(`${service.name} added to cart!`);
  };

  const isInCart = cart?.some(item => item.serviceId === service?._id);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="service-page container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 md:mr-4">
          <div className="relative">
            {service?.images?.map((image, index) => (
              <div
                key={index}
                className={`${index === activeSlider ? 'block' : 'hidden'}`}
              >
                {image.after ? (
                  // Show comparison slider if after image exists
                  <ImageComparisonSlider
                    beforeImage={image.before}
                    afterImage={image.after}
                  />
                ) : (
                  // Show single image if only before exists
                  <img
                    src={image.before}
                    alt="Service preview"
                    className="w-full h-auto object-cover"
                  />
                )}
              </div>
            ))}

            {/* Navigation controls */}
            {service?.images?.length > 1 && (
              <>
                <FaArrowLeft
                  onClick={() => setActiveSlider(prev =>
                    (prev - 1 + service.images.length) % service.images.length
                  )}
                  className="absolute top-1/2 left-4 transform -translate-y-1/2 cursor-pointer text-white bg-black/50 rounded-full p-1 hover:bg-black/80 transition-colors"
                  size={30}
                />
                <FaArrowRight
                  onClick={() => setActiveSlider(prev =>
                    (prev + 1) % service.images.length
                  )}
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-white bg-black/50 rounded-full p-1 hover:bg-black/80 transition-colors"
                  size={30}
                />

                {/* Dots indicator */}
                <div className="flex justify-center mt-4 space-x-2">
                  {service.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveSlider(index)}
                      className={`w-4 h-4 rounded-full ${activeSlider === index ? "bg-primaryRed" : "bg-gray-300"
                        }`}
                    ></button>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="mt-4">
            {service.description ? (
              service.description.split("\n\n").map((paragraph, index) => (
                <p key={index} style={{ marginBottom: "20px" }} className="text-black">
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-black"></p>
            )}

            <ol className="list-decimal pl-6 space-y-2">
              {service?.features?.map((feature, index) => (
                <li key={index} className="text-black">
                  {feature.name}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Details Section */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-lg border border-gray-300">
          <h1 className="text-4xl font-md text-primaryRed font-cursive capitalize">
            {service.name}
          </h1>

          {/* Price Display */}
          <p className="text-4xl font-normal text-black mt-4 font-secondry">
            {service?.priceRange ? (
              service.priceRange.min === service.priceRange.max ? (
                `$${(service.priceRange.min || 0).toFixed(2)}`
              ) : (
                `$${(service.priceRange.min || 0).toFixed(2)} - $${(service.priceRange.max || 0).toFixed(2)}`
              )
            ) : (
              `$${(service?.basePrice || 0).toFixed(2)}`
            )}
          </p>

          {/* Variations Section */}
          <div className="bg-gray-100 p-5 mt-4 mb-4">
            {service?.variationTypes?.map(variationType => (
              <div key={variationType._id} className="mt-6">
                <div className="flex items-center mb-4">
                  <h2 className="text-sm font-semibold mr-4">{variationType.name}</h2>
                  <div className="flex flex-wrap gap-4">
                    {(variationType.options || []).map(option => (
                      <button
                        key={option._id}
                        onClick={() => handleVariationSelect(variationType, option)}
                        className={`py-2 px-4 rounded-sm border ${selectedVariations[variationType.name]?._id === option._id
                          ? "border-primaryRed text-black bg-white"
                          : "border-gray-300 hover:border-gray-500 bg-white"
                          } ${variationType.options.length === 1 ? 'cursor-pointer' : ''}`}
                      >
                        {option.name}
                      </button>
                    ))}
                  </div>
                </div>

                {variationType.options.length > 1 && selectedVariations[variationType.name] && (
                  <div className="text-gray-700 mt-2 mb-4">
                    <span className="font-medium">
                      Selected: {selectedVariations[variationType.name].name}
                    </span>
                    <button
                      onClick={() => setSelectedVariations(prev => {
                        const newState = { ...prev };
                        delete newState[variationType.name];
                        return newState;
                      })}
                      className="text-primaryRed hover:underline ml-4"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Other Form Fields */}
          <ServiceForm
            formConfig={formConfig}
            formData={formData}
            onFormChange={setFormData}
          />

          {/* Image Number and Add to Cart Button (Side by Side) */}
          <div className="flex items-center m-5 mb-6">
            <div>
              {/* <label className="block text-gray-700 mb-2">Image Number</label> */}
              <input
                type="number"
                name="quantity"
                min="1"
                value={formData.quantity || 1}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-20 p-2 border text-md text-center border-black"
                required
              />
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="px-6 py-2 text-md text-primaryBlack hover:bg-black hover:text-white border border-primaryBlack bg-white transition-colors"
            >
              {isInCart ? "Update Cart" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
      <div className="mt-12">
        {categorySlug === 'real-estate' && <RealEstateAddons />}
        {categorySlug === 'wedding-events' && <WeddingAddons />}
      </div>
    </div>

  );
};

export default ServicePage;