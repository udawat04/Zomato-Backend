const Invoice = require("../models/invoiceModel")
const Order = require("../models/orderModel")
const restOrder = require("../models/restaurantOrderModel")

exports.createInvoice = async(req,res)=>{
    const {userId,addressId,cart,total} = req.body
    console.log(req.body,"req.body--------------------------")
   

    const invoiceData = {userId,addressId,total}
    
    const newInvoice = new Invoice(invoiceData)
    const invoiceResult = await newInvoice.save()
    console.log(invoiceResult)

     cart.forEach(async(item) => {
        const data = {
          invoiceId: invoiceResult._id,
          userId: item.userId,
          itemId: item.itemId,
          quantity: item.quantity,
          images: item.images,
          restId: item.itemId.restaurantId,
          addressId:addressId
        };
        console.log(data,"------------=======   ")
        const newOrder = new Order(data)
        const newRestOrder = new restOrder(data)
        await newOrder.save()
        await newRestOrder.save()
    });
    

return res.status(200).send(invoiceResult)
}

exports.invoiceById = async(req,res)=>{
    const user =req.user
    // console.log(user)
    if(user.role==="user"){
      const mongoose = require("mongoose");

      const result = await Invoice.aggregate([
        {
          $lookup: {
            from: "orders",
            localField: "_id",
            foreignField: "invoiceId",
            as: "orders",
          },
        },
        {
          $lookup: {
            from: "delivery-boys",
            localField: "deliveredBy",
            foreignField: "_id",
            as: "deliveredBy",
          },
        },
        {
          $unwind: {
            path: "$deliveredBy",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "user-addresses",
            localField: "addressId",
            foreignField: "_id",
            as: "address",
          },
        },
        {
          $unwind: {
            path: "$address",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "users",
          },
        },
        {
          $unwind: {
            path: "$orders",
            preserveNullAndEmptyArrays: true,
          },
        }, // Flatten orders for filtering
        {
          $match: {
            "orders.userId": new mongoose.Types.ObjectId(user._id),
            // "orders.restId": new mongoose.Types.ObjectId(user.restaurantId),
          },
        },
        {
          $lookup: {
            from: "food-items",
            localField: "orders.itemId",
            foreignField: "_id",
            as: "orders.item",
          },
        },
        {
          $unwind: {
            path: "$orders.item",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "restaurants",
            localField: "orders.restId",
            foreignField: "_id",
            as: "orders.restaurant",
          },
        },
        {
          $unwind: {
            path: "$orders.restaurant",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: "$_id",
            userId: { $first: "$userId" },
            deliveredBy: { $first: "$deliveredBy" },
            users: { $first: "$users" },
            address: { $first: "$address" },
            date: { $first: "$date" },
            total: { $first: "$total" },
            status: { $first: "$status" },
            orders: { $push: "$orders" },
          },
        },
      ]);

      // console.log(result, "hfhfhf");
      return res.status(200).send(result);
    }
    else if(user.role==="restaurant"){
      
       const result = await Invoice.aggregate([
         {
           $lookup: {
             from: "orders",
             localField: "_id",
             foreignField: "invoiceId",
             as: "orders",
           },
         },
        
         // Step 2: Lookup user address
         {
           $lookup: {
             from: "user-addresses",
             localField: "addressId",
             foreignField: "_id",
             as: "address",
           },
         },
         { $unwind: {
              path:"$address",
             preserveNullAndEmptyArrays: true,
            }
          },
         {
           $lookup: {
             from: "users",
             localField: "userId",
             foreignField: "_id",
             as: "users",
           },
         },
         {
           $unwind: {
             path: "$users",
             preserveNullAndEmptyArrays: true,
           },
         },
         // Step 3: Unwind orders for nested lookup
         { $unwind: { path: "$orders", preserveNullAndEmptyArrays: true } },
         {$match:{"orders.restId":user.restaurantId}},

         // Step 4: Lookup food items using orders.itemId
         {
           $lookup: {
             from: "food-items",
             localField: "orders.itemId",
             foreignField: "_id",
             as: "orders.item",
           },
         },
         { $unwind: "$orders.item" },
         {
           $lookup: {
             from: "restaurants",
             localField: "orders.restId",
             foreignField: "_id",
             as: "orders.restaurant",
           },
         },
         {
           $unwind: {
             path: "$orders.restaurant",
             preserveNullAndEmptyArrays: true,
           },
         },
         {
           $group: {
             _id: "$_id",
             userId: { $first: "$userId" },
             users: { $first: "$users" },
             address: { $first: "$address" },
             date: { $first: "$date" },
             total: { $first: "$total" },
             status: { $first: "$status" },
             orders: { $push: "$orders" },
           },
         },
       ]);
      //  console.log(result, "hfhfhf");
       return res.status(200).send(result);
    }



    // const result = await Invoice.find({userId:user._id})
   
}

exports.updateInvoiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, dbId } = req.body;
    console.log(req.body)

    console.log(id, typeof status, dbId, "000000");

    let updateFields = { status };

    // Agar delivered hai to deliveredBy bhi add/update karo
    if (status === "delivered" && dbId) {
      console.log("in the delivery section");
      updateFields.deliveredBy = dbId;
    }

    const result = await Invoice.findByIdAndUpdate(
      id, // 👈 sirf id pass karo
      updateFields, // 👈 saare update ek object me bhejo
      { new: true }
    );

    console.log(result, "kkkkk");
    return res.status(200).send(result);
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).send({ error: "Something went wrong" });
  }
};
