const authorization = async(req, res, next)=>{

    const user = req.user;

    const userid = req.params.id;

    if(user._id.toString()!==userid){
        return res.status(401).send({msg:"Unauthorized"})
    }

    next()
}

module.exports = {authorization}