const express = require("express");
const { interestedInProfile, ignoredProfile, acceptedRequest, rejectedRequest } = require("../controller/connectionRequest.controller");
const { authentication } = require("../middleware/authentication.middleware");

const connectionRequestRouter = express.Router();

connectionRequestRouter.post("/send/interested/:userId",authentication, interestedInProfile);

connectionRequestRouter.post("/send/ignored/:userId",authentication, ignoredProfile);

connectionRequestRouter.post("/review/accepted/:requestId",authentication, acceptedRequest);

connectionRequestRouter.post("/review/rejected/:requestId",authentication, rejectedRequest);

module.exports = {connectionRequestRouter}