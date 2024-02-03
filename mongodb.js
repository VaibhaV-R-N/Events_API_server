const { default: mongoose } = require("mongoose");
require("dotenv").config()

// mongoose.connect('mongodb://127.0.0.1:27017/eventdb')
const uri = process.env.MONGODB_URL
mongoose.connect(uri)
.then(() => console.log('Connected! listening at port:27017'));


module.exports.mongoose = mongoose 