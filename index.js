const express = require('express')
const app = express();
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const Mongo = require('connect-mongo')

// DataBase

mongoose.connect("mongodb://localhost:27017/polioce",{useUnifiedTopology:true,useNewUrlParser:true}).then(()=>{
    console.log("DB CONNECTED");
})

// midllewares

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors())
app.use(session({
    store:Mongo.create({
        mongoUrl:"mongodb://localhost:27017/polioce"
    }),
    resave:false,
    saveUninitialized:false,
    secret:"secret",
    cookie:{
        httpOnly:true,maxAge:1000*60*60
    }
}))

app.use("/",require('./routes/route'))


app.listen(2000,()=>{
    console.log("SEVER at 2000")
})