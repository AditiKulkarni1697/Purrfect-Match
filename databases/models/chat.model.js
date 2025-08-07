const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
  senderId: {type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
  text :{type:String, required: true}
}, {timestamps:true})

const chatSchema = new mongoose.Schema({
    particiapants: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    messages: [messageSchema]
})

const ChatModel = mongoose.model("Chat", chatSchema)

module.exports = {ChatModel}