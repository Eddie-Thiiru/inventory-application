const asyncHandler = require("express-async-handler");

const TVInstance = require("../models/tvinstance");

// Display list of all TV instances
exports.tvintance_list = asyncHandler(async (req, res, next) => {
  const allTVInstances = await TVInstance.find().populate("tv").exec();

  res.render("tvinstance_list", {
    title: "TV Instance List",
    tvinstance_list: allTVInstances,
  });
});

// Display page for a specific book instance
exports.tvintance_detail = asyncHandler(async (req, res, next) => {
  const tvInstance = await TVInstance.findById(req.params.id)
    .populate("tv")
    .exec();

  if (tvInstance === null) {
    const err = new Error("TV copy not found");
    err.status = 404;
    next(err);
  }

  res.render("tvinstance_detail", { title: "tv", tvinstance: tvInstance });
});
