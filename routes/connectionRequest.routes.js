const express = require("express");
const { createConnectionRequest, requestReview } = require("../controller/connectionRequest.controller");
const { authentication } = require("../middleware/authentication.middleware");

const connectionRequestRouter = express.Router();

connectionRequestRouter.get("/send/:status/:userId",authentication, createConnectionRequest);

connectionRequestRouter.get("/review/:status/:requestId",authentication, requestReview);

module.exports = {connectionRequestRouter}