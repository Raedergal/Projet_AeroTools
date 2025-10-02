const express = require('express');
const setLocals = require('./middleware/services/locals');
const userRouter = require('./routers/userRouter');
const aeronefRouter = require('./routers/aeronefRouter');
const toolRouter = require('./routers/toolRouter');
const session = require('express-session');

const app = express()

app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: 'qwerty',
    resave:true,
    saveUninitialized:true
}))
app.use(setLocals)
app.use(userRouter)
app.use(aeronefRouter)
app.use(toolRouter)

app.use((req,res)=>{
    res.redirect("/dashboard")
})

app.listen(3000, (err) => {
    console.log(!err ? "connecté au serveur" : err);
})