import React from "react";
import SEO from "@/components/SEO/SEO";
import Order from "../components/Cart/Order";

const CartView = () => {
  return (
    <div>
      <SEO
        title="Cart | SnappEditt"
        noindex={true}
      />
      <main>
        <Order></Order>
      </main>
    </div>
  );
};
export default CartView;
