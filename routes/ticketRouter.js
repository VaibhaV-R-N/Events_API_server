const express = require('express')
const {verifyToken} = require("../middleware")
const ticketRouter = express.Router()
const  {createTicket} = require("../dbMethods")

ticketRouter.post('/',verifyToken,async(req,res)=>{
    try {
        
        const ticket = await createTicket(req.body)

        if(ticket.error){
            res.status(500).json({error:"Something went wrong!"})
        }else{
            res.status(200).json(ticket)
        }
    } catch (error) {
        res.status(500).json({error:"Something went wrong!"})
    }
})




module.exports = ticketRouter