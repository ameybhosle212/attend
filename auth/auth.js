const jwt = require("jsonwebtoken");

module.exports = {
    isAuth(req,res,next){
        const cookie = req.cookies.user;
        console.log(req.cookies);
        if(!cookie){
            return res.json({"DATA":"NOT LOGGED FROM COOKIES"})
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
            console.log("Sessions is " + req.session.id)
            next();
        }else{
            return res.json({"DATA":"NOT LOGGED FROM SESSION"});
        }
    }
}