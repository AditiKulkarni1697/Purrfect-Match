const profileUpdateValidation = (req,res, next)=>{

   const allowedEditFields = ["name", "photoUrl", "species", "interestedIn", "lookingFor", "interests"];

   const allFieldsAllowed = Object.keys(req.body).every((field)=> allowedEditFields.includes(field));

   if(!allFieldsAllowed){
    return res.status(400).send({msg:"Invalid input"})
   }

    next()
}

module.exports = {profileUpdateValidation}