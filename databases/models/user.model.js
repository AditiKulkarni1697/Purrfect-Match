const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require("dotenv").config();

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 4,
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
      required: true,
      validate(value){
        if(!validator.isURL(value)){
            throw new Error ("invalid URL")
        }
      }
    },
    species: {
        type: String,
        enum: ['Dog', 'Cat', 'Bird', 'Fish', 'Reptile', 'Other'],
        required: true
    },
    interestedIn: {
        type: [String],
        enum: ['Dog', 'Cat', 'Bird', 'Fish', 'Reptile', 'Other'],
        required: true
    },
    lookingFor: {
        type: String,
        enum: ['Long Term', 'Short Term', 'Pen Pal'],
        required: true
    },
    interests: {
        type: [String]
    },
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