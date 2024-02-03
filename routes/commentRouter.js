const express = require('express')
const { createComment, updateComment, deleteComment } = require('../dbMethods')
const {verifyToken} = require("../middleware")
const {Comment} = require("../models")

const commentRouter = express.Router()

commentRouter.post('/',verifyToken,async(req,res)=>{
    try {
        const comment = await createComment(req.body)
        if(comment.error){
            res.status(400).json(comment)
        }else{
            res.status(200).json(comment)
        }
    } catch (error) {
        res.status(500).json({error:"Something went wrong..."})
    }

})


.delete('/:cid',verifyToken,async(req,res)=>{
    try {
        const cid = req.params.cid
        const eid = req.params.eid
        const commentObj = await Comment.findById(cid)
        if(commentObj.user){
            if(commentObj.user.toString() === req.user._id.toString()){
                const comment = await deleteComment(eid,cid)
                if(comment.error){
                    res.status(400).json(comment)
                }
                else{
                    res.status(200).json(comment)
                }
            }else{
                res.status(400).json({error:"Verification failed..."})
            }
        }else{
            res.status(400).json({error:"Verification failed..."})
        }
        
    } catch (error) {
        res.status(500).json({error:"Something went wrong.."})
        
    }
})

.put('/:cid',verifyToken,async(req,res)=>{
    try {
        const cid = req.params.cid
        const commentObj = await Comment.findById(cid)
        if(commentObj._id){
            if(commentObj.user.toString() === req.user._id.toString()){
                const comment = await updateComment(cid,req.body)
                if(comment.error){
                    res.status(400).json(comment)
                }else{
                    res.status(200).json(comment)
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

module.exports = commentRouter