const express = require("express");
const router = express.Router();

const tv_controller = require("../controllers/tvController");
const brand_controller = require("../controllers/brandController");
const category_controller = require("../controllers/categoryController");

/// TV ROUTES ///

// GET products home page
router.get("/", tv_controller.index);

// GET request for creating TV
router.get("/tv/create", tv_controller.tv_create_get);

// POST request for creating TV
router.post("/tv/create", tv_controller.tv_create_post);

// GET request to update TV
router.get("tv/:id/update", tv_controller.tv_update_get);

// POST request to update TV
router.get("tv/:id/update", tv_controller.tv_update_post);

// GET request to delete TV
router.get("tv/:id/delete", tv_controller.tv_delete_get);

// POST request to delete TV
router.post("tv/:id/delete", tv_controller.tv_delete_post);

// GET request for one TV
router.get("/tv/:id", tv_controller.tv_detail);

// GET request for list of all TVs
router.get("/tvs", tv_controller.tv_list);

/// BRAND ROUTES ///

// GET request for one Brand
router.get("/brand/:id", brand_controller.brand_detail);

// GET request for list of all Brands
router.get("/brands", brand_controller.brand_list);

// GET request for creating a Brand
router.get("/brand/create", brand_controller.brand_create_get);

// POST request for creating a Brand
router.post("/brand/create", brand_controller.brand_create_post);

// GET request for updating a Brand
router.get("/brand/update", brand_controller.brand_update_get);

// POST request for updating a Brand
router.post("/brand/update", brand_controller.brand_update_post);

// GET request for deleting a Brand
router.get("/brand/create", brand_controller.brand_delete_get);

// POST request for deleting a Brand
router.post("/brand/create", brand_controller.brand_delete_post);

/// CATEGORY ROUTES ///

// GET request for creating a Category
router.get("/category/create", category_controller.category_create_get);

// POST request for creating a Category
router.post("/category/create", category_controller.category_create_post);

// GET request to update Category
router.get("/category/:id/update", category_controller.category_update_get);

// POST request to update Category
router.post("/category/:id/update", category_controller.category_update_post);

// GET request to delete Category
router.get("/category/:id/delete", category_controller.category_delete_get);

// POST request to delete Category
router.post("/category/:id/delete", category_controller.category_delete_post);

// GET request for one Category
router.get("/category/:id", category_controller.category_detail);

// POST request for list of all Category
router.get("/categories/", category_controller.category_list);

module.exports = router;
