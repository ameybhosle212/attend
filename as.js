const mongoose = require('mongoose')
const User = require('./models/user');
const jsonfile = require('jsonfile')
mongoose.connect("mongodb+srv://amey:amey@cluster0.rkdnt.mongodb.net/myAttend?retryWrites=true&w=majority",{useUnifiedTopology:true,useNewUrlParser:true}).then(()=>{
    console.log("DB CONNECTED");
})
const data = require('./ass.json')

function aki(){
    data.map(async (val)=>{
        const user = await User({
            name:val.name,
            password:val.password
        })
        user.save()
        console.log(user);
    })
}


aki()