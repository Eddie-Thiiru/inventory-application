const asyncHandler = require("express-async-handler");

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
