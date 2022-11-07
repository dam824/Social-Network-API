const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const router = require("express").Router();
const bcrypt = require("bcrypt");


//UPDATE USER
router.put("/:id", async(req,res)=> {
    //USER CHECK
    if(req.body.userId === req.params.id || req.body.isAdmin){
        //SEND PASSWORD IN POSTMAN BODY
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10); //generate new password
                req.body.password = await bcrypt.hash(req.body.password, salt);//hash and update this req.body.password
            }catch(err){
                return res.status(500).json(err)
            }
        }

        //update user                              
        try{
            const user = await User.findByIdAndUpdate(req.params.id, { // req.params.id = req.body.useriD.
                $set: req.body,
            }); 
            res.status(200).json("Account has been updated")
        }  catch(err){
            return res.status(500).json(err)
        } 
    }else{
        return res.status(403).json('you can update only your account')
    }
})

//DELETE USER
router.delete("/:id", async(req,res)=> {
    
    if(req.body.userId === req.params.id || req.body.isAdmin){
        //update user                              // req.params.id = req.body.useriD.
        try{
            const user = await User.findByIdAndDelete(req.params.id); 
            res.status(200).json("Account has been updated")
        }  catch(err){
            return res.status(500).json(err)
        } 
    }else{
        return res.status(403).json('you can delete only your account')
    }
});


//GET USER
router.get("/:id", async (req,res)=> {
    try{
        const user =  await User.findById(req.params.id);
        const {password,updatedAt, ...other} = user._doc //doc query all object here from the user expect password etc..
        res.status(200).json(other)
    } catch (err) {
        res.status(500).json(err);
    }
});

// FOLLOW USER
router.put('/:id/follow', async (req,res)=>{
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            //IF user don't follow himself but other user we add id on followers and following userSchema
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({ $push: {followings: req.body.userId } });
                await currentUser.updateOne({$push: { followers: req.params.id } });
                res.status(200).json("user has been followed");

            } else {
                res.status(403).json("you allready follow this user")
            }
        }catch(err){
            res.status(500).json(err)
        }

    }else{
        res.status(403).json("you can't follow yourself") //IF USER ARE SAME
    }
})

// UNFOLLOW USER
router.put('/:id/unfollow', async (req,res)=>{
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({ $pull: {followings: req.body.userId } });
                await currentUser.updateOne({$pull: { followers: req.params.id } });
                res.status(200).json("user has been unfollowed");

            } else {
                res.status(403).json("you don't follow this user anymore")
            }
        }catch(err){
            res.status(500).json(err)
        }

    }else{
        res.status(403).json("you can't unfollow yourself") //IF USER ARE SAME
    }
})





module.exports = router;
