 const socket = require("socket.io");
 const crypto = require("crypto");
const { ChatModel } = require("../databases/models/chat.model");
const { createChat } = require("../controller/chat.controller");
const { verifyUser } = require("../middleware/authentication.middleware");
const { UserModel } = require("../databases/models/user.model");

const hashRoomId = ({userId,toUserId}) =>{    //to make roomId secure 
    return crypto
     .createHash("sha256")
     .update([userId,toUserId].sort().join("_"))
     .digest("hex")
 }
 
 const initialSocket = (server)=>{
    const io = socket(server,{
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        },
        
    })
    
    io.on("connection",  (socket)=>{
        
        socket.on("joinChat",async({userId,toUserId})=>{
            
        const verified = await verifyUser(socket?.request?.headers?.cookie?.substring(6,))
        
            const roomId = hashRoomId(userId,toUserId)
            
            socket.join(roomId)
        })

        socket.on("sendMessage",async({userId,toUserId, newMessage})=>{
           const roomId = hashRoomId(userId,toUserId)
            await createChat(userId,toUserId,newMessage)
            const user = await UserModel.findOne({_id:userId}).select("name photoUrl")
            io.to(roomId).emit("messageReceived", {msg:{senderId:user, text:newMessage}})
        })

        socket.on("disconnect",()=>{})
    
    })
 }

 module.exports = {initialSocket}