const asyncHandler = require("express-async-handler");

const Category = require("../models/category");
const TV = require("../models/tv");

// Display list of all categories
exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find({}, "name weight")
    .sort({ weight: 1 })
    .populate("name")
    .exec();

  res.render("category_list", {
    title: "Category List",
    category_list: allCategories,
  });
});

// Display page for a particular category
exports.category_detail = asyncHandler(async (req, res, next) => {
  const [category, tvsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    TV.find({ category: req.params.id }, "brand screenSize modelName").exec(),
  ]);

  if (category === null) {
    const err = new Error("Category not found");
    err.status = 404;
    next(err);
  }

  res.render("category_detail", {
    title: "Category Detail",
    category: category,
    category_tvs: tvsInCategory,
  });
});
