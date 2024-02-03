const {User, Event, Comment, Rating, Ticket}  = require("./models")

module.exports.createUser = async({username,password})=>{
    let response
    try {
        const exists = await User.find({username})
        if(exists.length > 0){
            response = {
                error:"user already exists!"
            }
        }else{
            response = await new User({
                username,
                password
            }).save()
        }
        
        return response
    } catch (error) {
        response = {
            error:error.message
        }
        return response
    }
    
}

module.exports.getUser = async({username,password})=>{
    let response
    try {
        response = await User.findOne({username,password})
        if(response){
            return response
        }
        return {
            error:"Invalid username or password!"
        }
        
    } catch (error) {
        response = {
            error:error.message
        }
        return response
    }
    
}

module.exports.updateUser = async(uid,payload)=>{
    let response
    
    try {
        const user  = await User.findById(uid)
        if(user.password === payload.oldPassword){
            user.username = payload.username
            user.password = payload.newPassword
            await user.save()
            response = user
        }else{
            response = {
                error:"Invalid request"
            }
        }
        
        return response
        
    } catch (error) {
        response = {
            error:error.message
        }
        return response
    }
    
}

module.exports.makeUserInactive = async(userId)=>{
    let response
    try {
        
        const user  = await User.findByIdAndUpdate(userId,{inactive:true},{new:true})
        response = user

    } catch (error) {
        response = {
            error:error.message
        }
    }
    return response
}

module.exports.createEvent = async(eventObj)=>{
    let response
    try {
        const event = await new Event(eventObj).save()
        response = event
        
    } catch (error) {
        response = {
            error:error.message
        }
    }
    return response
}

module.exports.getEvents = async()=>{
    let response
    try {
        response = await Event.find({inactive:false})
        return {response}
    } catch (error) {
        response = {
            error:error.message
        }
        return response
    }
    
}

module.exports.getEvent = async(id)=>{
    let response
    try {
        response = await Event.findById(id).populate({
            path:"comments",
            model:"Comment",
            populate:[{
                path:"user",
                model:"User"
            }]
        })
        return {response}
    } catch (error) {
        response = {
            error:error.message
        }
        return response
    }
    
}

module.exports.makeEventInactive = async(eventId)=>{
    let response
    try {
        const event  = await Event.findByIdAndUpdate(eventId,{inactive:true},{new:true})
        response = event

    } catch (error) {
        response = {
            error:error.message
        }
    }
    return response
}

module.exports.updateEvent = async(eid,eventObj)=>{
    let response
    try {
        const event = await Event.findByIdAndUpdate(eid,eventObj,{new:true})
        if(event){
            response = event
        }else{
            response = {
                error:"Something went wrong.."
            }
        }   
        
        
    } catch (error) {
        response = {
            error:error.message
        }
    }
    return response
}

module.exports.createComment = async(commentObj)=>{
    let response
    try {
        const comment = await new Comment(commentObj).save()
        await Event.updateOne({_id:commentObj.eventId},{$push:{comments:comment._id}})
        response = comment
        
    } catch (error) {
        response = {
            error:error.message
        }
    }
    return response
}

module.exports.deleteComment = async(eid,cid)=>{
    let response
    try {
        const comment = await Comment.findByIdAndDelete(cid)
        await Event.updateOne({_id:eid},{$pull:{comments:cid}})
        response = comment
        
    } catch (error) {
        response = {
            error:error.message
        }
    }
    return response
}

module.exports.updateComment = async(cid,cmmtObj)=>{
    let response
    try {
        const comment = await Comment.findByIdAndUpdate(cid,cmmtObj,{new:true})
        if(comment){
            response = comment
        }else{
            response = {
                error:"Something went wrong.."
            }
        }   
        
        
    } catch (error) {
        response = {
            error:error.message
        }
    }
    return response
}

module.exports.getComments = async()=>{
    let response
    try {
        const comments = await Comment.find({})
       
        response = {comments}
        
    } catch (error) {
        response = {
            error:error.message
        }
    }
    return response
}

module.exports.createRating = async(ratingObj)=>{
    let response
    try {
        const rating = await new Rating(ratingObj).save()
        const event = await Event.findById(ratingObj.eventId)
        event.ratings.push(rating._id)
        event.overallrating = (event.overallrating+rating.value)/event.ratings.length
        await event.save()
       
        response = rating
        
    } catch (error) {
        response = {
            error:error.message
        }
    }
    return response
}

module.exports.createTicket = async(ticketObj)=>{
    let response
    try {
        const ticket = (await new Ticket(ticketObj).save())
       
        response = ticket
        
    } catch (error) {
        
        response = {
            
            error:error.message
        }
    }
    return response
}

module.exports.cancelTicket = async(uid,ticketId)=>{

    let response
    try {
        const ticket = await Ticket.findById(ticketId)
      
        if(ticket._id){
            if(ticket.user.toString() === uid){
             
                response = await Ticket.findByIdAndDelete(ticketId)
            
            }
        }else{
    
            response = {error:"Invalid request"}
        }
      
        
    } catch (error) {
        response = {
            error:error.message
        }
    }
    return response
}



module.exports.getUserTickets = async(uid)=>{
    let response
    try {
        const tickets = await Ticket.find({user:uid}).populate('eventname')
 
        response = {tickets}

    } catch (error) {
        response = {error:error.message}
    }
    
    return response
}