//Importing mongoose
const mongoose = require('mongoose')

//Connecting mongoose with mongodb database
mongoose.connect(process.env.MONGODB_URL, {
 useNewUrlParser: true,
//  useCreateIndex: true
})





