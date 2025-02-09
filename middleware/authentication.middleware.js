const jwt = require('jsonwebtoken');
const { UserModel } = require('../databases/models/user.model');
const { BlacklistModel } = require('../databases/models/blacklist.model');
require("dotenv").config();

const authentication = async (req, res, next) => {

    const {token} = req.cookies;
     
    //console.log("cookies", req.cookies)
    if(!token){
        return res.status(401).send({msg: "Unauthorized"});
    }

    try{

        const isBlacklisted = await BlacklistModel.findOne({token});

        if(isBlacklisted){
           
            return res.status(401).send({msg: "Unauthorized"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            
            return res.status(401).send({msg: "Unauthorized"});
        }

        const user = await UserModel.findOne({email: decoded.email});

        if(!user){
            //console.log("token", authorization);
            return res.status(401).send({msg: "Unauthorized"});
        }
        req.user = user;
        req.token = token;
        next();
        
    }catch(err){
        //console.log(err);
        return res.status(500).send({msg: "Internal Server Error"});
    }
}

module.exports = {authentication};