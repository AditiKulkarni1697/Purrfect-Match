const express = require("express");
const { authentication } = require("../middleware/authentication.middleware");
const { getAllProfiles, getProfile, updateProfile, forgotPassword, updatePassword } = require("../controller/profile.controller");
const { profileUpdateValidation } = require("../utils/profileUpdate.validation");
const { authorization } = require("../middleware/authorization.midlleware");

const profileRouter = express.Router();

profileRouter.get('/',authentication, getAllProfiles);

profileRouter.get("/:id", authentication, getProfile);



profileRouter.patch("/updatepassword", authentication, updatePassword);

profileRouter.patch("/:id", authentication, authorization, profileUpdateValidation, updateProfile);

profileRouter.post("/forgotpassword", forgotPassword);


module.exports = {profileRouter}