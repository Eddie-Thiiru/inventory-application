const express = require("express");
const router = express.Router();

const tv_controller = require("../controllers/tvController");
const category_controller = require("../controllers/categoryController");
const tv_instance_controller = require("../controllers/tvinstanceController");

/// TV ROUTES ///

// GET products home page
router.get("/", tv_controller.index);

// GET request for creating TV
router.get("/tv/create", tv_controller.tv_create_get);

// POST request for creating TV
router.post("/tv/create".tv_controller.tv_create_post);

// GET request to delete TV
router.get("tv/:id/delete", tv_controller.tv_delete_get);

// POST request to delete TV
router.post("tv/:id/delete", tv_controller.tv_delete_post);

// GET request to update TV
router.get("tv/:id/update", tv_controller.tv_update_get);

// POST request to update TV
router.get("tv/:id/update", tv_controller.tv_update_post);

// GET request for one TV
router.get("tv/:id", tv_controller.tv_detail);

// GET request for list of all TVs
router.get("/tvs", tv_controller.tv_list);

/// CATEGORY ROUTES ///

// GET request for creating a Category
router.get("/category/create", category_controller.category_create_get);

// POST request for creating a Category
router.post("/category/create", category_controller.category_create_post);

// GET request to delete Category
router.get("/category/:id/delete", category_controller.category_delete_get);

// POST request to delete Category
router.post("/category/:id/delete", category_controller.category_delete_post);

// GET request to update Category
router.get("/category/:id/update", category_controller / category_update_get);

// POST request to update Category
router.post("/category/:id/update", category_controller / category_update_post);

// GET request for one Category
router.get("/category/:id", category_controller.category_detail);

// POST request for list of all Category
router.get("/category/", category_controller.category_list);

/// TVINSTANCE ROUTES ///

// GET request for creating a TVInstance
router.get("/category/create", tv_instance_controller.tvinstance_create_get);

// POST request for creating a TVInstance
router.post("/category/create", tv_instance_controller.tvinstance_create_post);

// GET request to delete TVInstance
router.get(
  "/category/:id/delete",
  tv_instance_controller.tvinstance_delete_get
);

// POST request to delete TVInstance
router.post(
  "/category/:id/delete",
  tv_instance_controller.tvinstance_delete_post
);

// GET request to update TVInstance
router.get(
  "/category/:id/update",
  tv_instance_controller.tvinstance_update_get
);

// POST request to update TVInstance
router.post(
  "/category/:id/update",
  tv_instance_controller.tvinstance_update_post
);

// GET request for one TVInstance
router.get("/category/:id", tv_instance_controller.tvinstance_detail);

// POST request for list of all TVInstance
router.get("/category/", tv_instance_controller.tvinstance_list);

module.exports = router;
