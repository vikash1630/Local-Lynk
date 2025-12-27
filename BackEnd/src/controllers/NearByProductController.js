const nearbyProductService = require('../services/NearByProductService');

console.log("NearByProductController Loaded");

exports.getNearbyProducts = async (req, res) => {
    try {

        console.log("Get Nearby Products Called");

        const { latitude, longitude, distance } = req.params;
        console.log("Latitude:", latitude, "Longitude:", longitude, "Distance:", distance);

    if (!latitude || !longitude || !distance) {
        return res.status(400).json({ message: 'Missing required query parameters.' });
    }

    let products = await nearbyProductService.findNearbyProducts(
        parseFloat(latitude),
        parseFloat(longitude),
        parseFloat(distance)
    );

    console.log("Nearby Products Found:", products);

    if (!products) {
        return res.status(404).json({ message: 'No nearby products found.' });
    }
    res.status(200).json(products);
    } catch (error) {
        console.log("Error From Controller");       
        res.status(500).json({ message: 'Server error while fetching nearby products.', error: error.message });
    }
};

