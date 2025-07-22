const { uploadImage } = require("../helper/cloudinary");
const FoodItem = require("../models/foodItemModel")
const Image = require("../models/foodImageModel")

exports.addFood = async(req,res)=>{
    const {foodName,type,price, description} = req.body
    

    const foodData = {
      foodName,
      type,
      price,
      description,
      restaurantId: "687e7568d97ddc7d6ab29819",
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