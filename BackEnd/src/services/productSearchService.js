const Product = require("../models/Product");

exports.searchByName = async (query) => {
  if (!query || query.trim() === "") return [];

  const products = await Product.find({
    name: {
      $regex: query,
      $options: "i"        // case-insensitive
    },
    status: "available"    // optional, but recommended
  })
    .select("name price")
    .limit(5);
  console.log("Products Found in Search Service:", products);
  return products;
};
