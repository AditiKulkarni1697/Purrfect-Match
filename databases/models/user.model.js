const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require("dotenv").config();

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase:true,
        trim: true,
        validate(value){
         if(!validator.isEmail(value)){
            throw new Error ("invalid email id")
         }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("This is not a strong password")
            }
        }
    },
    photoUrl: {
      type: String,
      default: "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=" 
    },
    species: {
        type: String,
        enum: ['Dog', 'Cat', 'Bird', 'Fish', 'Reptile', 'Other'],
        
    },
    interestedIn: {
        type: [String],
        enum: ['Dog', 'Cat', 'Bird', 'Fish', 'Reptile', 'Other'],
        
    },
    lookingFor: {
        type: String,
        enum: ['Long Term', 'Short Term', 'Pen Pal'],
        
    },
    interests: {
        type: [String]
    },
    isPremium: {
        type:Boolean,
        default:false
    },
    membershipType: {
        type: String
    }
}, {timestamps: true});

userSchema.methods.getJWT = async function () {
    const user = this;

    const token = jwt.sign({id: user._id, email: user.email}, process.env.JWT_SECRET, {expiresIn: "1d"});

    return token;
}

userSchema.methods.comparePassword = async function(password){

    const user = this;

    const isValid = await bcrypt.compare(password, user.password);

    return isValid
}


const UserModel = mongoose.model('User', userSchema);

module.exports = {UserModel};