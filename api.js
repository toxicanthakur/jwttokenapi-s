const express = require('express');
const app = express();
const morgan=require('morgan');
const bcrypt = require('bcrypt');
const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const dotenv = require('dotenv');
const bodyparser = require('body-parser');
const users=require('./userschema.js');
dotenv.config();

app.use(express.json())

//db connection
mongoose.connect(process.env.URI,() =>{
  console.log("DATABASE CONNECTED");


});
app.get('/',(req,res) =>{   
    res.send("HI")
})
//create-user api
app.post('/create-user',async (req,res )=>{
const salt= await bcrypt.genSalt(10);
const hashedpassword = await bcrypt.hash(req.body.password,salt)
const user=new users({
  email: req.body.email,
  password:hashedpassword

})
//error handelling
try{
const createduser=await user.save();
res.send(createduser);
}
catch(err){
  res.status(400).send(err)

}
});
//login-user api

app.post('/login-user',async (req,res) =>{
  const user =await users.findOne({email:req.body.email });
  if(!user)
  {
    return res.status(400).send("no account found")
  }
  const ispassword =await bcrypt.compare(req.body.password,user.password)
  if(!ispassword)
  {
    return res.status(400).send("password incorrect");
  }
  const jwtToken=jwt.sign({_id:user._id},process.env.SECRET_ACCESS_TOKEN);

  res.status(200).json({
    token:jwtToken,
    message:"user successfully logged in"
  });
  });

  //validate-user api
  app.post('/validate-user', async(req,res) => {
    const authtoken=req.header("token")
    if(!authtoken)
    {
      return res.status(400).send("no token found access denied");
    } 
    try {
      const isverified=jwt.verify(authtoken,process.env.SECRET_ACCESS_TOKEN)
     
      res.status(200).send("true")
      
    } catch (err) 
    {
      res.status(400).send("false") 
    }
  });


    
app.post('/create',async(req,res)=> {

 })

app.listen(3000)