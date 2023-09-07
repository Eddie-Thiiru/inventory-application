const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TVSchema = new Schema({
  brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
  model_name: { type: String, required: true },
  screen_size: { type: String, required: true },
  resolution: { type: String, required: true },
  refresh_rate: { type: String, required: true },
  special_features: { type: String, required: true },
  supported_internet_services: { type: String, required: true },
  release_date: { type: Date },
  price: { type: Number, required: true },
  number_in_stock: { type: Number, required: true },
  category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
});

TVSchema.virtual("url").get(function () {
  return `/products/tv/${this._id}`;
});

module.exports = mongoose.model("TV", TVSchema);
