const {ConnectionRequestModel} = require("../databases/models/connectionRequest.model");
const { UserModel } = require("../databases/models/user.model");

const createConnectionRequest = async(senderId, receiverId, status) =>{
    try{
        const isReceiverPresent = await UserModel.findById(receiverId);

        if(!isReceiverPresent){
            return {status:401, msg:"Receiver Not Found"}
        }

        const isAlreadyRequested = await ConnectionRequestModel.findOne({senderId: senderId, receiverId: receiverId});

        if(isAlreadyRequested){
            return {status:401, msg:"Connection request already present"};
        }

        const payload = {senderId, receiverId, status};

        const connectionRequest = new ConnectionRequestModel(payload);

        await connectionRequest.save();

        return {status:200, msg:"Connection request status saved successfully"};
    }catch(err){
        console.log("error in createConnectionRequest", err)
        throw new Error("Internal Server Error")
    }
}

const interestedInProfile = async(req,res)=>{
    const receiverId = req.params.userId;
    const senderId = req.user._id;
    try{
        try{
            const request = await createConnectionRequest(senderId, receiverId,"interested");
            
            res.status(request.status).send({msg:request.msg});
        }catch(err){
            res.status(500).send({msg:"Internal Server Error"});
        }
    }catch(err){
        console.log("error", err);
        res.status(500).send({msg:"Internal Server Error"})
    }
}

const ignoredProfile = async(req,res)=>{
    const receiverId = req.params.userId;
    const senderId = req.user._id;
    try{
        const request = await createConnectionRequest(senderId, receiverId,"ignored");
        res.status(request.status).send({msg:request.msg});
    }catch(err){
        console.log("error", err);
        res.status(500).send({msg:"Internal Server Error"});
    }
}

const requestReview = async(req,requestId, status)=>{
    try{
        const isRequestPresent = await ConnectionRequestModel.findById(requestId);

        if(!isRequestPresent){
            return {status:401, msg:"Request Not Found"}
        }

        if(isRequestPresent.receiverId.toString() !== req.user._id.toString()){
            
            return {status:401, msg:"Unauthorized"}
        }

        isRequestPresent["status"] = status;

        await isRequestPresent.save();

        return {status:200, msg:"Connection request status updated successfully"}


    }catch(err){
        console.log("error in createConnectionRequest", err)
        throw new Error("Internal Server Error")
    }
}

const acceptedRequest = async(req,res)=>{
    const requestId = req.params.requestId;
    
    try{
        const review = await requestReview(req,requestId, "accepted");
        res.status(review.status).send({msg:review.msg})
    }catch(err){
        console.log("error", err);
        res.status(500).send({msg:"Internal Server Error"});
    }
}

const rejectedRequest = async(req,res)=>{
    const requestId = req.params.requestId;
    
    try{
        const review = await requestReview(req,requestId, "rejected");
        res.status(review.status).send({msg:review.msg})
    }catch(err){
        console.log("error", err);
        res.status(500).send({msg:"Internal Server Error"});
    }
}



module.exports = {interestedInProfile, ignoredProfile, acceptedRequest, rejectedRequest}