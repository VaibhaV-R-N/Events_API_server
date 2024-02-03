const express = require('express')

const eventRouter = express.Router()
const {verifyToken} = require("../middleware")
const {updateEvent,createEvent,makeEventInactive,getEvents, getEvent}  = require("../dbMethods")
const {Event} = require("../models")

eventRouter.get('/:eid',async(req,res)=>{
    
    try {
        const eid = req.params.eid
        const event = await getEvent(eid)
        res.status(200).json(event)
    } catch (error) {
        res.status(500).json(error)
    }
    
})

.get('/',async(req,res)=>{
    try {
        const events = await getEvents()
        res.status(200).json(events)
    } catch (error) {
        res.status(500).json(error)
    }
    
})

.get('/title/:title',async(req,res)=>{
    try {
        const title = req.params.title
 
        const events = await Event.find({title:{$regex:title,$options:'i'},inactive:false})
      
        res.status(200).json({events})
    } catch (error) {
        res.status(500).json({error:error.toString()})
    }
})
.get('/date/:date',async(req,res)=>{
    try {
        const date = req.params.date
        const events = await Event.find({date:{$regex:date,$options:'i'},inactive:false})
        res.status(200).json({events})
    } catch (error) {
        res.status(500).json({error:"Something went wrong..."})
    }
})
.get('/location/:loc',async(req,res)=>{
    try {
        const location = req.params.loc
        const events = await Event.find({location:{$regex:location,$options:'i'},inactive:false})
        res.status(200).json({events})
    } catch (error) {
        res.status(500).json({error:"Something went wrong..."})
    }
})

.post('/',verifyToken,async(req,res)=>{
    try {
        const payload = req.body
        const event = await createEvent(payload)
        res.status(200).json(payload)
    } catch (error) {
        res.status(500).json(error)
    }
   
})
.delete('/:eid',verifyToken,async(req,res)=>{
    try {
        const eid = req.params.eid
        const eventObj = await Event.findById(eid)
        if(eventObj.organizer){
            if(eventObj.organizer.toString() === req.user._id.toString()){
                const event = await makeEventInactive(eid)
                if(event.error){
                    res.status(400).json(event)
                }
                else{
                    res.status(200).json(event)
                }
            }else{
                res.status(400).json({error:"Verification failed..."})
            }
        }else{
            res.status(400).json({error:"Verification failed..."})
        }
        
    } catch (error) {
        res.status(500).json({error:"Soemthing went wrong..."})
    }
})
.put('/:eid',verifyToken,async(req,res)=>{
    try {
    
        const eid = req.params.eid
        const eventObj = await Event.findById(eid)
        if(eventObj._id){
            if(eventObj.organizer.toString() === req.user._id.toString()){
                const event = await updateEvent(eid,req.body)
                if(event.error){
                    res.status(400).json(event)
                }else{
                    res.status(200).json(event)
                }
            }else{
                res.status(400).json({error:"Verification failed..."})
            }
        }else{
            res.status(400).json({error:"Verification failed..."})
        }
        
    } catch (error) {
        res.status(500).json({error:"Something went wrong..."})
    }
    

})

module.exports = eventRouter