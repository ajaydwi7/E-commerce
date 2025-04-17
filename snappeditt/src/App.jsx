import React, { useState, useEffect } from "react";
import {
  Routes, Route, Navigate, useNavigate
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomeView from "./views/HomeView";
import AboutView from "./views/AboutView";

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
import FloorPlanView from "./views/Services/FloorPlanView";
import ContactUsView from "./views/ContactUsView";
import ServicePage from "./components/OurServices/SingleService/ServicePage";
import ForgotPassword from "./components/Authentication/ForgotPassword";
import ResetPassword from "./components/Authentication/ResetPassword";
import Checkout from "./components/Checkout/Checkout";
import CustomPaymentServiceView from "./views/Services/CustomPaymentServiceView";
import UserProfile from "./views/ProfileView";
import PaymentForm from "./components/GlobalComponents/PaymentForm/PaymentForm";
import PrivacyPolicy from "./views/PrivacyPolicy";
import SignIn from "./components/Authentication/SignIn";
import SignUp from "./components/Authentication/Signup";
import CustomPaymentSuccess from "./components/OurServices/CustomPaymentService/CustomPaymentSuccess";
import CustomPaymentCancel from "./components/OurServices/CustomPaymentService/CustomPaymentCancel";
import ThankYou from "./components/OurServices/CustomPaymentService/ThankYou";
// import RequestCookie from "./components/CookieBanner/CookieBanner";
// Admin Import 
import { AdminProvider } from "./admin/contexts/AdminContext";
import AdminLayout from "./admin/components/layout/AdminLayout";
import Dashboard from "./admin/pages/dashboard";
import Settings from "./admin/pages/settings/settings"
import Login from "./admin/pages/auth/signin"
import Register from "./admin/pages/auth/signup"
import ForgotPasswordAdmin from "./admin/pages/auth/forgot-password"
import ResetPasswordAdmin from "./admin/pages/auth/reset-password"
import ServiceList from "./admin/pages/ServiceList";
import ServiceForm from './admin/pages/ServiceForm';
import ServiceDetail from "@/admin/pages/ServiceDetail"
import CategoryManagement from './admin/pages/CategoryManagement';
import UserManagement from "./admin/pages/UserManagement"
import UserDetail from "./admin/pages/UserDetail"
import OrderManagement from "./admin/pages/OrderManagement"
import OrderDetail from "./admin/pages/OrderDetail"
import CouponManagement from "./admin/pages/CouponManagement"
import ProfilePage from "@/admin/pages/ProfilePage"
import AdminManagement from "./admin/pages/AdminManagement";
import NotificationsPage from "./admin/pages/NotificationsPage"
import ContactFormManagement from "./admin/pages/ContactFormManagement"
import ContactFormDetail from "./admin/pages/ContactFormDetail"
import FreeTrialManagement from "./admin/pages/FreeTrialManagement"
import FreeTrialDetail from "./admin/pages/FreeTrialDetail"



const ProtectedRoute = ({ children }) => {
  const { auth } = useGlobalContext();
  return auth.state.user ? children : <Navigate to="/login" replace />;
};

// Update ProtectedAdminRoute in App.jsx
const ProtectedAdminRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/check-auth`, {
          credentials: 'include',
        });

        const data = await response.json();
        setIsAuthenticated(data.authenticated);

        if (!data.authenticated) {
          navigate('/admin/auth/signin');
        }
      } catch (error) {
        navigate('/admin/auth/signin');
      }
    };

    verifyAuth();
  }, [navigate]);

  if (isAuthenticated === null) return <Loader />;

  return isAuthenticated ? children : null;
};
function App() {
  const [loading, setLoading] = useState(true);
  const { orders, auth } = useGlobalContext();

  const MIN_LOADING_TIME = 0; // 2 seconds

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
          <Routes>
            <Route element={<MainLayout />}>
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
              <Route path="/about-us" element={<AboutView />} />
              <Route path="/real-estate" element={<RealStateView />} />
              <Route path="services/:categorySlug/:serviceSlug" element={<ServicePage />} />
              <Route path="/3d-services" element={<ThreeDServicesView />} />
              <Route path="/wedding-events" element={<WeddingEventsView />} />
              <Route path="/products-ecommerce" element={<ProductECommerceView />} />
              <Route path="/people-retouching" element={<PeopleRetouchingView />} />
              <Route path="/clipping-path-extraction" element={<ClippingPathExtractionView />} />
              <Route path="/custom-payment-service" element={<CustomPaymentServiceView />} />
              <Route path="/floor-plan" element={<FloorPlanView />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="/custom-payment-success" element={<CustomPaymentSuccess />} />
              <Route path="/custom-payment-cancel" element={<CustomPaymentCancel />} />
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
            </Route>
            {/* admin layouts */}
            <Route path="/admin">
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="auth/signin" element={<Login />} />
              <Route path="auth/signup" element={<Register />} />
              <Route path="auth/forgot-password" element={<ForgotPasswordAdmin />} />
              <Route path="auth/reset-password/:token" element={<ResetPasswordAdmin />} />

              <Route element={<AdminProvider><ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute></AdminProvider>}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="categories" element={<CategoryManagement />} />
                {/* Service Management */}
                <Route path="services">
                  <Route index element={<ServiceList />} />
                  <Route path="new" element={<ServiceForm />} />
                  <Route path="edit/:categorySlug/:subCategorySlug/:serviceSlug" element={<ServiceForm />} />
                  <Route path="view/:categorySlug/:subCategorySlug/:serviceSlug" element={<ServiceDetail />} />
                </Route>
                {/* user management */}
                <Route path="users">
                  <Route index element={<UserManagement />} />
                  <Route path=":userId" element={<UserDetail />} />
                </Route>

                {/* Order Management */}
                <Route path="orders">
                  <Route index element={<OrderManagement />} />
                  <Route path=":orderId" element={<OrderDetail />} />
                </Route>

                {/* Coupon Management */}
                <Route path="coupons" element={<CouponManagement />} />
                <Route path="settings" element={<Settings />} />

                <Route path="profile" element={<ProfilePage />} />
                <Route path="admins" element={<AdminManagement />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="contact-forms">
                  <Route index element={<ContactFormManagement />} />
                  <Route path=":formId" element={<ContactFormDetail />} />
                </Route>
                <Route path="free-trials">
                  <Route index element={<FreeTrialManagement />} />
                  <Route path=":trialId" element={<FreeTrialDetail />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </>
      )}
      <ToastContainer />
      {/* Uncomment this if you want to show the cookie banner */}
      {/* <RequestCookie /> */}
    </div>
  );
}

export default App;