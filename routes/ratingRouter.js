const express = require('express')
const { createRating } = require('../dbMethods')
const {verifyToken} = require("../middleware")
const ratingRouter = express.Router()
const {Rating, Event} = require("../models")

ratingRouter.post('/',verifyToken,async(req,res)=>{
    try {
        const exists = await Rating.findOne({user:req.body.user,eventId:req.body.eventId})

        if(!exists){
            const rating  = await createRating(req.body)
            if(rating.error){
                res.status(400).json(rating)
            }else{
                res.status(200).json(rating)
            }
        }else{
            exists.value = req.body.value
            await exists.save()
            const event = await Event.findById(req.body.eventId).populate("ratings")
            let average = 0
            event.ratings.forEach(e=>{
                average+=e.value
            })
            event.overallrating = average/event.ratings.length
            await event.save()
            res.status(200).json(exists)
        }

        
    } catch (error) {
        res.status(500).json({error:"Something went wrong.."})
    }
    
})



module.exports = ratingRouter