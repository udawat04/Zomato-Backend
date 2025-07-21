const express = require("express")
const { createUser, userLogin, allUsers } = require("../controllers/userController")
const auth = require("../middleware/auth")
const router = express.Router()

router.post("/create",createUser)
router.get("/",auth,allUsers)
router.post("/login",userLogin)

module.exports = router