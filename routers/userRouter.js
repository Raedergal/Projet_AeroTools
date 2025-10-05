const userRouter = require("express").Router()
const userController = require("../controllers/userController")
const authGuard = require("../middleware/services/authGuard")
const upload = require('../middleware/services/uploads')

userRouter.get('/register' , userController.displayRegister)
userRouter.post('/register' , userController.postAdmin)
userRouter.get('/login' , userController.displayLogin)
userRouter.post('/login' , userController.login)
userRouter.post('/changePassword' , userController.changePassword)
userRouter.get('/dashboard', authGuard, userController.displayDashboard)
userRouter.get('/cancelled', authGuard, userController.cancelled)
userRouter.get('/technicians', authGuard, userController.displayTechnicians)
userRouter.post('/technicians', upload.single("photo"), authGuard, userController.createTechnicians)
userRouter.get('/deleteUser/:id', authGuard, userController.removeTechnician)
userRouter.post('/editUser/:id',upload.single("photo"), authGuard, userController.editUser)
userRouter.get('/schedule', authGuard, userController.schedule)
userRouter.get('/logout', authGuard, userController.logout)



module.exports = userRouter