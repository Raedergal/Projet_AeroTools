const toolRouter = require("express").Router()
const toolController = require("../controllers/toolController")
const authGuard = require("../middleware/services/authGuard")

toolRouter.get('/tools', authGuard, toolController.displayTools)
toolRouter.post('/tools', authGuard, toolController.createTool)
toolRouter.post('/editTool/:id', authGuard, toolController.editTool)
toolRouter.get('/deleteTool/:id', authGuard, toolController.deleteTool)
toolRouter.get('/perception/:id', authGuard, toolController.percepTool)

module.exports = toolRouter