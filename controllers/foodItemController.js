const { uploadImage } = require("../helper/cloudinary");
const FoodItem = require("../models/foodItemModel")
const Image = require("../models/foodImageModel")

exports.addFood = async(req,res)=>{
  const user = req.user
  const {restaurantId} = user
    const {foodName,type,price, description} = req.body
    

    const foodData = {
      foodName,
      type,
      price,
      description,
      restaurantId,
    };
    const newFood = new FoodItem(foodData)
    const result = await newFood.save()
  
   

    const imageUpload = await uploadImage(req.files)


    imageUpload.forEach(async(item,index)=>{
        const data = {
          foodItemId: result._id,
          imageName: `${foodName}-Image${index} `,
          imageUrl: item.url,
        };
       const newImage = new Image(data)
       await newImage.save()
    })

   return res.status(200).send(result)
}

exports.allItems = async(req,res)=>{
const result = await FoodItem.aggregate([
  {
    $lookup: {
      from: "food-images",
      localField: "_id",
      foreignField: "foodItemId",
      as: "images",
    },
  },
  {
    $lookup: {
      from: "restaurants", // collection name
      localField: "restaurantId", // the field in FoodItem
      foreignField: "_id", // the _id in Restaurant collection
      as: "restaurant",
    },
  },
  {
    $unwind: "$restaurant", // optional: turn restaurant array into object
  },
]);
  return res.status(200).send(result)
}
exports.restItem = async(req,res)=>{
   const user = req.user;
   console.log(user.restaurantId);
   const result = await FoodItem.aggregate([
     { $match: { restaurantId: user.restaurantId } },
     {
       $lookup: {
         from: "food-images",
         localField: "_id",
         foreignField: "foodItemId",
         as: "images",
       },
     },
     {
       $lookup: {
         from: "restaurants", // collection name
         localField: "restaurantId", // the field in FoodItem
         foreignField: "_id", // the _id in Restaurant collection
         as: "restaurant",
       },
     },
     {
       $unwind: "$restaurant", // optional: turn restaurant array into object
     },
   ]);
   return res.status(200).send(result)
}

exports.updateFoodStatus = async(req,res)=>{
  const user = req.user

  if(user.role==="restaurant"){
    const { FoodItemId, status } = req.body;
    console.log(req.body);
    // when we pass id in findbyidandupdate so that id is refer to _id directly we dont need to make key value pair
    const foodItemResult = await FoodItem.findByIdAndUpdate(
      FoodItemId,
      { status },
      { new: true }
    );
   return res.status(200).send(foodItemResult)
  }
}