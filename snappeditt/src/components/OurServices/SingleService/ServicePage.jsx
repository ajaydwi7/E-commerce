import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGlobalContext } from "@/components/GlobalContext/GlobalContext";
import ServiceForm from "@/components/GlobalComponents/ServiceForm/ServiceForm";
import ImageComparisonSlider from "@/components/GlobalComponents/ImageComparisonSlider/ImageComparisonSlider";
import RealEstateAddons from "../RealState/ReAddOnServices/RealEstateAddons";
import WeddingAddons from "../WeddingEvents/WeddingAddOnsSerVices/WeddingAddons";
import { toast } from "react-toastify";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";


const ServicePage = () => {
  const { categorySlug, serviceSlug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSlider, setActiveSlider] = useState(0);
  const [selectedVariations, setSelectedVariations] = useState({});
  const [formData, setFormData] = useState({
    quantity: service?.quantity?.toString() || "1" // Start with string
  });
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
        placeholder: "Additional Order Details...",
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

  const getCurrentCombination = () => {
    if (!service) return null;

    const selectedNames = Object.values(selectedVariations)
      .filter(v => v)
      .map(v => v.name);

    return service.priceCombinations.find(pc =>
      pc.combination.length === selectedNames.length &&
      pc.combination.every(name => selectedNames.includes(name))
    );
  };
  const handleAddToCart = () => {
    try {
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
      const quantity = Math.max(1, parseInt(formData.quantity) || 1);
      const cartItem = {
        serviceId: service._id,
        serviceName: service.name,
        categorySlug: categorySlug,
        serviceSlug: serviceSlug,
        basePrice: service.basePrice,
        finalPrice: calculatePrice(),
        quantity: quantity,
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
    } catch (error) {
      toast.error("Failed to add to cart. Please try again.");
    }
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
                    loading="lazy"
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
          <p className="text-4xl font-normal text-black mt-4 font-secondary">
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
          {/* Variation Types Section */}
          <div className="bg-gray-100 p-5 mt-4 mb-4">
            {service?.variationTypes?.map(variationType => (
              <div key={variationType._id} className="mt-6">
                <div className="flex items-center mb-4">
                  <h2 className="text-sm font-semibold mr-4">{variationType.name}</h2>
                  <div className="flex flex-wrap gap-4">
                    {variationType.options.map(option => (
                      <button
                        key={option._id}
                        onClick={() => handleVariationSelect(variationType, option)}
                        className={`py-2 px-4 rounded-sm border ${selectedVariations[variationType.name]?._id === option._id
                          ? "border-primaryRed text-black bg-white"
                          : "border-gray-300 hover:border-gray-500 bg-white"
                          }`}
                      >
                        {option.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Combination Details Section - Show AFTER all variation types */}
          {Object.keys(selectedVariations).length > 0 && (
            <div className="mt-6 bg-gray-100 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {getCurrentCombination() ? "Selected Combination" : "Selected Options"}
                </h3>
                <button
                  onClick={() => setSelectedVariations({})}
                  className="text-primaryRed hover:underline text-sm"
                >
                  Clear
                </button>
              </div>

              {/* Show combination details if valid combination exists */}
              {getCurrentCombination() ? (
                <>
                  <div className="space-y-2">
                    {Object.entries(selectedVariations).map(([type, option]) => (
                      <div key={type} className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{type}:</span>
                        <span>{option.name}</span>
                        {option.description && (
                          <span className="text-sm text-gray-600">
                            ({option.description})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    {getCurrentCombination().description && (
                      <p className="mt-2 text-gray-600">
                        {getCurrentCombination().description}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-gray-600">
                  {service.variationTypes.length > 1
                    ? "Please select all required options to see combination details"
                    : "Selected option details"}
                </div>
              )}
            </div>
          )}

          {/* Price Display - Only shows when valid combination exists */}
          {getCurrentCombination() && (
            <p className="text-2xl font-normal text-primaryRed-500 mt-4 font-secondary">
              ${getCurrentCombination().price.toFixed(2)}
            </p>
          )}

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
                value={formData.quantity}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setFormData(prev => ({
                    ...prev,
                    quantity: value || ""
                  }));
                }}
                onBlur={(e) => {
                  const parsed = Math.max(1, parseInt(e.target.value) || 1);
                  setFormData(prev => ({
                    ...prev,
                    quantity: parsed.toString()
                  }));
                }}
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