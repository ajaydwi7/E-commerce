const Coupon = require("../models/Coupon");

exports.validateCoupon = async (req, res) => {
  const { code, cartTotal } = req.body;

  try {
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) return res.status(404).json({ error: "Invalid coupon code" });
    if (coupon.expirationDate < Date.now())
      return res.status(400).json({ error: "Coupon has expired" });
    if (coupon.maxUses && coupon.timesUsed >= coupon.maxUses)
      return res.status(400).json({ error: "Coupon usage limit reached" });
    if (cartTotal < coupon.minCartValue)
      return res.status(400).json({
        error: `Minimum cart value of $${coupon.minCartValue} required`,
      });

    let discount =
      coupon.discountType === "percentage"
        ? (cartTotal * coupon.discountValue) / 100
        : coupon.discountValue;

    // Ensure discount doesn't exceed cart total
    discount = Math.min(discount, cartTotal);

    res.json({
      valid: true,
      code: coupon.code,
      discount,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
    });
  } catch (error) {
    console.error("Coupon validation error:", error);
    res.status(500).json({ error: "Server error during coupon validation" });
  }
};

exports.createCoupon = async (req, res) => {
  try {
    const couponData = {
      ...req.body,
      code: req.body.code.toUpperCase(),
      createdBy: req.admin._id,
    };
    const coupon = new Coupon(couponData);
    await coupon.save();
    res.status(201).json(coupon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch coupons" });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }
    res.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete coupon" });
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    const updates = { ...req.body, lastModifiedBy: req.admin._id };

    if (updates.code) {
      updates.code = updates.code.toUpperCase();
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedCoupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }

    res.json(updatedCoupon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
