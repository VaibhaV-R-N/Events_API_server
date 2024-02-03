const {mongoose} = require("./mongodb")

const Schema = mongoose.Schema

const UserSchema = new Schema({
    username:{
        type:String,
        required:true,
        maxlength:20
    },
    password:{
        type:String,
        minlength:10,
        required:true
    },
    inactive:{
        type:Boolean,
        default:false
    }
})

const CommentSchema = new Schema({
    eventId:{
        type:Schema.Types.ObjectId,
        ref:"Event"
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    value:String,
    date:String
})

const RatingSchema = new Schema({
    eventId:{
        type:Schema.Types.ObjectId,
        ref:"Event"
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    value:{
        type:Number,
        enum:[0,1,2,3,4,5],
        default:0
    }
})

const EventSchema = new Schema({
    title:String,
    description:String,
    date:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    organizer:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    comments:{
        type:[Schema.Types.ObjectId],
        ref:"Comment",
        default:[]
    },
    ratings:{
        type:[Schema.Types.ObjectId],
        ref:"Rating",
        default:[]
    },
    overallrating:{
        type:Number,
        default:0
    },
    inactive:{
        type:Boolean,
        default:false
    },
    price:{
        VIP:{
            type:Number,
            default:50
        },
        General:{
            type:Number,
            default:25
        },
        Student:{
            type:Number,
            default:15
        }
    }
})


const TicketSchema  = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    eventname:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Event"
    },
    tickettype:{
        type:String,
        enum:["VIP","General","Student"]
    },
    price:Number,
    quantity:{
        type:Number,
        maxlength:10,
        default:1
    }

})

module.exports = {
    User: mongoose.model('User',UserSchema),
    Comment: mongoose.model('Comment',CommentSchema),
    Rating: mongoose.model('Rating',RatingSchema),
    Event:mongoose.model('Event',EventSchema),
    Ticket:mongoose.model('Ticket',TicketSchema)
}