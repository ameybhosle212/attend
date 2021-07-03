const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name:String,
    DOB:String,
    isAdmin:{
        type:Boolean,
        default:false
    },
    password:{
        type:String
    },
    attend:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Attendance'
        }
    ]
})

const User = new mongoose.model('User',UserSchema)

module.exports = User;