const User = require("../models/User"); // Assuming you have a User model
const jwt = require("jsonwebtoken");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

exports.getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    res.status(200).json({
      totalUsers,
      totalProducts,
      totalOrders,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    res.status(400).json({ error: "Failed to add product" });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

exports.getReports = async (req, res) => {
  try {
    // Implement logic to fetch reports
    res.status(200).json({ message: "Reports fetched successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password); // Implement login logic
    if (!user || !user.isAdmin) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const token = createToken(user._id);
    res.cookie("userToken", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: true,
    });
    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.adminLogout = (req, res) => {
  res.cookie("userToken", "", { maxAge: 1 });
  res.status(200).json({ message: "User Logged Out" });
};
