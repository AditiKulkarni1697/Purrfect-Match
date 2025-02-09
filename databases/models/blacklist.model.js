const mongoose = require("mongoose");
const validator = require("validator");


const blacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isJWT(value)){
                throw new Error("not a valid jwt token")
            }
        }
    },
    }, {timestamps: true});

const BlacklistModel = mongoose.model("blacklist", blacklistSchema);

module.exports = { BlacklistModel };