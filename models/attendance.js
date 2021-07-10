const mongoose = require('mongoose')

const AttendanceSchema = new mongoose.Schema({
    Date:{
        type:Date,
        required:true
    },
    value:{
        type:Number,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
})

const Attendance = new mongoose.model('Attendance',AttendanceSchema)

module.exports = Attendance;