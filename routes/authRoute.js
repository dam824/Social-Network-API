const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  res.send("user auth");
});

//REGISTER

router.post("/register", async (req, res) => {
  try {
    //GENERATE NEW PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    //CREATE NEW USER
    const newUSer = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    //USER SAVE RESPONSE
    const user = await newUSer.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err)
  }
});


//LOGIN

router.post("/login", async (req,res)=>{
    try{
        //FIND USER WITH EMAIL
        const user = await User.findOne({email:req.body.email});
        !user && res.status(404).send("User not found")

        //COMPARE USER FOUND W/ PASSWORD
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(400).json('wrong password')

        //SEND RESPONSE IF USER FOUND
        res.status(200).json(user);
    } catch(err){
        
    }
})

module.exports = router;
