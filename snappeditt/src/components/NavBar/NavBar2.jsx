"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingCart, FaChevronDown } from "react-icons/fa";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { useGlobalContext } from "@/components/GlobalContext/GlobalContext";
import { Link } from "react-router-dom";
import FreeTrialPanel from "@/components/FreeTrialPanel/FreeTrialPanel";
import Logo from "./Logo/Logo";
import "./navbarnew.css"

const NavBar2 = () => {
  const { auth, serviceStore } = useGlobalContext();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isServicesOpenDesktop, setIsServicesOpenDesktop] = useState(false);
  const [isServicesOpenMobile, setIsServicesOpenMobile] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const servicesRef = useRef(null);
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target)) {
        setIsServicesOpenDesktop(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setIsMobileOpen(false);
        setIsServicesOpenMobile(false); // Also reset mobile services state
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const services = [
    "Real-Estate",
    "Floor Plan",
    "3D Services",
    "Wedding Events",
    "Products ~ eCommerce",
    "People Retouching",
    "Clipping Path ~ Extraction",
    "Custom Payment Service",
  ];

  return (
    <nav className="bg-white shadow-sm relative z-50">
      <div className="sub-container max-w-7xl mx-auto sm:px-6 lg:px-0">
        <div className=" flex items-center justify-between">

          {/* Logo with proper spacing */}
          <div className="flex-shrink-0">

            <Logo />

          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about-us" className="nav-link">About</Link>

            {/* Services Dropdown */}
            <div className="relative" ref={servicesRef}>
              <button
                onClick={() => setIsServicesOpenDesktop(!isServicesOpenDesktop)}
                className="nav-link flex items-center gap-1"
              >
                Services
                <motion.span
                  animate={{ rotate: isServicesOpenDesktop ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaChevronDown className="text-sm" />
                </motion.span>
              </button>

              <AnimatePresence>
                {isServicesOpenDesktop && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-white rounded-lg shadow-xl mt-2 py-2"
                  >
                    {services.map((service) => (
                      <Link
                        key={service}
                        to={`/${service.toLowerCase().replace(/[\s~]+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                        className="block px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600"
                        onClick={() => setIsServicesOpenDesktop(false)}
                      >
                        {service}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/contact-us" className="nav-link">Contact</Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-red-600"
            >
              <FaShoppingCart className="w-6 h-6" />
              {serviceStore.state.cartQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {serviceStore.state.cartQuantity}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              {auth.state.user ? (
                <>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-2 rounded-full hover:bg-red-50"
                  >
                    <img
                      src={`https://api.dicebear.com/6.x/initials/svg?seed=${auth.state.user.firstName}&backgroundColor=f44336`}
                      alt="Profile"
                      className="w-8 h-8 rounded-full border-2 border-red-600"
                    />
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white z-0 rounded-lg shadow-xl py-2"
                      >
                        <Link
                          to="/user"
                          className="block px-4 py-3 hover:bg-red-50 text-black hover:text-red-600"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Profile
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-4 py-3 hover:bg-red-50 text-black hover:text-red-600"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Orders
                        </Link>
                        <button
                          onClick={auth.logout}
                          className="w-full text-left px-4 py-3 hover:bg-red-50 hover:text-red-600"
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Free Trial Button - Desktop */}
            <button
              onClick={() => setIsPanelOpen(true)}
              className="hidden md:block px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full hover:shadow-lg"
            >
              Free Trial
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden p-2 text-gray-700 ml-4"
            >
              {isMobileOpen ? <HiX className="w-6 h-6" /> : <HiMenuAlt3 className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden absolute w-full left-0 bg-white shadow-lg border-t"
            >
              <div className="px-4 pt-2 pb-8 space-y-2">
                <Link to="/" className="mobile-link" onClick={() => setIsMobileOpen(false)}>
                  Home
                </Link>
                <Link to="/about-us" className="mobile-link" onClick={() => setIsMobileOpen(false)}>
                  About
                </Link>

                {/* Mobile Services Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsServicesOpenMobile(!isServicesOpenMobile)}
                    className="mobile-link flex justify-between items-center w-full"
                  >
                    Services
                    <FaChevronDown
                      className={`transition-transform ${isServicesOpenMobile ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isServicesOpenMobile && (
                    <div className="pl-4 mt-2 space-y-2">
                      {services.map((service) => (
                        <Link
                          key={service}
                          to={`/services/${service.toLowerCase().replace(/ ~ /g, "-")}`}
                          className="block px-4 py-2 text-gray-700 hover:bg-red-50 rounded-lg"
                          onClick={() => {
                            setIsServicesOpenMobile(false);
                            setIsMobileOpen(false);
                          }}
                        >
                          {service}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link to="/contact-us" className="mobile-link" onClick={() => setIsMobileOpen(false)}>
                  Contact
                </Link>

                {/* Free Trial Button - Mobile */}
                <button
                  onClick={() => {
                    setIsPanelOpen(true);
                    setIsMobileOpen(false);
                  }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full hover:shadow-lg"
                >
                  Free Trial
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <FreeTrialPanel
        isPanelOpen={isPanelOpen}
        togglePanel={() => setIsPanelOpen(!isPanelOpen)}
      />
    </nav>
  );
};

export default NavBar2;