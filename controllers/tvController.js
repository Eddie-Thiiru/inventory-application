const asyncHandler = require("express-async-handler");

const TV = require("../models/tv");
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

// // Display tv create form on GET
// exports.tv_create_get = asyncHandler(async (req, res, next) => {
//   const [allTVs, allCategories] = await Promise.all([
//     TV.find().exec(),
//     Category.find().exec(),
//   ]);

//   res.render("tv_form", {
//     title: "Create TV",
//     tvs: allTVs,
//     categories: allCategories,
//   });
// });

// Handle book create on POST
