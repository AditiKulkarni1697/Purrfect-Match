const jwt = require('jsonwebtoken');
const { UserModel } = require('../databases/models/user.model');
const { BlacklistModel } = require('../databases/models/blacklist.model');
require("dotenv").config();

const authentication = async (req, res, next) => {
    try{
    let {token} = req.cookies;

        const user = await verifyUser(token)
        if(user.user){
            req.user = user.user;
        req.token = token;
        next();
        }else{
            console.log("error in auth", user.msg)
            return res.status(401).send({msg: user.msg});
        }
        
        
    }catch(err){
        console.log(err);
        return res.status(500).send({msg: err});
    }
}

const verifyUser = async (token) =>{
    try{
        if(!token){
        
        return {msg: "Unauthorized by token"};
    }
        const isBlacklisted = await BlacklistModel.findOne({token});

        if(isBlacklisted){
           
            return {msg: "Unauthorized logout"};
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
           
            return {msg: "Unauthorized decoded"};
        }

        const user = await UserModel.findOne({email: decoded.email});

        if(!user){
            
            return {msg: "Unauthorized user"};
        }

        return {user}

    }catch(err){
        return {err:err.message}
    }
}

module.exports = {authentication, verifyUser};