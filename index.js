const express = require("express");
const eventRouter = require("./routes/eventRouter");
const bodyParser = require("body-parser")
const app = express()
const cors = require("cors");
const ticketRouter = require("./routes/ticketRouter");
const commentRouter = require("./routes/commentRouter");
const ratingRouter = require("./routes/ratingRouter");
const userRouter = require("./routes/userRouter");
const cookieParser = require("cookie-parser");
require('dotenv').config()
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cors({
    // origin:["http://localhost:5173","https://hoppscotch.io"],
    // credentials:true
    origin:"*"
}))
app.use(cookieParser())




app.use('/events',eventRouter)
app.use('/events/:eid/ticket/',ticketRouter)
app.use('/events/:eid/comment/',commentRouter)
app.use('/events/:eid/rating/',ratingRouter)
app.use('/user',userRouter)



app.listen(3000,(err)=>{
    if(err){
        console.log("something went wrong status:500");
    }else{
        console.log("listening at port: 3000");
    }
})