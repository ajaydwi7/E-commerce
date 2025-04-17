const Category = require("../models/Category");
const serviceService = require("../services/serviceService");
const Service = require("../models/Category");

// Add a new category
exports.addCategory = async (req, res) => {
  try {
    const { name, slug, description } = req.body;

    // Check if the category already exists
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res
        .status(400)
        .json({ message: "Category with this slug already exists" });
    }

    // Create a new category
    const newCategory = new Category({
      name,
      slug,
      description,
      subCategories: [], // Initialize with empty subcategories
    });

    // Save the category to the database
    await newCategory.save();

    res.status(201).json(newCategory);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding category", error: error.message });
  }
};

// Existing methods...
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await serviceService.findAll();
    res.status(200).json(categories);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching categories", error: error.message });
  }
};

exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await serviceService.findBySlug(req.params.categorySlug);
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.status(200).json(category);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching category", error: error.message });
  }
};

exports.addSubcategory = async (req, res) => {
  try {
    const updatedCategory = await serviceService.addSubcategory(
      req.params.categorySlug,
      req.body
    );
    res.status(201).json(updatedCategory);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding subcategory", error: error.message });
  }
};

exports.getSubcategoryBySlug = async (req, res) => {
  try {
    const subcategory = await serviceService.findSubcategoryBySlug(
      req.params.categorySlug,
      req.params.subCategorySlug
    );
    if (!subcategory)
      return res.status(404).json({ message: "Subcategory not found" });
    res.status(200).json(subcategory);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching subcategory", error: error.message });
  }
};

exports.addService = async (req, res) => {
  try {
    const serviceData = req.body;
    const { categorySlug, subCategorySlug } = req.params;

    const category = await Category.findOne({ slug: categorySlug });
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    const subcategory = category.subCategories.find(
      (sub) => sub.slug === subCategorySlug
    );
    if (!subcategory)
      return res.status(404).json({ message: "Subcategory not found" });

    // Add service to subcategory
    subcategory.services.push(serviceData);
    await category.save();

    // Return the new service with proper context
    const newService = subcategory.services[subcategory.services.length - 1];
    res.status(201).json({
      ...newService.toObject(),
      category: category.name,
      categorySlug: category.slug,
      subcategory: subcategory.name,
      subCategorySlug: subcategory.slug,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding service", error: error.message });
  }
};

// serviceController.js
// serviceController.js - Update getAllServices
// serviceController.js - Update getAllServices
// Modified getAllServices controller
exports.getAllServices = async (req, res) => {
  try {
    const categories = await Category.find()
      .lean()
      .select("name slug subCategories");

    // Flatten services with proper category context
    const services = categories.flatMap((category) =>
      category.subCategories.flatMap((subCategory) =>
        subCategory.services.map((service) => ({
          ...service,
          _id: service._id.toString(),
          category: category.name,
          categorySlug: category.slug,
          subcategory: subCategory.name,
          subCategorySlug: subCategory.slug,
          createdAt: service.createdAt,
          updatedAt: service.updatedAt,
        }))
      )
    );

    // Return only services array
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching services",
      error: error.message,
    });
  }
};

// Get service by slug
exports.getServiceBySlug = async (req, res) => {
  const { categorySlug, serviceSlug } = req.params;

  try {
    const category = await Category.findOne({ slug: categorySlug }).populate({
      path: "subCategories",
      populate: {
        path: "services",
        match: { slug: serviceSlug },
      },
    });

    if (!category) return res.status(404).json({ error: "Category not found" });

    let foundService = null;
    for (const subCategory of category.subCategories) {
      foundService = subCategory.services.find((s) => s.slug === serviceSlug);
      if (foundService) break;
    }

    if (!foundService)
      return res.status(404).json({ error: "Service not found" });

    res.status(200).json(foundService);
  } catch (error) {
    console.error("Error fetching service:", error);
    res.status(500).json({ error: "Failed to fetch service" });
  }
};

