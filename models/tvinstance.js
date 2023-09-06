const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TVInstanceSchema = new Schema({
  tv: { type: Schema.Types.ObjectId, ref: "TV", required: true },
  status: {
    type: String,
    required: true,
    enum: ["Available", "Out of Stock", "Coming Soon"],
    default: "Coming Soon",
  },
});

TVInstanceSchema.virtual("url").get(function () {
  return `/products/tvinstance/${this.id}`;
});

module.exports = mongoose.module("TVInstance", TVInstanceSchema);
