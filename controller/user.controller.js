const {UserModel} = require('../databases/models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { BlacklistModel } = require('../databases/models/blacklist.model');
require('dotenv').config();

const register = async(req, res) => {
    const {name, email, password, species, interestedIn, lookingFor, interests} = req.body;

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
            species,
            interestedIn,
            lookingFor,
            interests
        });

        await user.save();
        res.status(201).send({message:"User registered successfully"});
    }catch(err){
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

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).send("Invalid password");
        }

        const token = jwt.sign({id: user._id, email: user.email}, process.env.JWT_SECRET);

        res.status(200).send({message: "Logged in successfully",token});
    }catch(err){
        res.status(500).send({error:"Internal server error"});
    }
}

const getAllUsers = async(req,res)=>{

    try{
        const user = await UserModel.find();
        res.status(200).send(user);
    }
    catch(err){
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

module.exports = {register, login, getAllUsers, logout};
