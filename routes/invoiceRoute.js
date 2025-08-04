const express = require("express")
const auth = require("../middleware/auth")
const { createInvoice, invoiceById } = require("../controllers/invoiceController")

const router = express.Router()

router.post("/",auth,createInvoice)
router.get("/",auth,invoiceById)


module.exports = router