const express = require("express");
const serviceController = require("../Controller/serviceController");
const {
  uploadServiceImages,
  handleUploadErrors,
} = require("../middleware/uploadMiddleware.js");

const router = express.Router();

//services Routes
router.get("/get-services", serviceController.getAllServices);

// Category Routes
router.get("/:categories", serviceController.getAllCategories);
router.get("/categories/:categorySlug", serviceController.getCategoryBySlug);
router.post("/categories", serviceController.addCategory); // New route for adding a category

// Subcategory Routes
router.post(
  "/categories/:categorySlug/subcategories",
  serviceController.addSubcategory
);
router.get(
  "/categories/:categorySlug/:subCategorySlug",
  serviceController.getSubcategoryBySlug
);

// Service Routes
router.post(
  "/categories/:categorySlug/:subCategorySlug/services",
  serviceController.addService
);
// Define the route for getting all services

router.get("/:categorySlug/:serviceSlug", serviceController.getServiceBySlug);

router.put("/categories/:categorySlug", serviceController.updateCategory);
router.put(
  "/categories/:categorySlug/subcategories/:subCategorySlug",
  serviceController.updateSubcategory
);
router.put(
  "/categories/:categorySlug/:subCategorySlug/services/:serviceSlug",
  serviceController.updateService
);

// serviceRoutes.js
router.get(
  "/categories-with-subcategories",
  serviceController.getAllCategoriesWithSubcategories
);

router.get(
  "/admin/services/:categorySlug/:subCategorySlug/:serviceSlug",
  serviceController.getServiceBySlugs
);

router.get("/get-only-services", serviceController.getOnlyServices);

router.delete(
  "/categories/:categorySlug/:subCategorySlug/services/:serviceSlug",
  serviceController.deleteService
);

router.delete("/categories/:categorySlug", serviceController.deleteCategory);

router.delete(
  "/categories/:categorySlug/subcategories/:subCategorySlug",
  serviceController.deleteSubcategory
);
// Add these new routes
router.post(
  "/upload-images",
  uploadServiceImages,
  handleUploadErrors,
  (req, res) => {
    const files = req.files;
    const response = {};
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    if (files.featureImage) {
      response.featureImage = `${baseUrl}/uploads/${files.featureImage[0].filename}`;
    }
    if (files.beforeImage) {
      response.beforeImage = `${baseUrl}/uploads/${files.beforeImage[0].filename}`;
    }
    if (files.afterImage) {
      response.afterImage = `${baseUrl}/uploads/${files.afterImage[0].filename}`;
    }

    res.json(response);
  }
);
module.exports = router;
