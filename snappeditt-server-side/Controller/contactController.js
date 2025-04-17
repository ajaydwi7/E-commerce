const ContactForm = require("../models/ContactForm");
const nodemailer = require("nodemailer");
const Admin = require("../models/Admin");
const { createNotification } = require("./notificationController");
exports.submitContactForm = async (req, res) => {
  const { firstName, lastName, email, phone, topic, message, acceptTerms } =
    req.body;

  try {
    // Save form data to the database
    const newContact = new ContactForm({
      firstName,
      lastName,
      email,
      phone,
      topic,
      message,
      acceptTerms,
    });

    await newContact.save();

    // Send emails
    await sendContactEmailToServiceProvider(newContact); // Email to you
    await sendThankYouEmailToUser(newContact); // Email to user
    // Notify admins
    const admins = await Admin.find({
      roles: { $in: ["super-admin", "support"] },
      notificationPreferences: { $in: ["contact"] },
    });

    await Promise.all(
      admins.map(async (admin) => {
        await createNotification(
          admin._id,
          "contact",
          `New contact form submission: ${topic}`,
          newContact._id,
          "ContactForm"
        );
      })
    );
    res
      .status(200)
      .json({ success: true, message: "Form submitted successfully." });
  } catch (error) {
    console.error("Error in submitContactForm:", error); // Log detailed error
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Email to service provider
const sendContactEmailToServiceProvider = async (contactData) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // Use Gmail as the email service
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASS, // Your Gmail app password
    },
  });

  const mailOptions = {
    from: contactData.email, // Sender email
    to: process.env.EMAIL_USER, // Service provider's email
    subject: `New Contact Form Submission: ${contactData.topic}`,
    text: `
      New Contact Form Submission:
      ----------------------------
      Name: ${contactData.firstName} ${contactData.lastName}
      Email: ${contactData.email}
      Phone: ${contactData.phone}
      Topic: ${contactData.topic}
      Message: ${contactData.message || "No message provided."}
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Thank-you email to user
const sendThankYouEmailToUser = async (contactData) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // Use Gmail as the email service
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASS, // Your Gmail app password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER, // Your email (sender)
    to: contactData.email, // User's email (recipient)
    subject: "Thank You for Submitting the Contact Form",
    text: `
      Dear ${contactData.firstName} ${contactData.lastName},

      Thank you for getting in touch with us regarding "${contactData.topic}".
      We have received your message and our team will get back to you soon.

      Here is a copy of the details you submitted:
      ------------------------------------------------
      Name: ${contactData.firstName} ${contactData.lastName}
      Email: ${contactData.email}
      Phone: ${contactData.phone}
      Topic: ${contactData.topic}
      Message: ${contactData.message || "No message provided."}

      Best regards,
      Your Snapp Editt
    `,
  };

  await transporter.sendMail(mailOptions);
};
