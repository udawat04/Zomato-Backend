const { uploadImage } = require("../helper/cloudinary");
const FoodItem = require("../models/foodItemModel")
const Image = require("../models/foodImageModel")
const mongoose = require("mongoose")

exports.addFood = async(req,res)=>{
  const user = req.user
  const {restaurantId} = user
    const { foodName,  price, description, foodType, category, isVeg } =
      req.body;
    
      const newCat = category[0].toUpperCase()+category.slice(1)
     
    const foodData = {
      foodName,
      price,
      description,
      restaurantId,
      foodType,
      category:newCat,
      isVeg,
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
  const {id} = req.params
  const restId = new mongoose.Types.ObjectId(id);
   const user = req.user
   console.log(id,"----")

    const result = await FoodItem.aggregate([
      { $match: { restaurantId: restId } },
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
        $unwind: { path: "$restaurant", preserveNullAndEmptyArrays: true }, // optional: turn restaurant array into object
      },
    ]);


  console.log(result,"resssss")
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

exports.foodCategory = async (req, res) => {
  try {
    
    const categories = await FoodItem.find().select("category");
    const uniqueCategories = [
      ...new Set(categories.map((item) => item.category)),
    ]; 

    return res.status(200).send(uniqueCategories);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.foodType = async (req, res) => {
  try {
    const types = await FoodItem.find().select("foodType");
    const uniqueTypes = [...new Set(types.map((item) => item.foodType))];

    return res.status(200).send(uniqueTypes);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.foodUpdate = async(req,res)=>{
  const {id} = req.params 
  console.log(id,"fodd item id")
  
  const {foodName,category,foodType,isVeg,price, description,imageIds} = req.body
  console.log(req.body)
  console.log(req.files)
  // let images =[]
  if(req.files && imageIds){
    const imageUpload = await uploadImage(req.files)
    imageUpload.forEach(async(img,idx)=> {
      const image = img.url
      const id = Array.isArray(imageIds) ? imageIds[idx] : imageIds
     
      // images.push({image,id})
      await Image.findByIdAndUpdate({_id:id},{imageUrl:image},{new:true})
    })
  }



  const data = {foodName:foodName,category:category,foodType:foodType,price:price,isVeg:isVeg,description:description}


  const result = await FoodItem.findByIdAndUpdate({ _id: id }, data, {
    new: true,
  });

  

  return res.status(200).send(result)
}