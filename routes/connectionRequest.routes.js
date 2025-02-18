const express = require("express");
const { createConnectionRequest, requestReview } = require("../controller/connectionRequest.controller");
const { authentication } = require("../middleware/authentication.middleware");

const connectionRequestRouter = express.Router();

connectionRequestRouter.post("/send/:status/:userId",authentication, createConnectionRequest);

connectionRequestRouter.post("/review/:status/:requestId",authentication, requestReview);

module.exports = {connectionRequestRouter}