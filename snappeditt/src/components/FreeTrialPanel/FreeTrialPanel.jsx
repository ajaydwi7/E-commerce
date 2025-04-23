import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useGlobalContext } from "@/components/GlobalContext/GlobalContext";

const FreeTrialPanel = ({ isPanelOpen, togglePanel }) => {
  const { auth } = useGlobalContext();
  const user = auth.state.user;
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    service: "",
    images: 1,
    orderName: "",
    imageLinks: "",
    description: "",
  });

  // Update form when user changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "", // Ensure phone is included
    }));
  }, [user]);

  const [errors, setErrors] = useState({});

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Step 1 validation
  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First Name is required";
    if (!formData.lastName) newErrors.lastName = "Last Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone) newErrors.phone = "Phone Number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 2 validation
  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.service) newErrors.service = "Service is required";
    if (!formData.orderName) newErrors.orderName = "Order Name is required";
    if (!formData.imageLinks || !/^https?:\/\//.test(formData.imageLinks)) {
      newErrors.imageLinks = "A valid URL is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;

  };

  // Proceed to Step 2
  const proceedToNextStep = () => {
    if (validateStep1()) setCurrentStep(2);
  };

  // Go back to Step 1
  const goToPreviousStep = () => setCurrentStep(1);

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    try {
      // Convert images to number and prepare JSON payload
      const payload = {
        ...formData,
        images: Number(formData.images),
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/free-trial`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Form submitted successfully!");

        // Reset the form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          service: "",
          images: "1",
          orderName: "",
          imageLinks: "",
          description: "",
        });
        setCurrentStep(1);
        togglePanel();
      } else {
        toast.error("Error submitting the form. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong while submitting the form.", error);
    }
  };


  return (
    <>
      {isPanelOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white p-6 w-full lg:w-1/3 h-full shadow-lg relative flex flex-col">
            {/* Close Button */}
            <button
              onClick={togglePanel}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-xl focus:outline-none"
            >
              ✖
            </button>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto max-h-[85vh]">
              <h2 className="text-4xl font-bold mb-2 text-center text-black">
                Free Trial For Photo Editing Order
              </h2>
              <p className="text-sm text-gray-600 mb-6 text-center">
                Start it easy! Find out the price in several steps: Upload photos – Describe the task – Get our answer via e-mail.
              </p>

              {/* Steps */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-6 h-6 flex items-center justify-center border-2 rounded-full ${currentStep === 1 ? "border-primaryRed text-primaryRed" : "border-gray-400 text-gray-400"
                      }`}
                  >
                    1
                  </div>
                  <span className={`text-sm font-semibold ${currentStep === 1 ? "text-primaryRed" : "text-gray-400"}`}>
                    Personal Details
                  </span>
                </div>
                <div className="w-full h-0.5 bg-gray-400 mx-2"></div>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-6 h-6 flex items-center justify-center border-2 rounded-full ${currentStep === 2 ? "border-primaryRed text-primaryRed" : "border-gray-400 text-gray-400"
                      }`}
                  >
                    2
                  </div>
                  <span className={`text-sm font-semibold ${currentStep === 2 ? "text-primaryRed" : "text-gray-400"}`}>
                    Requirements
                  </span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleFormSubmit}>
                {currentStep === 1 && (
                  <>
                    {/* First Name & Last Name */}
                    <div className="flex flex-col lg:flex-row gap-4 mb-4">
                      <div className="flex-1">
                        <label className="block text-sm text-gray-700 font-medium">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full text-gray-700 border p-2 rounded"
                          placeholder="First Name"
                        />
                        {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName}</span>}
                      </div>
                      <div className="flex-1">
                        <label className="block text-gray-700 text-sm font-medium">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full text-gray-700 border p-2 rounded"
                          placeholder="Last Name"
                        />
                        {errors.lastName && <span className="text-red-500 text-sm">{errors.lastName}</span>}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full text-gray-700 border p-2 rounded"
                        placeholder="example@example.com"
                      />
                      {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                    </div>

                    {/* Phone */}
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full text-gray-700 border p-2 rounded"
                        placeholder="123-456-7890"
                      />
                      {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
                    </div>

                    <button
                      type="button"
                      onClick={proceedToNextStep}
                      className="bg-black text-white py-2 px-4 rounded"
                    >
                      Proceed
                    </button>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    {/* Service */}
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium">Service</label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full text-gray-700 border p-2 rounded"
                      >
                        <option value="">Select Service</option>
                        <option value="real-estate">Real Estate</option>
                        <option value="3d-services">3D Services</option>
                        <option value="wedding-events">Wedding Events</option>
                        <option value="products-ecommerce">Products - eCommerce</option>
                        <option value="people">People</option>
                        <option value="cliping-path-extraction">Cliping Path Ectraction</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.service && <span className="text-red-500 text-sm">{errors.service}</span>}
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">Number of Images</label>
                      <input
                        type="number"
                        name="images"
                        placeholder="Number of Images"
                        value={formData.images}
                        onChange={handleChange}
                        className="w-full border border-gray-300 text-gray-700 p-2 rounded"
                      />
                    </div>

                    {/* Order Name */}
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium">Order Name</label>
                      <input
                        type="text"
                        name="orderName"
                        value={formData.orderName}
                        onChange={handleChange}
                        className="w-full text-gray-700 border p-2 rounded"
                        placeholder="Order Name"
                      />
                      {errors.orderName && <span className="text-red-500 text-sm">{errors.orderName}</span>}
                    </div>

                    {/* Image Links */}
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium">Submit Image Links</label>
                      <input
                        type="url"
                        name="imageLinks"
                        value={formData.imageLinks}
                        onChange={handleChange}
                        className="w-full text-gray-700 border p-2 rounded"
                        placeholder="https://example.com"
                      />
                      {errors.imageLinks && <span className="text-red-500 text-sm">{errors.imageLinks}</span>}
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium">Describe Your Requirements</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        className="w-full text-gray-700 border p-2 rounded"
                        placeholder="Describe your requirements"
                      ></textarea>
                    </div>

                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={goToPreviousStep}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                      >
                        Back
                      </button>
                      <button type="submit" className="bg-black text-white px-4 py-2 rounded">
                        Submit
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FreeTrialPanel;
