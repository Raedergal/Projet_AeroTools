const userRouter = require("express").Router()
const userController = require("../controllers/userController")
const authGuard = require("../middleware/services/authGuard")

userRouter.get('/register' , userController.displayRegister)
userRouter.post('/register' , userController.postAdmin)
userRouter.get('/login' , userController.displayLogin)
userRouter.post('/login' , userController.login)
userRouter.get('/dashboard', authGuard, userController.displayDashboard)
userRouter.get('/cancelled', authGuard, userController.cancelled)
userRouter.get('/technicians', authGuard, userController.displayTechnicians)
userRouter.post('/technicians', authGuard, userController.createTechnicians)
userRouter.get('/deleteUser/:id', authGuard, userController.removeTechnician)
userRouter.post('/editUser/:id', authGuard, userController.editUser)







module.exports = userRouter