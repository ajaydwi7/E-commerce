"use client"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CustomPaymentCancel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/checkout", { state: { error: "Payment cancelled" } });
  }, []);

  return <div>Processing payment cancellation...</div>;
};

export default CustomPaymentCancel;