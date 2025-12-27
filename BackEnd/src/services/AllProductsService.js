// services/productService.js
const Product = require("../models/Product");
const axios = require("axios");

// Reverse Geocoding function
const getLocationName = async (lng, lat) => {
  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/reverse",
      {
        params: {
          lat,
          lon: lng,
          format: "json",
        },
        headers: {
          "User-Agent": "LocalLynkApp/1.0", // IMPORTANT
        },
      }
    );

    return response.data.display_name || "Unknown location";
  } catch (error) {
    return "Unknown location";
  }
};

exports.getAllProductsService = async () => {
  const products = await Product.find()
    .populate("owner", "name email")
    .lean();

  const formattedProducts = {};

  for (const product of products) {
    const [lng, lat] = product.location.coordinates;

    const locationName = await getLocationName(lng, lat);

    formattedProducts[product._id] = {
      id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      status: product.status,
      images: product.images,
      owner: product.owner,
      location: {
        name: locationName,
        coordinates: {
          longitude: lng,
          latitude: lat,
        },
      },
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
  console.log(formattedProducts);
  return formattedProducts;
};
