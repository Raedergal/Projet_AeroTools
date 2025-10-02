const aeronefRouter = require("express").Router()
const aeronefController = require("../controllers/aeronefController")
const authGuard = require("../middleware/services/authGuard")

aeronefRouter.get('/createAeronef',authGuard, aeronefController.createAeronefDisplay)
aeronefRouter.post('/createAeronef',authGuard, aeronefController.postAeronef)

module.exports = aeronefRouter