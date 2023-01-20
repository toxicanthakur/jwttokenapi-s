const mongoose =require('mongoose');
const userschema = new mongoose.Schema({
    email:{
        type:String,
        required:"EMAIL is required",
        minlength:4,
        maxlength:50
    },
    password:{
        type:String,
        require:"Password is required",
        minlength:6,
        maxlength:100
    }

    });

    module.exports=mongoose.model("users",userschema)