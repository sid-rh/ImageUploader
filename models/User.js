const mongoose=require('mongoose');
const Image=require('./Image');
const userSchema=mongoose.Schema({
    googleId:{
        type:String,
        required:true,
    },
    name:
    {
        type:String,
        required:true
    },
    images:[Image],

    
});

const User = mongoose.model('User', userSchema);
module.exports = User;