const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const Category = require("../models/category");
const TV = require("../models/tv");

// Display list of all categories
exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().exec();

  res.render("category_list", {
    title: "Category List",
    category_list: allCategories,
  });
});

// Display page for a particular category
exports.category_detail = asyncHandler(async (req, res, next) => {
  const [category, tvsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    TV.find({ category: req.params.id }, "brand screen_size model_name")
      .populate("brand")
      .exec(),
  ]);

  if (category === null) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_detail", {
    title: "Category Detail",
    category: category,
    category_tvs: tvsInCategory,
  });
});

// Display category create form on GET
exports.category_create_get = (req, res, next) => {
  res.render("category_form", { title: "Create Category" });
};

// Handle category create on POST
exports.category_create_post = [
  body("name", "Category name must contain at least 2 characters")
    .trim()
    .isLength({ min: 2 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({ name: req.body.name });

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Create Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      // Check if category already exists
      const categoryExists = await Category.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();

      if (categoryExists) {
        // Redirect to category
        res.redirect(categoryExists.url);
      } else {
        await category.save();
        res.redirect(category.url);
      }
    }
  }),
];

// Display category update form on GET
exports.category_update_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();

  if (category === null) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  } else {
    res.render("category_form", {
      title: "Update Category",
      category: category,
    });
  }
});

// Handle category update on POST
exports.category_update_post = [
  body("name", "Category name must contain at least 2 characters")
    .trim()
    .isLength({ min: 2 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    // Create a category object with the old id to update
    const category = new Category({ name: req.body.name, _id: req.params.id });

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Update Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      await Category.findByIdAndUpdate(req.params.id, category);
      res.redirect(category.url);
    }
  }),
];

// Display category delete form on Get
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const [category, tvsInCategory] = await Promise.all([
    Category.findById(req.params.id).populate("name").exec(),
    TV.find({ category: req.params.id }, "brand screen_size model_name")
      .populate("brand")
      .exec(),
  ]);

  if (category === null) {
    res.redirect("/products/categories");
  }

  res.render("category_delete", {
    title: "Delete Category",
    category: category,
    category_tvs: tvsInCategory,
  });
});

// Handle category delete on POST
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const [category, tvsInCategory] = await Promise.all([
    Category.findById(req.params.id).populate("name").exec(),
    TV.find({ category: req.params.id }, "screen_size model_name").exec(),
  ]);

  if (tvsInCategory.length > 0) {
    res.render("category_delete", {
      title: "Delete Category",
      category: category,
      category_tvs: tvsInCategory,
    });
    return;
  } else {
    await Category.findByIdAndRemove(req.params.id);
    res.redirect("/products/categories");
  }
});
