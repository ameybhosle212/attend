const express = require('express')
const app = express();
const { ApolloServer } = require('apollo-server-express')
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
app.enable("trust proxy")
app.set("view engine" , "ejs")
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser('secret'))
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
    credentials: true
}));
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


const port = process.env.port || 3000;

app.listen(port,()=>{
    console.log("SEVER at 2000")
})