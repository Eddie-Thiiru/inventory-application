#! /usr/bin/env node

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const TV = require("./models/tv");
const Category = require("./models/category");
const Brand = require("./models/brand");

const categories = [];
const brands = [];
const tvs = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createBrands();
  await createTVs();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function categoryCreate(index, name) {
  const category = new Category({ name: name });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function brandCreate(index, name) {
  const brand = new Brand({ name: name });
  await brand.save();
  brands[index] = brand;
  console.log(`Added brand: ${name}`);
}

async function tvCreate(
  index,
  brand,
  model_name,
  screen_size,
  resolution,
  refresh_rate,
  special_features,
  supported_internet_services,
  release_date,
  price,
  number_in_stock,
  category
) {
  const tvDetail = {
    brand: brand,
    model_name: model_name,
    screen_size: screen_size,
    resolution: resolution,
    refresh_rate: refresh_rate,
    special_features: special_features,
    supported_internet_services: supported_internet_services,
    release_date: release_date,
    price: price,
    number_in_stock: number_in_stock,
    category: category,
  };
  if (category !== false) tvDetail.category = category;

  const tv = new TV(tvDetail);
  await tv.save();
  tvs[index] = tv;
  console.log(`Added tv: ${tv.brand} ${tv.screen_size} ${tv.model_name}`);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(0, "LED & LCD TVs"),
    categoryCreate(1, "QLED TVs"),
    categoryCreate(2, "OLED TVs"),
    categoryCreate(3, "4K TVs"),
    categoryCreate(4, "8K TVs"),
  ]);
}

async function createBrands() {
  console.log("Adding brands");
  await Promise.all([
    brandCreate(0, "SAMSUNG"),
    brandCreate(1, "LG"),
    brandCreate(2, "SONY"),
    brandCreate(3, "TCL"),
    brandCreate(4, "Hisense"),
    brandCreate(5, "VIZIO"),
  ]);
}

async function createTVs() {
  console.log("Adding TVs");
  await Promise.all([
    tvCreate(
      0,
      brands[0],
      "Class QLED 4K Q70C",
      "75",
      "4K",
      "120 Hz",
      "100% Color Volume with Quantum Dot; Real Depth Enhancer; Works with Google Assistant and Alexa, Quantum Processor with 4K Upscal; Motion Xcelerator Turbo+; Dual LED",
      "Apple TV+, Samsung TV Plus, Netflix, YouTube, Prime Video, Disney+, Hulu, Xbox, Nvidia GeForce NOW, ESPN and MaxApple TV+, Samsung TV Plus, Netflix, YouTube, Prime Video, Disney+, Hulu, Xbox, Nvidia GeForce NOW, ESPN and Max",
      "2023-3-13",
      1800,
      100,
      [categories[1], categories[3]]
    ),
    tvCreate(
      1,
      brands[0],
      "Class OLED 4K S90C",
      "65",
      "4K",
      "120 Hz",
      "Neural Quantum Processor with 4K Upscaling; Quantum HDR OLED, Real Depth Enhancer; HDR10+; Works with Google Assistant and Alexa",
      "Apple TV+, Samsung TV Plus, Netflix, YouTube, Prime Video, Disney+, Hulu, Xbox, Nvidia GeForce NOW, ESPN and Max",
      "2023-3-30",
      1500,
      200,
      [categories[2], categories[3]]
    ),
    tvCreate(
      2,
      brands[1],
      "Class C2 4K OLED evo w/ ThinQ AI",
      "55",
      "4K",
      "120 Hz",
      "Pixel Level Dimming; Intense Color; Billion Rich Colors; Cinema HDR; NVIDIA GEFORCE NOW; Wide Viewing Angle; Dynamic Tone Mapping Pro; Room to Room Share",
      "Netflix, HBO Max, Prime Video, Apple TV, Disney+ and more",
      "2022-3-27",
      1125,
      200,
      [categories[2], categories[3]]
    ),
    tvCreate(
      3,
      brands[2],
      "BRAVIA XR 8K MASTER SERIES Z9K",
      "85",
      "8K",
      "120 Hz",
      "XR Backlight Master Drive",
      "Hulu, browser",
      "2022-3-26",
      6999,
      20,
      [categories[0], categories[4]]
    ),
    tvCreate(
      4,
      brands[3],
      "CLASS 4-SERIES 4K SMART ROKU TV - 50S431",
      "55",
      "4K",
      "60 Hz",
      "HDR Technology;Dolby Digital Plus",
      "Netflix,HuluYouTube,Pandora,Amazon Instant Video,HBO Max,Discovery +,Disney +,Apple Tv",
      "2022-6-1",
      345,
      180,
      [categories[0], categories[3]]
    ),
    tvCreate(
      5,
      brands[4],
      "U8 Mini-LED 4K",
      "65",
      "4K",
      "120 Hz",
      "Quantum Dot Color;ULED technologies;Dolby Vision HDR;Game Mode Pro;Filmmaker Mode",
      "YouTube, Browser, prime_video, apple_tv, spotify, google_tv",
      "2022-7-7",
      899,
      35,
      [categories[1], categories[3]]
    ),
    tvCreate(
      6,
      brands[5],
      "D-Series Full HD 1080p Smart TV",
      "40",
      "1080p",
      "60 Hz",
      "DTS Virtual:X, Free Channels with WatchFree+",
      "Netflix, Disney+, YouTube, HBO Max",
      "2021-8-18",
      168,
      150,
      [categories[1]]
    ),
  ]);
}
