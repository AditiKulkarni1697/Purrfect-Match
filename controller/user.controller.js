const {UserModel} = require('../databases/models/user.model');
const bcrypt = require('bcryptjs');
const { BlacklistModel } = require('../databases/models/blacklist.model');
const { ConnectionRequestModel } = require('../databases/models/connectionRequest.model');
require('dotenv').config();

const register = async(req, res) => {
    const {name, email, password, photoUrl, species, interestedIn, lookingFor, interests} = req.body;

    const userExists = await UserModel.findOne({email});

    if(userExists){
        return res.status(400).send("User already exists");
    }

    const hashed = await bcrypt.hash(password, 8);
    try{
        const user = new UserModel({
            name,
            email,
            password: hashed,
            photoUrl,
            species,
            interestedIn,
            lookingFor,
            interests
        });

        await user.save();
        res.status(201).send({message:"User registered successfully"});
    }catch(err){
        console.log(err)
        res.status(500).send({error:"Internal server error"});
    }
}

const login = async(req,res)=>{
    const {email, password} = req.body;

    try{
      const user = await UserModel.findOne({email});

        if(!user){
            return res.status(404).send("User not found");
        }

        const isMatch = await user.comparePassword(password)

        if(!isMatch){
            return res.status(400).send("Invalid password");
        }
         
        //console.log("userModel", UserModel)
        const token = await user.getJWT();
        
        res.cookie("token", token, { expires: new Date(Date.now() + 900000)});
        res.status(200).send({message: "Logged in successfully"});
    }catch(err){
        console.log("error", err)
        res.status(500).send({error:"Internal server error"});
    }
}


const logout = async(req,res)=>{
    const {token} = req;

    try{
        const blacklisted = new BlacklistModel({token});
        await blacklisted.save();
        res.status(200).send({message:"Logged out successfully"});
    }catch(err){
        res.status(500).send({error:"Internal server error"});
    }
}

const getConnections = async(req,res)=>{
    const userId = req.user._id;
    try{
        const allConnections = await ConnectionRequestModel.find({$or:[{senderId:userId}, {receiverId: userId}], status:"accepted"});
        res.status(200).send({data: allConnections})
    }catch(err){
        res.status(500).send({error:"Internal Server Error"})
    }
}

const requestReceived = async(req,res)=>{
    const userId = req.user._id;
    try{
        const requests = await ConnectionRequestModel.find({receiverId:userId, status:"interested"});
        res.status(200).send({data: requests});
    }catch(err){
        res.status(500).send({error:"Internal Server Error"})
    }
}

const getFeed = async(req,res) =>{
    const user = req.user;
    try{
        const feed = await UserModel.find({interestedIn:{ $in: [ user.species ] }, lookingFor: user.lookingFor});

        
    }catch(err){

    }
}


module.exports = {register, login, logout, getConnections, requestReceived, getFeed};
