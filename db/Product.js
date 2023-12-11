const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  userId: String,
});
const product = mongoose.model("product", productSchema);

module.exports = product;
