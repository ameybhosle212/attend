const User = require('../models/user');
const bcrypt = require('bcryptjs')
const route = require('express').Router()
const jwt = require('jsonwebtoken');
const { isAuth, isSignedIN } = require('../auth/auth');


route.get("/",(req,res)=>{
    return res.json({"DATA":"DEMO DATA"})
})

route.get("/admin", isAuth , isSignedIN ,(req,res)=>{
    res.json({"Data":"YOU HAV LOGGED IN SUCCESSFULLY"})
})

route.post("/login", async (req,res)=>{
    const {name , password } = req.body;
    const data = await User.findOne({name})
    if(data && data.isAdmin){
        bcrypt.compare(password , data.password , function(err,result){
            if(err) console.error(err);
            if(result){
                const token = jwt.sign({data},'secret')
                res.cookie('user',token)
                req.session.User_ID = data._id;
                req.session.logged = true;
                return res.json({"Data":"CORRECT"})
            }else{
                return res.json({"Data":"NOT CORRECT PASSWORD"})
            }
        })
    }else{
        return res.json({"Data":"WRONG CREDENTIALS YOUR ARE NOT AN ADMIN"})
    }
})

route.get("/logout",(req,res)=>{
    if (req.session.logged && req.session ){;
        req.session.destroy(function (err) {
            if(err) console.error(err);
            res.session = null;
            res.clearCookie("user")
            return res.json({"VAL":"asnajs"})
        });
    }else{
        res.json({"VAL":"YOU ARE NOT LOGGED IN"})
    }
})

module.exports = route;