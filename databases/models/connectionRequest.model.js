const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, required: true },
    status: {
      type: String,
      required: true,
      enums: {
        values: ["ignore", "interested", "accepted", "rejected"],
        message:
          "enum validator failed for path `${PATH}` with value `{VALUE}`",
      },
    },
  },
  { timestamps: true }
);

const ConnectionRequestModel = mongoose.model(
  "connectionrequest",
  connectionRequestSchema
);

module.exports = { ConnectionRequestModel };
