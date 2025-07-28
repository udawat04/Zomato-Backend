const express = require("express")
const { createUser, userLogin, allUsers, updateProfile } = require("../controllers/userController")
const auth = require("../middleware/auth")
const { createAddress, updateAddress, allAddress, addressById } = require("../controllers/userAddressController")
const router = express.Router()

router.post("/create",createUser)
router.get("/",auth,allUsers)
router.post("/login",userLogin)
router.put("/update-profile",auth,updateProfile)

router.post("/create/address",auth,createAddress)

router.put("/update-address/:id",auth,updateAddress)

router.get("/all-address",auth,allAddress)

router.get("/address/:id",auth,addressById)

module.exports = router