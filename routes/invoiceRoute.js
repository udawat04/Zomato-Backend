const express = require("express")
const auth = require("../middleware/auth")
const { createInvoice, invoiceById, updateInvoiceStatus } = require("../controllers/invoiceController")

const router = express.Router()

router.post("/",auth,createInvoice)
router.get("/",auth,invoiceById)

router.put("/update-status/:id",auth,updateInvoiceStatus)


module.exports = router