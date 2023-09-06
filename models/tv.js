const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TVSchema = new Schema({
  brand: { type: String, required: true },
  modelName: { type: String, required: true },
  screenSize: { type: String, required: true },
  resolution: { type: String, required: true },
  refreshRate: { type: String, required: true },
  specialFeatures: { type: String, required: true },
  supportedInternetServices: { type: String, required: true },
  releaseDate: { type: Date },
  price: { type: Number },
  numberInStock: { type: Number },
});

TVSchema.virtual("url").get(function () {
  return `/products/tv/${this._id}`;
});

module.exports = mongoose.model("TV", TVSchema);
