const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const Brand = require("../models/brand");
const TV = require("../models/tv");

// Display list of all Brands
exports.brand_list = asyncHandler(async (req, res, next) => {
  const allBrands = await Brand.find().exec();

  res.render("brand_list", { title: "Brand List", brand_list: allBrands });
});

// Display page for a specific Brand
exports.brand_detail = asyncHandler(async (req, res, next) => {
  const [brand, allTvsByBrand] = await Promise.all([
    Brand.findById(req.params.id).populate("name").exec(),
    TV.find({ brand: req.params.id }, "screen_size model_name").exec(),
  ]);

  if (brand === null) {
    const err = new err("Brand not found");
    err.status = 404;
    return next(err);
  }

  res.render("brand_detail", {
    title: "Brand Detail",
    brand: brand,
    brand_tvs: allTvsByBrand,
  });
});

// Display brand create form on GET
exports.brand_create_get = (req, res, next) => {
  res.render("brand_form", { title: "Create Brand" });
};

// Handle brand create on POST
exports.brand_create_post = [
  body("name", "Brand name must contain at least on character")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const brand = new Brand({ name: req.body.name });

    if (!errors.isEmpty()) {
      res.render("brand_form", {
        title: "Create Brand",
        brand: brand,
        errors: errors.array(),
      });
      return;
    } else {
      // Check if brand already exists
      const brandExists = await Brand.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();

      if (brandExists) {
        // Redirect to its detail page
        res.redirect(brandExists.url);
      } else {
        await brand.save();
        res.redirect(brand.url);
      }
    }
  }),
];

// Display brand update form on GET
exports.brand_update_get = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findById(req.body.id);

  if (brand === null) {
    const err = new Error("Brand not found");
    err.status = 404;
    return next(err);
  } else {
    res.render("brand_form", { title: "Update Brand", brand: brand });
  }
});

// Handle brand update on POST
exports.brand_update_post = [
  body("name", "Brand name must contain at least on character")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    // Create a brand object with the old id!
    const brand = new Brand({ name: req.body.name, _id: req.params.id });

    if (!errors.isEmpty()) {
      res.render("brand_form", {
        title: "Update Brand",
        brand: brand,
        errors: errors.array(),
      });
      return;
    } else {
      await Brand.findByIdAndUpdate(req.params.id, brand);
      res.redirect(brand.url);
    }
  }),
];

// Display brand delete form on GET
exports.brand_delete_get = asyncHandler(async (req, res, next) => {
  const [brand, allTvsByBrand] = await Promise.all([
    Brand.findById(req.params.id).populate("name").exec(),
    TV.find({ brand: req.params.id }, "screen_size model_name").exec(),
  ]);

  if (brand === null) {
    res.redirect("/products/brands");
  }

  res.render("brand_delete", {
    title: "Delete Brand",
    brand: brand,
    brand_tvs: allTvsByBrand,
  });
});

// Handle brand delete on POST
exports.brand_delete_post = asyncHandler(async (req, res, next) => {
  const [brand, allTvsByBrand] = await Promise.all([
    Brand.findById(req.params.id).populate("name").exec(),
    TV.find({ brand: req.params.id }, "screen_size model_name").exec(),
  ]);

  if (allTvsByBrand.length > 0) {
    res.render("brand_delete", {
      title: "Delete Brand",
      brand: brand,
      brand_tvs: allTvsByBrand,
    });
    return;
  } else {
    await Brand.findByIdAndRemove(req.body.id);
    res.redirect("products/brands");
  }
});
