const express = require('express')
const { createUser,getUser, getUserTickets, updateUser, cancelTicket, makeUserInactive } = require('../dbMethods')
const userRouter = express.Router()
const jwt = require("jsonwebtoken")
const {verifyToken} = require("../middleware")
userRouter.get('/uid',async(req,res)=>{
    
})

.get('/ticket/:uid',verifyToken,async(req,res)=>{
    const uid = req.params.uid
    try {
        const tickets = await getUserTickets(uid)
        if(tickets.error){
            res.status(400).json(tickets)
        }else{
            res.status(200).json(tickets)
        }
    } catch (error) {
        res.status.json({error:"Something went wrong"})
    }
})

.post('/signup',async(req,res)=>{
    
    const payload = req.body
    
    if(payload.password?.trim() === payload.confirmPassword?.trim()){
        try {
            const response = await createUser({username:payload.username,password:payload.password})
            
            if(!response.error){
                const token = jwt.sign({id:response._id,username:response.username},process.env.SECRET_KEY,{expiresIn:"1hr"})
                res.status(200).json({id:response._id,username:response.username,token})
            }else{
                res.status(500).json({error:response.error})
            }
            
        } catch (error) {
          
            res.status(500).json({error:"something went wrong"})
        }
        
    }else{
        res.status(400).json({error:"invalid request"})
    }
   
})

.post('/login',async(req,res)=>{
    try {
      
        const user = await getUser(req.body)

        if(!user.error){
            token  = jwt.sign({id:user._id,username:user.username},process.env.SECRET_KEY,{expiresIn:"1hr"})

            res.status(200).json({id:user._id,username:user.username,token})
        }else{
            res.status(400).json({error:"something went wrong..."})
        }
    } catch (error) {
        res.status(500).json({error:"something went wrong..."})
    }
})

.post('/logout',async(req,res)=>{

})

.put('/:uid',verifyToken,async(req,res)=>{
    try {
        const uid = req.params.uid
        if(req.user._id.toString() === uid){
            const user = await updateUser(uid,req.body)
            if(user.error){
                res.status(400).json({error:"Invalid request"})
            }else{
                res.status(200).json(user)
            }
        }else{
            res.status(400).json({error:"verification failed..."})
        }
        
    } catch (error) {
        res.status(500).json({error:"Something went wrong..."})
    }
})

.delete('/:uid',verifyToken,async(req,res)=>{
    try {
        const uid = req.params.uid
        if(req.user._id.toString() === uid){
            const user = await makeUserInactive(uid)
            if(user.error){
                res.status(400).json(user)
            }else{
                res.status(200).json(user)
            }
        }else{
            res.status(400).json({error:"verification failed..."})
        }
        
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

.delete('/:uid/ticket/:tid',verifyToken,async(req,res)=>{
    try {
        const uid = req.params.uid
        const tid = req.params.tid

        const ticket = await cancelTicket(uid,tid)
        if(ticket.error){
            res.status(400).json(ticket)
        }else{
            res.status(200).json(ticket)
        }
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

module.exports = userRouter