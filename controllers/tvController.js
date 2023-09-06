const asyncHandler = require("express-async-handler");

const TV = require("../models/tv");
const Category = require("../models/category");
const TVInstance = require("../models/tvinstance");

exports.index = asyncHandler(async (req, res, next) => {
  const [numTVs, numTVInstances, numTVsInStock, numCategories] =
    await Promise.all([
      TV.countDocuments({}).exec(),
      TVInstance.countDocuments({}).exec(),
      TVInstance.countDocuments({ status: "Available" }).exec(),
      Category.countDocuments({}).exec(),
    ]);

  res.render("index", {
    title: "Home",
    tv_count: numTVs,
    tv_instance_count: numTVInstances,
    tv_instance_stock_count: numTVsInStock,
    category_count: numCategories,
  });
});

// Display list of all TVs
exports.tv_list = asyncHandler(async (req, res, next) => {
  const allTVs = await TV.find({}, "brand screen_size model_name")
    .sort({ model_name: 1 })
    .exec();

  res.render("tv_list", { title: "TV List", tv_list: allTVs });
});

// Display detail page for a specific TV
exports.tv_detail = asyncHandler(async (req, res, next) => {
  const [tv, tvInstances] = await Promise.all([
    tv.findById(req.params.id).exec(),
    tvInstances.find({ tv: req.params.id }).exec(),
  ]);

  if (tv === null) {
    const err = new Error("TV not found");
    err.status = 404;
    return next(err);
  }

  res.render("tv_detail", {
    title: `${tv.brand} ${tv.screen_size} ${tv.model_name}`,
    tv: tv,
    tv_instances: tvInstances,
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
