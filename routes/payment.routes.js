const express = require("express")
const { authentication } = require("../middleware/authentication.middleware")
const { createOrder, verifyPaymentWebhook } = require("../controller/payment.controller")

const paymentRouter = express.Router()

paymentRouter.post("/order", authentication, createOrder)

paymentRouter.post("/webhook", verifyPaymentWebhook)



module.exports = {paymentRouter}