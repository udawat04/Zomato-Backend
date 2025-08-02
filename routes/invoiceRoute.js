const express = require("express")
const auth = require("../middleware/auth")
const { createInvoice } = require("../controllers/invoiceController")

const router = express.Router()

router.post("/",auth,createInvoice)


module.exports = router