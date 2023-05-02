
const user = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redisClient = require("../helpers/redis");



const signup =  async (req,res) =>{
    try{
        const {name,email,password,preferred_ip} = req.body;        
        const isUserPresent = await user.findOne({email});
         if(isUserPresent) return res.send("Login Please You have registered already");
         
         const hash = await bcrypt.hash(password,8);
         const newUser = new user({name,email, password: hash, preferred_ip});
         await newUser.save();

         res.send("Signup Successful")
    } catch(err) {          
        res.send(err.message);
    }
}

const login = async (req,res)=> {
    try {         
        const {email, password} = req.body;
        const isUser  = await user.findOne({email});
        if(!isUser) return res.send("Register First");

        const ispass = await bcrypt.compare(password,isUser.password);
        if(!ispass) return res.send("Wrong Credentials");

        const token = await jwt.sign({userId:isUser._id,preferred_ip:isUser.preferred_ip},process.env.JWT_SECRET, {expiresIn:"1hr"})

        res.send({message: "Login Done", token});
    } catch(err) {
        console.log("error from login")
         res.send(err.message)
    }
}

const logout = async (req,res) =>{
    try{
        const token = req.headers?.authorization?.split(" ")[1];
        if(!token) return res.status(403).send("Enter token");
        await redisClient.set(token,token);
        res.send("logout successful");
    }catch(err) {
        res.send(err.message)
    }
}

module.exports = {login,logout,signup}