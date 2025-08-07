const express = require("express")
const { authentication } = require("../middleware/authentication.middleware")
const { authorization } = require("../middleware/authorization.midlleware")
const { getChat } = require("../controller/chat.controller")

const chatRouter = express.Router()

chatRouter.get("/:id/:toUserId/:page", authentication, authorization, getChat)

module.exports = {chatRouter}