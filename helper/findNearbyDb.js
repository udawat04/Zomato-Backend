const DbLocation = require("../models/deliveryBoyLocationModel");

 exports.findNearbyDeliveryBoys = async (
   restaurantLat,
   restaurantLng,
   maxDistanceInMeters = 2000
 ) => {
   console.log(restaurantLat, restaurantLng, maxDistanceInMeters);
   return await DbLocation.find({
     location: {
       $near: {
         $geometry: {
           type: "Point",
           coordinates: [restaurantLat, restaurantLng],
         },
         $maxDistance: maxDistanceInMeters,
       },
     },
   }).populate("dbId"); // This populates delivery boy's basic info
 };

