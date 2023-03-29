const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Product schema
const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
});

// Subcategory schema
const subcategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  products: [productSchema],
});

// Category schema
const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  subcategories: [subcategorySchema],
});

// Export models
const Category = mongoose.model("Category", categorySchema);
const Subcategory = mongoose.model("Subcategory", subcategorySchema);
const Product = mongoose.model("Product", productSchema);

module.exports = { Category, Subcategory, Product };
