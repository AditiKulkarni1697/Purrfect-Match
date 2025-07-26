const jwt = require('jsonwebtoken');
const { UserModel } = require('../databases/models/user.model');
const { BlacklistModel } = require('../databases/models/blacklist.model');
require("dotenv").config();

const authentication = async (req, res, next) => {

    let {token} = req.cookies;
    
    if(!token){
        
        return res.status(401).send({msg: "Unauthorized by token"});
    }

    try{

        const isBlacklisted = await BlacklistModel.findOne({token});

        if(isBlacklisted){
           console.log("blacklisted")
            return res.status(401).send({msg: "Unauthorized logout"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            console.log("decoded", decoded)
            return res.status(401).send({msg: "Unauthorized decoded"});
        }

        const user = await UserModel.findOne({email: decoded.email});

        if(!user){
            console.log("user", user);
            return res.status(401).send({msg: "Unauthorized user"});
        }
        req.user = user;
        req.token = token;
        next();
        
    }catch(err){
        console.log(err);
        return res.status(500).send({msg: "Internal Server Error"});
    }
}

module.exports = {authentication};