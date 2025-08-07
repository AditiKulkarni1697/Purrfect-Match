const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const { ChatModel } = require("../databases/models/chat.model");
const {
  ConnectionRequestModel,
} = require("../databases/models/connectionRequest.model");
const { chatValidate } = require("../utils/chat.validate");


const getChat = async (req, res) => {
  try {
    const { id, toUserId, page=1 } = req.params;
    

    const limit = 10;
    const skip = (page - 1) * limit;

    const chatLength = await ChatModel.aggregate([
  { $match:{particiapants: { $all: [new ObjectId(id), new ObjectId(toUserId)] }} },
  {
    $project: {
      messagesLength: { $size: "$messages" }
    }
  }
])
   

    const chat = await ChatModel.findOne({
      particiapants: { $all: [id, toUserId] },
    }).select({ messages: { $slice: [skip, limit] } }).populate({path: "messages.senderId",
  select: "name photoUrl"});
    
   
    if (!chat) {
      return res.status(404).send({ msg: "Chat not found" });
    }
    
    res
      .status(200)
      .send({ msg: "chat found successfully", messages: chat?.messages, messagesLength: chatLength?.messagesLength });
  } catch (err) {
    console.log("error in getChat", err.message);
    res.status(501).send({ err: err.message });
  }
};

const createChat = async (userId,toUserId,newMessage) => {
  try {
    
    newMessage = chatValidate(newMessage);

    let isConnected = await ConnectionRequestModel.findOne({
      $or: [
        { senderId: userId, receiverId: toUserId, status: "accepted" },
        { senderId: toUserId, receiverId: userId, status: "accepted" },
      ]
    });
    
    if(!isConnected){
        return {msg:"Connection do not exist"}
    }
    let saveMessage = await ChatModel.findOne({
      particiapants: { $all: [userId, toUserId] },
    })
    
    if (!saveMessage) {
      saveMessage = new ChatModel({
        particiapants: [userId, toUserId],
        messages: [],
      });
    }

    saveMessage.messages.push({ senderId: userId, text: newMessage });

    await saveMessage.save();


  } catch (err) {
    console.log("error in createChat", err.message);
  }
};

module.exports = { getChat, createChat };