// Update entire category
exports.updateCategory = async (req, res) => {
  try {
    const { categorySlug } = req.params;
    const updateData = req.body;

    const updatedCategory = await Category.findOneAndUpdate(
      { slug: categorySlug },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating category", error: error.message });
  }
};

// Update subcategory
exports.updateSubcategory = async (req, res) => {
  try {
    const { categorySlug, subCategorySlug } = req.params;
    const updateData = req.body;

    const updatedCategory = await Category.findOneAndUpdate(
      {
        slug: categorySlug,
        "subCategories.slug": subCategorySlug,
      },
      {
        $set: {
          "subCategories.$.name": updateData.name,
          "subCategories.$.slug": updateData.slug,
          "subCategories.$.description": updateData.description,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating subcategory", error: error.message });
  }
};

// Update service
exports.updateService = async (req, res) => {
  try {
    const { categorySlug, subCategorySlug, serviceSlug } = req.params;
    const updateData = req.body;

    const updatedCategory = await Category.findOneAndUpdate(
      {
        slug: categorySlug,
        "subCategories.slug": subCategorySlug,
        "subCategories.services.slug": serviceSlug,
      },
      {
        $set: {
          "subCategories.$[subCat].services.$[service]": updateData,
        },
      },
      {
        arrayFilters: [
          { "subCat.slug": subCategorySlug },
          { "service.slug": serviceSlug },
        ],
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating service", error: error.message });
  }
};

// serviceController.js
exports.getAllCategoriesWithSubcategories = async (req, res) => {
  try {
    const categories = await Category.find().populate({
      path: "subCategories",
      select: "name slug description services",
      populate: {
        path: "services",
        select: "name slug basePrice",
      },
    });
    res.status(200).json(categories);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching categories", error: error.message });
  }
};

// Create service in specific subcategory
// exports.addService = async (req, res) => {
//   try {
//     const serviceData = req.body;

//     const category = await Category.findOne({ slug: req.params.categorySlug });
//     if (!category)
//       return res.status(404).json({ message: "Category not found" });

//     const subcategory = category.subCategories.find(
//       (s) => s.slug === req.params.subCategorySlug
//     );
//     if (!subcategory)
//       return res.status(404).json({ message: "Subcategory not found" });

//     const newService = subcategory.services.create(serviceData);
//     subcategory.services.push(newService);

//     await category.save();
//     res.status(201).json(newService);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error adding service", error: error.message });
//   }
// };

exports.getServicesByCategory = async (req, res) => {
  try {
    const { categorySlug, subCategorySlug } = req.params;
    const category = await Category.findOne({ slug: categorySlug }).populate({
      path: "subCategories",
      match: { slug: subCategorySlug },
      populate: {
        path: "services",
      },
    });

    if (!category)
      return res.status(404).json({ message: "Category not found" });

    const subcategory = category.subCategories.find(
      (s) => s.slug === subCategorySlug
    );
    if (!subcategory)
      return res.status(404).json({ message: "Subcategory not found" });

    res.status(200).json(subcategory.services);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching services", error: error.message });
  }
};

exports.getServiceBySlugs = async (req, res) => {
  const { categorySlug, subCategorySlug, serviceSlug } = req.params;
  try {
    const category = await Category.findOne({ slug: categorySlug });
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    const subcategory = category.subCategories.find(
      (s) => s.slug === subCategorySlug
    );
    if (!subcategory)
      return res.status(404).json({ message: "Subcategory not found" });

    const service = subcategory.services.find((s) => s.slug === serviceSlug);
    if (!service) return res.status(404).json({ message: "Service not found" });

    res.status(200).json({
      ...service.toObject(),
      categorySlug: category.slug,
      subCategorySlug: subcategory.slug,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching service", error: error.message });
  }
};

exports.getOnlyServices = async (req, res) => {
  try {
    // Fetch only the required fields without category and subcategory references
    const services = await Service.find(
      {},
      { name: 1, basePrice: 1, featureImage: 1 }
    );

    if (!services || services.length === 0) {
      return res.status(404).json({ message: "No services found" });
    }

    res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ error: "Failed to fetch services" });
  }
};

// serviceController.js
exports.deleteService = async (req, res) => {
  try {
    const { categorySlug, subCategorySlug, serviceSlug } = req.params;

    const updatedCategory = await Category.findOneAndUpdate(
      { slug: categorySlug },
      {
        $pull: {
          "subCategories.$[subCat].services": { slug: serviceSlug },
        },
      },
      {
        arrayFilters: [{ "subCat.slug": subCategorySlug }],
        new: true,
      }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting service",
      error: error.message,
    });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const { categorySlug } = req.params;
    const deletedCategory = await Category.findOneAndDelete({
      slug: categorySlug,
    });

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting category",
      error: error.message,
    });
  }
};

// Delete subcategory
exports.deleteSubcategory = async (req, res) => {
  try {
    const { categorySlug, subCategorySlug } = req.params;

    const updatedCategory = await Category.findOneAndUpdate(
      { slug: categorySlug },
      { $pull: { subCategories: { slug: subCategorySlug } } },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Verify subcategory was removed
    const subExists = updatedCategory.subCategories.some(
      (sub) => sub.slug === subCategorySlug
    );

    if (subExists) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    res.status(200).json({ message: "Subcategory deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting subcategory",
      error: error.message,
    });
  }
};
