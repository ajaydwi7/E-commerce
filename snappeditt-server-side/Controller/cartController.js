const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Category = require("../models/Category");

exports.addToCart = async (req, res) => {
  const userId = req.user.id; // From authenticated user
  const { item } = req.body;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid user ID format" });
  }

  if (!userId || !item) {
    return res
      .status(400)
      .json({ error: "User ID and item data are required" });
  }

  try {
    const category = await Category.findOne({
      "subCategories.services._id": item.serviceId,
    });

    if (!category) {
      return res.status(404).json({ error: "Service not found" });
    }

    let foundService = null;
    category.subCategories.forEach((subCategory) => {
      const service = subCategory.services.find(
        (srv) => srv._id.toString() === item.serviceId
      );
      if (service) foundService = service;
    });

    if (!foundService) {
      return res.status(404).json({ error: "Service not found" });
    }

    // Calculate the final price
    let finalPrice = foundService.basePrice;

    // In addToCart controller
    if (item.selectedVariations && item.selectedVariations.length > 0) {
      // Collect selected option names
      const selectedNames = item.selectedVariations.map((v) => v.optionName);

      // Find matching combination by names
      const combination = foundService.priceCombinations.find(
        (pc) =>
          pc.combination.length === selectedNames.length &&
          pc.combination.every((name) => selectedNames.includes(name))
      );

      if (combination) {
        finalPrice = combination.price;
      } else {
        return res.status(400).json({ error: "Invalid variation combination" });
      }
    } else {
      finalPrice = foundService.basePrice;
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
        cartTotal: 0,
        cartQuantity: 0,
      });
    }

    const existingItemIndex = cart.items.findIndex((cartItem) => {
      // 1. Check service ID match
      if (cartItem.serviceId.toString() !== item.serviceId) return false;

      // 2. Compare variation combinations
      const existingVariationIds = cartItem.selectedVariations
        .map((v) => v.optionId.toString())
        .sort()
        .join("-");

      const newVariationIds = item.selectedVariations
        .map((v) => v.optionId.toString())
        .sort()
        .join("-");

      return existingVariationIds === newVariationIds;
    });

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += item.quantity;
      cart.items[existingItemIndex].finalPrice = finalPrice;
    } else {
      cart.items.push({
        serviceId: foundService._id,
        serviceName: foundService.name,
        basePrice: Number(foundService.basePrice || 0),
        finalPrice: Number(finalPrice || foundService.basePrice || 0),
        quantity: item.quantity,
        featureImage: foundService.featureImage,
        selectedVariations: item.selectedVariations,
        formData: item.formData,
      });
    }

    // Correct cart total calculation
    cart.cartTotal = cart.items.reduce(
      (total, item) => total + item.finalPrice * item.quantity,
      0
    );
    cart.cartQuantity = cart.items.reduce(
      (total, item) => total + item.quantity,
      0
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
};

exports.updateCartQuantity = async (req, res) => {
  const userId = req.user.id;
  const { serviceId, quantity, selectedVariations } = req.body; // Add selectedVariations

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    // Find item by serviceId AND variation combination
    const itemIndex = cart.items.findIndex((cartItem) => {
      // Check service ID match
      const sameService = cartItem.serviceId.toString() === serviceId;

      // Check variations (sorted to ignore order)
      const existingVariations = cartItem.selectedVariations
        .map((v) => v.optionId.toString())
        .sort()
        .join("-");

      const newVariations = selectedVariations
        .map((v) => v.optionId.toString())
        .sort()
        .join("-");

      return sameService && existingVariations === newVariations;
    });

    if (itemIndex === -1)
      return res.status(404).json({ error: "Item not found" });

    // Update quantity
    cart.items[itemIndex].quantity = quantity;

    // Recalculate totals
    cart.cartTotal = cart.items.reduce(
      (total, item) => total + item.finalPrice * item.quantity,
      0
    );
    cart.cartQuantity = cart.items.reduce(
      (total, item) => total + item.quantity,
      0
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ error: "Failed to update cart" });
  }
};

// Fetch user's cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    res.status(200).json(cart || { items: [], cartTotal: 0, cartQuantity: 0 });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  const userId = req.user.id; // From authenticated user
  const { serviceId } = req.body;

  if (!userId || !serviceId) {
    return res
      .status(400)
      .json({ error: "User ID and Service ID are required" });
  }

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.serviceId.toString() !== serviceId
    );

    // Update cart totals
    cart.cartTotal = cart.items.reduce(
      (total, item) => total + item.finalPrice * item.quantity,
      0
    );
    cart.cartQuantity = cart.items.reduce(
      (total, item) => total + item.quantity,
      0
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ error: "Failed to remove item from cart" });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id; // From authenticated user
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const cart = await Cart.findOneAndDelete({ user: userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ error: "Failed to clear cart" });
  }
};
