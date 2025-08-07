const {
  ConnectionRequestModel,
} = require("../databases/models/connectionRequest.model");
const { UserModel } = require("../databases/models/user.model");
const { run } = require("../utils/sendEmail");

const createConnectionRequest = async (req, res) => {
  const receiverId = req.params.userId;
  const senderId = req.user._id;
  const status = req.params.status;
  try {
    const allowedStatus = ["interested", "ignored"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).send({ msg: "invalid status type" });
    }
    const isReceiverPresent = await UserModel.findById(receiverId);

    if (!isReceiverPresent) {
      return res.status(401).send({ msg: "Receiver Not Found" });
    }

    if (receiverId === senderId.toString()) {
      return res.status(401).send({ msg: "Self Connection not allowed" });
    }

    const isAlreadyRequested = await ConnectionRequestModel.findOne({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        {
          senderId: receiverId,
          receiverId: senderId,
        },
      ],
    });

    if (isAlreadyRequested) {
      return res
        .status(401)
        .send({ msg: "Connection request already present" });
    }

    const payload = { senderId, receiverId, status };

    const connectionRequest = new ConnectionRequestModel(payload);

    await connectionRequest.save();

   
      const emailSent = await run("sujlegaonkar16@gmail.com", "aditisujlegaonkar@gmail.com", "<h1>This is Html body</h1>", "This is Text content", "New AWS SES mail")
      
    

    res
      .status(200)
      .send({ msg: "Connection request status saved successfully" });
  } catch (err) {
    console.log("error", err.message)
    res.status(500).send({ msg: "Internal Server Error" });
    
  }
};

const requestReview = async (req, res) => {
  const requestId = req.params.requestId;
  const status = req.params.status;
  try {
    const allowedStatus = ["accepted", "rejected"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).send({ msg: "invalid status type" });
    }
    const isRequestPresent = await ConnectionRequestModel.findOne({
      _id: requestId,
      receiverId: req.user._id,
      status: "interested",
    });

    if (!isRequestPresent) {
      return res.status(401).send({ msg: "Request Not Found" });
    }

    isRequestPresent["status"] = status;

    await isRequestPresent.save();

    res
      .status(200)
      .send({ msg: "Connection request status updated successfully" });
  } catch (err) {
    res.status(500).send({ msg: "Internal Server Error" });
  }
};

module.exports = { createConnectionRequest, requestReview };
