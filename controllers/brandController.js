const asyncHandler = require("express-async-handler");

const Brand = require("../models/brand");
const TV = require("../models/tv");

// Display list of all Brands
exports.brand_list = asyncHandler(async (req, res, next) => {
  const allBrands = await Brand.find().sort({ name: 1 }).exec();

  res.render("brand_list", { title: "Brand List", brand_list: allBrands });
});

// Display page for a specific Brand
exports.brand_detail = asyncHandler(async (req, res, next) => {
  const [brand, allTvsByBrand] = await Promise.all([
    Brand.findById(req.params.id).exec(),
    TV.find({ brand: req.params.id }, "brand, screen_size, model_name").exec(),
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
