
const userValidation = async (req,res,next) => {
    const {name,email,password, species, interestedIn, lookingFor, interests} = req.body;

    if(!name || !email || !password || !species || !interestedIn || !lookingFor){
        return res.status(400).send({msg:"Missing required fields"});
    }

    if(name.length < 3 || name.length > 50){
        return res.status(400).send({msg:"Name must be between 3 to 50 characters"});
    }

    const emailRegex = "^[^\s@]+@[^\s@]+\.[^\s@]+$";
    if(!emailRegex.test(email) || email.length > 100){
        return res.status(400).send({msg:"Invalid email"});
    }

    if(password.length < 8 || password.length > 50){
        return res.status(400).send({msg:"Password must be between 8 to 50 characters"});
    }

    if(!["Dog", "Cat", "Bird", "Fish", "Reptile", "Other"].includes(species)){
        return res.status(400).send({msg:"Invalid species"});
    }

    if(!["Dog", "Cat", "Bird", "Fish", "Reptile", "Other"].includes(interestedIn)){
        return res.status(400).send({msg:"Invalid interestedIn"});
    }

    if(!["Long Term", "Short Term", "Pen Pal"].includes(lookingFor)){
        return res.status(400).send({msg:"Invalid lookingFor"});
    }

    if(interests && interests.length > 10){
        return res.status(400).send({msg:"invalid interest count. Count should be upto 10"})
    }

    next();
}

module.exports = {userValidation};