const mongoose = require('mongoose')


mongoose.connect("mongodb://localhost:27017/polioce",{useUnifiedTopology:true,useNewUrlParser:true}).then(()=>{
    console.log("DB CONNECTED");
})

