const mongoose = require('mongoose')

const AttendanceSchema = new mongoose.Schema({
    Date:{
        type:Date,
        required:true
    },
    value:{
        type:Number,
        required:true
    }
})

const Attendance = new mongoose.model('Attendance',AttendanceSchema)

module.exports = Attendance;