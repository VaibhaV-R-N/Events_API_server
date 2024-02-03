const jwt = require("jsonwebtoken")
require("dotenv").config()
const {User} =  require("./models")
module.exports.verifyToken = async(req,res,next)=>{
    try {
        
        const token =  req.headers["authorization"].split(" ")[1]
       
        const decoded=jwt.verify(token,process.env.SECRET_KEY)
       
        if(decoded.id){
            const user = await User.findById(decoded.id)
            if(user._id){
                
                req.user = user
             
                return next()
            }else{
                res.status(400).json({error:"Varification failed"})
            }
            
        }else{
            res.status(400).json({error:"Varification failed"})
        }
        
    
    } catch (error) {
        console.log(error);
        res.status(400).json({error:"Verification failed!"})
    }
    
}