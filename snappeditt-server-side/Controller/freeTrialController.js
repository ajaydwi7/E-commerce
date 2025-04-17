const FreeTrial = require("../models/freeTrial");
const Admin = require("../models/Admin");
const { sendFreeTrialConfirmation } = require("../utils/emailSender");
const { createNotification } = require("./notificationController");

// @desc    Submit Free Trial Form
// @route   POST /api/free-trial
// @access  Public
const submitFreeTrial = async (req, res) => {
  try {
    // Create a new FreeTrial document using request data
    const freeTrialData = new FreeTrial({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      service: req.body.service,
      images: req.body.images,
      orderName: req.body.orderName,
      imageLinks: req.body.imageLinks,
      description: req.body.description,
    });

    // Save to the database
    await freeTrialData.save();
    // Send confirmation email to user
    await sendFreeTrialConfirmation(freeTrialData.email, freeTrialData);
    // Notify admins
    const admins = await Admin.find({
      roles: { $in: ["super-admin", "editor"] },
      notificationPreferences: { $in: ["trial"] },
    });

    await Promise.all(
      admins.map(async (admin) => {
        await createNotification(
          admin._id,
          "trial",
          `New free trial request: ${freeTrialData.service}`, // Changed from ${service}
          freeTrialData._id,
          "FreeTrial"
        );
      })
    );
    return res
      .status(201)
      .json({ message: "Free trial form submitted successfully!" });
  } catch (error) {
    console.error("Error submitting free trial:", error.message);
    return res
      .status(500)
      .json({ message: "Error submitting form", error: error.message });
  }
};

// Export controller methods
module.exports = {
  submitFreeTrial,
};
