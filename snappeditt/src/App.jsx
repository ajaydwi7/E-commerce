import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ScrollToTopButton from "./components/GlobalComponents/ScrollToTopButton/ScrollToTopButton";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import HomeView from "./views/HomeView";
import AboutView from "./views/AboutView";
import NavBar from "@/components/NavBar/NavBar";
import ShopFooter from "@/components/Footer/ShopFooter";
import ErrorView from "./views/ErrorView";
import CartView from "./views/CartView";
import DeliveryView from "./views/DeliveryView";
import "react-loading-skeleton/dist/skeleton.css";
import { useGlobalContext } from "@/components/GlobalContext/GlobalContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "@/components/GlobalComponents/Loader/Loader";
import RealStateView from "./views/Services/RealStateView";
import ThreeDServicesView from "./views/Services/ThreeDServicesView";
import WeddingEventsView from "./views/Services/WeddingEventsView";
import ProductECommerceView from "./views/Services/ProductsEcommerceView";
import PeopleRetouchingView from "./views/Services/PeopleRetouchingView";
import ClippingPathExtractionView from "./views/Services/ClippingPathExtractionView";
import ContactUsView from "./views/ContactUsView";
import ServicePage from "./components/OurServices/RealState/ServicePage";
import ForgotPassword from "./components/Authentication/ForgotPassword";
import ResetPassword from "./components/Authentication/ResetPassword";
import Checkout from "./components/Checkout/Checkout";
import CustomPaymentServiceView from "./views/Services/CustomPaymentServiceView";
import UserProfile from "./views/ProfileView";
import PaymentForm from "./components/GlobalComponents/PaymentForm/PaymentForm";
import PrivacyPolicy from "./views/PrivacyPolicy";
import SignIn from "./components/Authentication/SignIn";
import SignUp from "./components/Authentication/Signup";
import NavBar2 from "./components/NavBar/navbarNew";

// import Admin from "./admin/adminRoutes";
// import RequestCookie from "./components/CookieBanner/CookieBanner";

const ProtectedRoute = ({ children }) => {
  const { auth } = useGlobalContext();
  return auth.state.user ? children : <Navigate to="/login" replace />;
};

function App() {
  const [loading, setLoading] = useState(true); // Add loader state
  const { orders, auth } = useGlobalContext(); // Access auth context to check user role

  /// Add a minimum loading time
  const MIN_LOADING_TIME = 1000; // 2 seconds

  useEffect(() => {
    const fetchServices = async () => {
      const startTime = Date.now();

      try {
        if (orders.state?.services?.length === 0) {
          await orders.fetchOrders();
        }
      } finally {
        // Calculate remaining time to meet minimum duration
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(MIN_LOADING_TIME - elapsed, 0);

        // Wait for remaining time before hiding loader
        setTimeout(() => setLoading(false), remaining);
      }
    };

    fetchServices();
  }, [orders]);

  return (
    <div>
      {loading ? (
        // Display the loader while loading is true
        <div style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}>
          <Loader />
        </div>
      ) : (
        <>
          <ScrollToTopButton />
          <header>
            <NavBar2 />
          </header>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route
              path="/user"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            {/* <Route path="/admin" element={<Admin />} /> */}
            <Route path="/about-us" element={<AboutView />} />
            <Route path="/services/real-estate" element={<RealStateView />} />
            <Route path="services/:categorySlug/:serviceSlug" element={<ServicePage />} />
            <Route path="/services/3d-services" element={<ThreeDServicesView />} />
            <Route path="/services/wedding-events" element={<WeddingEventsView />} />
            <Route path="/services/products-ecommerce" element={<ProductECommerceView />} />
            <Route path="/services/people-retouching" element={<PeopleRetouchingView />} />
            <Route path="/services/clipping-path-extraction" element={<ClippingPathExtractionView />} />
            <Route path="/services/custom-payment-service" element={<CustomPaymentServiceView />} />
            <Route
              path="payment-form"
              element={<PaymentForm />}
            />
            <Route path="/contact-us" element={<ContactUsView />} />
            <Route path="/cart" element={<CartView />} />
            <Route path="/orders" element={<DeliveryView />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="*" element={<ErrorView />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          </Routes>
          <footer>
            <ShopFooter />
          </footer>
        </>
      )}

      {/* Display Modal when needed */}
      {/* {modal.opened && (
        <Modal
          header={modal.isRegister ? "Create Account" : "Login"}
          submitAction={() => { }}
          buttonText={modal.isRegister ? "Create Account" : "Login"}
          isRegister={modal.isRegister}
          onClose={() => {
            modal.closeModal(); // Close modal
            navigate("/"); // Navigate to home or desired route
          }}
        />
      )} */}
      {/* Display CancelOrder modal when required */}
      {/* {modal.isCancelModal && <CancelOrder />} */}

      <ToastContainer />
      {/* Uncomment this if you want to show the cookie banner */}
      {/* <RequestCookie /> */}
    </div>
  );
}

export default App;
