require('dotenv').config()
const User = require('../models/user');
const bcrypt = require('bcryptjs')
const route = require('express').Router()
const jwt = require('jsonwebtoken');
const { isAuth, isSignedIN } = require('../auth/auth');
const { uploadFile , downloadImage } = require('../auth/s3Upload')
const multer = require('multer')
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'C:/Users/ameyb/Desktop/pooplo/server/uploads')
//     },
//     filename: function (req, file, cb) {
//       cb(null, req.session.User_ID + ' ' + file.originalname)
//     }
// })
var upload = multer({ dest: 'uploads/' })  
const Attendance = require('../models/attendance');
route.get("/dashboard" , isAuth , isSignedIN ,async (req,res)=>{
    const data = await User.find();
    var realData = [];
    data.map(val =>{
        realData.push({
            'id':val._id,
            'Name':val.name
        })
    })
    // realData = realData.json();
    return res.render("dashboard",{'Data':realData});
})

route.get("/user/:id", isAuth , isSignedIN , async (req,res)=>{
    const id = req.params.id;
    const {name , DOB , image } = await User.findById(id);
    const attendance = await User.findById(id).populate('attend');
    var attendances = [];
    attendance.attend.map((data)=>{
        attendances.push({
            'Date':data.Date,
            'value':data.value
        })
    })
    console.log(attendances);
    return res.render("Profile",{"Name":name,"DOB":DOB,"attend":attendances, 'id':id ,'image':image})
})

// images UPLOAD AND DOWNLOAD

route.get("/images/:key",(req,res)=>{
    const key = req.params.key;
    const readStream = downloadImage(key)
    readStream.pipe(res)
})

route.post("/user/:id/profile/image", isAuth , isSignedIN , upload.single('avatar')  , async (req,res)=>{
    const id = req.params.id;
    const user = await User.findById(id);
    if(user){
        console.log(user)
        console.log(req.file);
        user.image = req.file.filename;
        user.save();
        console.log(req.file);
        const result = await uploadFile(req.file)
        console.log(result);
        return res.redirect(`/user/${id}`)
    }else{
        res.json({"DATA":"INVALID USER"})
    }
})

// ADMIN

route.get("/admin", isAuth , isSignedIN ,(req,res)=>{
    res.json({"Data":"YOU HAV LOGGED IN SUCCESSFULLY"})
})

// USER ATTENDANCE

route.get("/user/:id/AddUserAttendance", async (req,res)=>{
    const id = req.params.id;
    var user = await User.findOne({_id:id})
    if(user){
        return res.render("AdduserAttendance",{'id':id});
    }else{
        return res.json({"DATA":"USER IS NOT WRONG"});
    }
})

route.post("/user/:id/AddUserAttendance",isAuth , isSignedIN , async(req,res)=>{
    const { From , To ,val } = req.body;
    const id = req.params.id;
    const data = Attendance({
        From:From,
        To:To,
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

// USER LOGIN

route.get("/login",(req,res)=>{
    res.render("login")
})

route.post("/login", async (req,res)=>{
    const {name , password } = req.body;
    console.log(name + '   ' + password);
    const data = await User.findOne({name})
    if(data && data.isAdmin){
        bcrypt.compare(password , data.password , function(err,result){
            if(err) console.error(err);
            if(result){
                const token = jwt.sign({data},'secret')
                res.cookie('user',token)
                req.session.User_ID = data._id;
                req.session.logged = true;
                // console.log(req.cookies);
                return res.redirect("/dashboard")
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