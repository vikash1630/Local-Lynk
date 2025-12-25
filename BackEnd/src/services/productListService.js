const Product = require("../models/Product");

exports.getProducts = async (search) => {
  let query = { status: "available" };

  if (search && search.trim()) {
    query.name = {
      $regex: `^${search}`, // prefix search (lap → laptop)
      $options: "i"
    };
  }

  const products = await Product.find(query)
    .select("name price description images")
    .limit(20)
    .sort({ createdAt: -1 });

  return products;
};
