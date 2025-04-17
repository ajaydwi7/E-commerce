import React, { useState } from "react";
import logo from "@/assets/images/SE-1.png";
import FreeTrialPanel from "../FreeTrialPanel/FreeTrialPanel";
import "./ShopFooter.css"
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaHeart,
  FaWhatsapp,
  FaSkype,
} from "react-icons/fa"; // Import social icons

const ShopFooter = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const togglePanel = () => {
    setIsPanelOpen((prev) => !prev);
  };

  return (
    <>
      <section className="bg-black text-white py-8">
        {/* CTA Section */}
        <div className="footer-btn container mx-auto px-4 flex justify-between items-center pb-8">
          <div>
            <p className="text-white mb-2 text-sm">
              Image editing partner to thousands of photographers worldwide.
            </p>
            <h1 className="text-5xl md:text-8xl font-normal font-cursive">
              Grow With Confidence
            </h1>
          </div>
          <div className="flex gap-4">
            <button onClick={togglePanel} className="cta-red bg-red-500 text-white font-semibold py-2 px-6 rounded-full">
              Free Trial
            </button>
            <FreeTrialPanel isPanelOpen={isPanelOpen} togglePanel={togglePanel} />
            <button className="cta-white bg-white text-black font-semibold py-2 px-6 rounded-full">
              Create Account
            </button>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 mt-8">
          {/* Company Column */}
          <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="usefull-links space-y-2">
              <li><a href="/">Home</a></li>
              <li><a href="/about-us">About Us</a></li>
              <li><a href="/contact-us">Contact Us</a></li>
              <li><a href="/privacy-policy">Privacy Policy</a></li>
              <li><a href="/blog">Blog</a></li>
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="font-bold text-lg mb-4">Services</h3>
            <ul className="usefull-links space-y-2">
              <li><a href="/real-estate">Real Estate</a></li>
              <li><a href="/3d-services">3D Services</a></li>
              <li><a href="/wedding-events">Wedding - Events</a></li>
              <li><a href="/people-retouching/">People</a></li>
              <li><a href="/products-ecommerce">Products – eCommerce</a></li>
              <li><a href="/clipping-path-extraction">Clipping Path & Extraction</a></li>
              <li><a href="/custom-payment-service">Custom Payment Service</a></li>
            </ul>
          </div>

          {/* Get Started Column */}
          <div>
            <h3 className="font-bold text-lg mb-4">Get Started</h3>
            <ul className="usefull-links space-y-2">
              <li><a href="/login">Login</a></li>
              <li><a href="/register">Register</a></li>
            </ul>
          </div>

          {/* Logo Section */}
          <div className="flex flex-col items-center">
            <img src={logo} alt="Snapp Editt" className="mb-4" />
          </div>
        </div>


      </section>
      <section>
        {/* Footer Bottom */}
        <div className="bg-customGray py-4">
          <div className="footer-bottom container mx-auto flex justify-between items-center px-4">
            {/* Left: Copyright */}
            <p className="text-customtextGray hover:text-white text-sm">
              {new Date().getFullYear()} &copy; All rights reserved
            </p>

            {/* Center: Made With Love */}
            <div className="w-auto flex items-center whitespace-nowrap gap-1">
              <p className="text-white text-sm flex items-center">
                Made With <FaHeart className="text-red-500 mx-1" /> <a
                  href="https://atriawebsolutions.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-customtextGray"
                >Atria Web Solutions</a>
              </p>
            </div>

            {/* Right: Social Media Icons */}
            <div className="flex gap-4">
              <a href="https://api.whatsapp.com/send/?phone=12394945666&text=I%27m+interested+in+your+Image+Services&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="text-customtextGray hover:text-gray-300 text-lg">
                <FaWhatsapp />
              </a>
              <a href="https://www.facebook.com/snappeditt/"
                target="_blank"
                rel="noopener noreferrer" className="text-customtextGray hover:text-gray-300 text-lg">
                <FaFacebookF />
              </a>
              <a href="https://join.skype.com/invite/xyphtEF260if"
                target="_blank"
                rel="noopener noreferrer" className="text-customtextGray hover:text-gray-300 text-lg">
                <FaSkype />
              </a>
              <a href="https://www.instagram.com/snappeditt/"
                target="_blank"
                rel="noopener noreferrer" className="text-customtextGray hover:text-gray-300 text-lg">
                <FaInstagram />
              </a>
              <a href="https://www.linkedin.com/in/snapp-editt-b45295219/"
                target="_blank"
                rel="noopener noreferrer" className="text-customtextGray hover:text-gray-300 text-lg">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>

      </section>
    </>
  );
};

export default ShopFooter;
