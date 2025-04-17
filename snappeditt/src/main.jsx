import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import GlobalContext from "./components/GlobalContext/GlobalContext";
import "./assets/css/main.css";
import { BrowserRouter } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const initialOptions = {
  "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
  currency: "USD",
  intent: "capture",
  components: "buttons", // Explicitly load buttons component
  "data-sdk-integration-source": "developer-studio",
  "enable-funding": "paypal",
  "buyer-country": "US",
};



ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <React.StrictMode>
      <PayPalScriptProvider options={initialOptions}>
        <GlobalContext>
          <HelmetProvider>
            <App />
          </HelmetProvider>
        </GlobalContext>
      </PayPalScriptProvider>
    </React.StrictMode>
  </BrowserRouter>
);
