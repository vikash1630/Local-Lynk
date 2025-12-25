const Product = require('../models/Product');

exports.findNearbyProducts = async (latitude, longitude, distance) => {

    try {
        if (!latitude || !longitude || !distance) {
            throw new Error('Invalid parameters for finding nearby products.');
        }

        let products = await Product.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    $maxDistance: distance ? parseInt(distance) : 5000 // meters
                }
            }
        });

        return products;
    }
    catch (error) {
        console.log("Error From Service");
        throw error;
    }   
};