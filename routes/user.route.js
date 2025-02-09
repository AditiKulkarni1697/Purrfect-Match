const {register, login, getAllUsers, logout} = require('../controller/user.controller');

const express = require('express');
const { authentication } = require('../middleware/authentication.middleware');
const { userValidation } = require('../utils/user.validation');

const userRouter = express.Router();

userRouter.post('/register',userValidation, register);

userRouter.post('/login', login);

userRouter.get('/',authentication, getAllUsers);

userRouter.post('/logout',authentication, logout);

module.exports = {userRouter};