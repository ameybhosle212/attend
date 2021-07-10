const mongoose = require('mongoose')
const data = require('../server/MOCK_DATA (2).json');
const User = require('./models/user');

mongoose.connect("mongodb://localhost:27017/polioce",{useUnifiedTopology:true,useNewUrlParser:true}).then(()=>{
    console.log("DB CONNECTED");
})

data.map((val)=>{
    const user = new User({
        name:val.name,
        DOB:val.DOB,
        password:val.password
    })
    user.save();
})

