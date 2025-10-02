const toolRouter = require("express").Router()
const toolController = require("../controllers/toolController")
const authGuard = require("../middleware/services/authGuard")

toolRouter.get('/tools', authGuard, toolController.displayTools)

module.exports = toolRouter