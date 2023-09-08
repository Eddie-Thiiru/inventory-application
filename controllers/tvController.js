const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const TV = require("../models/tv");
const Brand = require("../models/brand");
const Category = require("../models/category");

exports.index = asyncHandler(async (req, res, next) => {
  const [numTVs, numTVsInStock, numCategories] = await Promise.all([
    TV.countDocuments({}).exec(),
    TV.countDocuments().populate("number_in_stock").exec(),
    Category.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "Home",
    tv_count: numTVs,
    tv_stock_count: numTVsInStock,
    category_count: numCategories,
  });
});

// Display list of all TVs
exports.tv_list = asyncHandler(async (req, res, next) => {
  const allTVs = await TV.find({}, "brand screen_size model_name")
    .sort({ model_name: 1 })
    .populate("brand")
    .exec();

  res.render("tv_list", { title: "TV List", tv_list: allTVs });
});

// Display detail page for a specific TV
exports.tv_detail = asyncHandler(async (req, res, next) => {
  const tv = await TV.findById(req.params.id)
    .populate("brand")
    .populate("category")
    .exec();

  if (tv === null) {
    const err = new Error("TV not found");
    err.status = 404;
    return next(err);
  }

  res.render("tv_detail", {
    tv: tv,
  });
});

// Display tv create form on GET
exports.tv_create_get = asyncHandler(async (req, res, next) => {
  const [allBrands, allCategories] = await Promise.all([
    Brand.find().exec(),
    Category.find().exec(),
  ]);

  res.render("tv_form", {
    title: "Create TV",
    brands: allBrands,
    categories: allCategories,
  });
});

// Handle book create on POST
exports.tv_create_post = [
  // convert category to an array to make validation possible
  (req, res, next) => {
    if (!(req.body.category instanceof Array)) {
      if (typeof req.body.category === "undefined") {
        req.body.category = [];
      } else {
        req.body.genre = new Array(req.body.genre);
      }
    }
    next();
  },

  // Validate and sanitize fields
  body("brand", "Brand must be specified").trim().isLength({ min: 1 }).escape(),
  body("model_name", "Model name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("screen_size", "Screen size must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("resolution", "Resolution must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("refresh_rate", "Refresh rate must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("special_features", "Special features must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("supported_internet_services", "Internet services must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("release_date", "Invalid date")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  body("price", "Price must not be empty").trim().isLength({ min: 1 }).escape(),
  body("number_in_stock", "Number of stock must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category.*").escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const tv = new TV({
      brand: req.body.brand,
      model_name: req.body.model_name,
      screen_size: req.body.screen_size,
      resolution: req.body.resolution,
      refresh_rate: req.body.refresh_rate,
      special_features: req.body.special_features,
      supported_internet_services: req.body.supported_internet_services,
      release_date: req.body.release_date,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
      category: req.body.category,
    });

    if (!errors.isEmpty()) {
      const [allBrands, allCategories] = await Promise.all([
        Brand.find().exec(),
        Category.find().exec(),
      ]);

      // Mark selected categories as checked
      for (const category of allCategories) {
        if (tv.category.includes(category._id)) {
          category.checked = "true";
        }
      }

      res.render("tv_form", {
        title: "Create TV",
        brands: allBrands,
        categories: allCategories,
        tv: tv,
        errors: errors.array(),
      });

      return;
    } else {
      await tv.save();
      res.redirect(tv.url);
    }
  }),
];

// Display tv update form on GET
exports.tv_update_get = asyncHandler(async (req, res, next) => {
  const [tv, allBrands, allCategories] = await Promise.all([
    TV.findById(req.params.id).exec(),
    Brand.find().exec(),
    Category.find().exec(),
  ]);

  if (tv === null) {
    // No results.
    const err = new Error("TV not found");
    err.status = 404;
    return next(err);
  }

  // Mark selected categories as checked
  for (const category of allCategories) {
    for (const tv_category of tv.category) {
      if (category._id.toString() === tv_category._id.toString()) {
        category.checked = "true";
      }
    }
  }

  res.render("tv_form", {
    title: "Update TV",
    brands: allBrands,
    categories: allCategories,
    tv: tv,
  });
});

// Handle tv update on POST
exports.tv_update_post = [
  // convert category to an array to make validation possible
  (req, res, next) => {
    if (!(req.body.category instanceof Array)) {
      if (typeof req.body.category === "undefined") {
        req.body.category = [];
      } else {
        req.body.category = new Array(req.body.category);
      }
    }
    next();
  },

  // Validate and sanitize fields
  body("brand", "Brand must be specified").trim().isLength({ min: 1 }).escape(),
  body("model_name", "Model name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("screen_size", "Screen size must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("resolution", "Resolution must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("refresh_rate", "Refresh rate must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("special_features", "Special features must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("supported_internet_services", "Internet services must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("release_date", "Invalid date")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  body("price", "Price must not be empty").trim().isLength({ min: 1 }).escape(),
  body("number_in_stock", "Number of stock must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category.*").escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    // Create a category object with the old id to update
    // This is required, or a new ID will be assigned!
    const tv = new TV({
      brand: req.body.brand,
      model_name: req.body.model_name,
      screen_size: req.body.screen_size,
      resolution: req.body.resolution,
      refresh_rate: req.body.refresh_rate,
      special_features: req.body.special_features,
      supported_internet_services: req.body.supported_internet_services,
      release_date: req.body.release_date,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
      category:
        typeof req.body.category === "undefined" ? [] : req.body.category,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      const [allBrands, allCategories] = await Promise.all([
        Brand.find().exec(),
        Category.find().exec(),
      ]);

      // Mark selected categories as checked
      for (const category of allCategories) {
        if (tv.category.includes(category._id)) {
          category.checked = "true";
        }
      }

      res.render("tv_form", {
        title: "Update TV",
        brands: allBrands,
        categories: allCategories,
        tv: tv,
        errors: errors.array(),
      });

      return;
    } else {
      await TV.findByIdAndUpdate(req.params.id, tv);
      res.redirect(tv.url);
    }
  }),
];

// Display tv delete form on GET
exports.tv_delete_get = asyncHandler(async (req, res, next) => {
  const tv = await TV.findById(req.params.id)
    .populate("brand")
    .populate("category")
    .exec();

  if (tv === null) {
    res.redirect("/products/tvs");
  }

  res.render("tv_delete", { title: "Delete TV", tv: tv });
});

// Handle tv delete on POST
exports.tv_delete_post = asyncHandler(async (req, res, next) => {
  const tv = await TV.findById(req.params.id)
    .populate("brand")
    .populate("category")
    .exec();

  if (tv === null) {
    res.redirect("/products/tvs");
  }

  await TV.findByIdAndRemove(req.params.id);

  res.redirect("/products/tvs");
});
