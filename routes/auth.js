const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const User = mongoose.model("User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {JWT_SECRET} = require('../keys')
const requireLogin = require("../middleware/requireLogin")

router.get("/protected",requireLogin,(req,res)=>{
    res.send("protected")
})

router.post("/signup",(req,res)=>{
    const {email,password} = req.body
    if(!email || !password ){
        return res.json({please:"please add all the fields"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"user already exists with that email"})
        }
        bcrypt.hash(password,12)
        .then(hashedpassword=>{
            const user = new User({
                email,
                password:hashedpassword,
                
            })
    
            user.save()
            .then(user=>{
                res.json({message:"saved successfully"})
            })
            .catch(err=>{
                console.log(err)
            })
        })
        
    })
    .catch(err=>{

        console.log(err)
    })
})

router.post('/signin',(req,res)=>{
    console.log("hello")
    const {email,password} = req.body
    if(!email || !password){
        res.status(422).json({error:"please add email or password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            res.status(422).json({error:"Invalid Email or password"})
        }
        bcrypt.compare(password,savedUser.password)
            .then(doMatch=>{
                if(doMatch){
                    const token = jwt.sign({_id:savedUser},JWT_SECRET)
                    res.json({token,user:savedUser})
                }else{
                    return res.status(422).json({error:"Invalide Email or password"})
                }
            }).catch(err=>{
                console.log(err)
            })
    })
})

module.exports = router