const User = require('../models/user');
const bcrypt = require('bcryptjs')
const route = require('express').Router()
const jwt = require('jsonwebtoken');
const { isAuth, isSignedIN } = require('../auth/auth');
const multer = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'C:/Users/ameyb/Desktop/pooplo/server/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, req.session.User_ID + ' ' + file.originalname)
    }
})
  
var upload = multer({ storage: storage })  
const Attendance = require('../models/attendance');
const { VariablesAreInputTypesRule } = require('graphql');

route.get("/",(req,res)=>{
    return res.json({"DATA":"DATA"})
})

route.get("/getallUser" , isAuth , isSignedIN ,async (req,res)=>{
    const data = await User.find();
    var realData = [];
    data.map(val =>{
        realData.push({
            'id':val._id,
            'Name':val.name
        })
    })
    // realData = realData.json();
    console.log(typeof realData);
    console.log(req.cookies.user)
    return res.json(realData);
})

route.get("/user/:id", isAuth , isSignedIN , async (req,res)=>{
    const id = req.params.id;
    const {name , DOB , attend} = await User.findById(id);
    const attendance = await User.findById(id).populate('attend');
    var attendances = [];
    attendance.attend.map((data)=>{
        attendances.push({
            'Date':data.Date,
            'value':data.value
        })
    })
    console.log(attendances);
    return res.json({"Name":name,"DOB":DOB,"attend":attendances})
})

route.post("/user/:id/profile/image", isAuth , isSignedIN , upload.single('avatar')  , async (req,res)=>{
    const id = req.params.id;
    const user = await User.findById(id);
    if(user){
        console.log(req.file);
        return res.json({"DATA":"USER CHANGED IMAGE"})
    }else{
        res.json.json({"DATA":"INVALID USER"})
    }
})

route.get("/admin", isAuth , isSignedIN ,(req,res)=>{
    res.json({"Data":"YOU HAV LOGGED IN SUCCESSFULLY"})
})

route.post("/AddUserAttendance",isAuth , isSignedIN , async(req,res)=>{
    const { id , val } = req.body;
    const data = Attendance({
        Date:Date(),
        value:val,
        user:id
    })
    await User.findById({_id:id}).then(user =>{
        if(user){
            data.save();
            user.attend.push(data._id);
            user.save();
            return res.json({"DATA":"DONE SUCCESSFULLY"})
        }else{
            return res.json({"DATA":"DONE UNSUCCESSFULLY"})
        }
    })
})

route.post("/login", async (req,res)=>{
    const {name , password } = req.body;
    console.log(name + '  ' + password);
    const data = await User.findOne({name})
    if(data && data.isAdmin){
        bcrypt.compare(password , data.password , function(err,result){
            if(err) console.error(err);
            if(result){
                const token = jwt.sign({data},'secret')
                res.cookie('user',token,{httpOnly:false,signed:true,secure:true})
                req.session.User_ID = data._id;
                req.session.logged = true;
                console.log(req.session.User_ID);
                console.log(token);
                // console.log(req.cookies);
                return res.json({"JWTData":token})
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
            return res.json({"VAL":"LOGGED OUT SUCCESSFULLY"})
        });
    }else{
        res.json({"VAL":"YOU ARE NOT LOGGED IN"})
    }
})

module.exports = route;