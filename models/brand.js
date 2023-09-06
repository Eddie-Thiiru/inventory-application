const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BrandSchema = new Schema({
  name: { type: String, required: true, minLength: 1, maxLength: 20 },
});

BrandSchema.virtual("url").get(function () {
  return `/products/brand/${this.id}`;
});

module.exports = mongoose.model("Brand", BrandSchema);
