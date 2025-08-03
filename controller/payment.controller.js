const { PaymentModel } = require("../databases/models/payment.model");
const { UserModel } = require("../databases/models/user.model");
const { MembershipType } = require("../utils/constants");
const { instance } = require("../utils/razorpay");
const { validatePaymentVerification, validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');

const createOrder = async (req, res) => {
    const { membershipType} = req.body
    const user = req.user
  try {
    var options = {
      amount:MembershipType[membershipType], // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      receipt: "order_rcptid_11",
      notes: {
        firstName:user?.name,
        membershipType
      }
    };
    const order = await instance.orders.create(options);
    console.log("order", order)
    const {id, amount,
  currency,
  receipt,
  status,
  notes,
  createdAt} = order

  const payload = {userId: user._id, orderId:id, amount,
  currency,
  receipt,
  status,
  notes,
  createdAt}

  const payment = new PaymentModel(payload)

  await payment.save()
  
    res.status(200).send({msg:"order created successfully", payment, keyId:process.env.RAZORPAY_KEY_ID})
  } catch (err) {
    console.log(err)
    res.status(500).send({err:err.message})
  }
};

const verifyPaymentWebhook = async (req,res) =>{

try{
  const webhookSignature = req.headers("X-Razorpay-Signature")
  console.log("webhookSignature", webhookSignature)
  const isWebhookValid = validateWebhookSignature(
    JSON.stringify(req.body),
    webhookSignature,
    process.env.RAZORPAY_WEBHOOK_SECRET
  )
  console.log("isWebhookValid", isWebhookValid)
  const paymentDetails = req?.body;

 if(!isWebhookValid){
  return res.status(400).send({msg:"Webhook signature is invalid"})
 }
  // const paymentDetails = req?.body?.payload?.payment?.entity;
 
// var { validatePaymentVerification, validateWebhookSignature } = require('./dist/utils/razorpay-utils');
//  const verified = validatePaymentVerification({"order_id": paymentDetails.order_id, "payment_id": paymentDetails.id }, webhookSignature, process.env.RAZORPAY_WEBHOOK_SECRET);

//  console.log("verified payment", verified)

 const payment = await PaymentModel.findOne({orderId: paymentDetails.order_id})

 payment.status = paymentDetails.status
 payment.paymentId = paymentDetails.id

 await payment.save()
 console.log("payment saved")

 const user = await UserModel.findById({_id:payment.userId})

 user.isPremium = true
 user.membershipType = payment.notes.membershipType

 await user.save()
 console.log("user saved")

 res.status(200).send({msg:"Webhook received successfully"})
}catch(err){
  console.log("err in verifyPaymentWebhook", err.message)
 res.status(501).send({err})
}
 
}

module.exports = { createOrder, verifyPaymentWebhook };
