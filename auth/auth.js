const jwt = require("jsonwebtoken");

module.exports = {
    isAuth(req,res,next){
        const cookie = req.cookies.user;
        if(!cookie){
            return res.redirect("/login")
        }
        else{
            jwt.verify(cookie,'secret',function(err,data){
                if(data){
                    next();
                }
            })
        }
    },
    isSignedIN(req,res,next){
        if(req.session.User_ID && req.session.logged && req.cookies.user){
            next();
        }else{
            return res.redirect("/login");
        }
    }
}