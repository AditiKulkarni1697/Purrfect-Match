const {register, login, logout, getConnections, requestReceived, getFeed} = require('../controller/user.controller');

const express = require('express');
const { authentication } = require('../middleware/authentication.middleware');
const { userValidation } = require('../utils/user.validation');

const userRouter = express.Router();

userRouter.post('/register',userValidation, register);

userRouter.post('/login', login);

userRouter.get("/connections", authentication, getConnections);

userRouter.get("/requests/received", authentication, requestReceived);

userRouter.get("/feed", authentication, getFeed);

userRouter.get('/logout',authentication, logout);

module.exports = {userRouter};