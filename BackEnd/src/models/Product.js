// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    price: Number,
    status: {
      type: String,
      enum: ["available", "sold"],
      default: "available",
    },
    quantity: {
      type: Number,
      default: 1,
      min: 0,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number],
        default: [78.4867, 17.3850] // Hyderabad, India (lng, lat)
      }
    },
    images: [String],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

productSchema.index({ location: "2dsphere" })
productSchema.index({ name: "text" });

module.exports = mongoose.model("Product", productSchema);



