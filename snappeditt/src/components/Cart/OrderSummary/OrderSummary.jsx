import { useState, useEffect } from "react";
import { useGlobalContext } from "@/components/GlobalContext/GlobalContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./OrderSummary.css";

const OrderSummary = () => {
  const { serviceStore, auth } = useGlobalContext();
  const {
    state: { cart, cartQuantity },
    clearCart,
  } = serviceStore;
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();

  // Update applyCoupon function
  const applyCoupon = async () => {
    if (!couponCode) {
      toast.error("Please enter a coupon code");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode,
          cartTotal: cartTotal
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid coupon");
      }

      setDiscount(data.discount);
      toast.success("Coupon applied successfully!");
    } catch (error) {
      setDiscount(0);
      toast.error(error.message);
    }
  };

  // Add useEffect to clear discount when cart changes
  useEffect(() => {
    setDiscount(0);
    setCouponCode("");
  }, [cart]);




  const proceedToCheckout = () => {
    if (!auth.state.user) {
      modal.openModal();
      return;
    }
    // Ensure numeric conversion
    const numericCartTotal = Number(
      cart.reduce(
        (total, item) => total + (item.finalPrice ?? item.basePrice) * item.quantity,
        0
      )
    );

    // const cartTotal = cart.reduce(
    //   (total, item) => total + (item.finalPrice ?? item.basePrice) * item.quantity,
    //   0
    // );

    navigate("/checkout", {
      state: {
        cartItems: cart,
        cartTotal: numericCartTotal,
        userId: auth.state.user.id,
        couponCode: discount > 0 ? couponCode : null,
        discount: discount,
      },
    });
  };

  // Calculate total price dynamically
  const cartTotal = cart.reduce(
    (total, item) => total + (item.finalPrice ?? item.basePrice) * item.quantity,
    0
  );
  const totalCost = cartTotal - discount;

  return (
    <div className="is-order-summary">
      <div className="sub-container">
        <div className="contains-order">
          {/* Total Items */}
          <div className="total-cost">
            <h4>Subtotal ({cartQuantity} items)</h4>
            <h4>${cartTotal.toFixed(2)}</h4>
          </div>

          {/* Order Items */}
          <div className="order-items">
            {cart.map((item) => (
              <div key={item.serviceId || item.id || item._id} className="order-item">
                <span>{item.name}</span>
                <span>
                  ${item.finalPrice ?? item.basePrice} x {item.quantity} = $
                  {((item.finalPrice ?? item.basePrice) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Coupon Code */}
          <div className="coupon-section">
            <h4>Coupon Code</h4>
            <div className="coupon-input">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button
                className="apply-coupon"
                onClick={applyCoupon}
                disabled={!couponCode}
              >
                Apply
              </button>
            </div>
            {discount > 0 && (
              <div className="discount-info">
                <span>Discount Applied (-${discount.toFixed(2)})</span>
              </div>
            )}
          </div>

          {/* Final Total Cost */}
          <div className="final-cost">
            <h4>Total Cost</h4>
            <h4>${totalCost.toFixed(2)}</h4>
          </div>

          {/* Checkout Button */}
          <div className="final-checkout">
            <button
              className="flat-button checkout bg-primaryBlack"
              onClick={proceedToCheckout}
              disabled={cartQuantity === 0}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
