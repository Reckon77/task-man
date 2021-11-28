//Importing express
const express = require("express")
const path=require('path');
require("./db/mongoose") //mongoose connection

//Importing user and task routes
const userRouter=require("./routers/user")
const taskRouter=require("./routers/task")
const homeRouter=require("./routers/home")
//creating the instance of express app and defining port
const app = express()
const port=process.env.PORT

const viewsPath=path.join(__dirname,'../templates/views')
app.set('view engine','hbs')
app.set('views',viewsPath)
// const multer=require('multer')
// const upload = multer({ dest: 'images/' })

// app.post('/upload',upload.single('avatar'),(req,res)=>{
//     res.send()
// })
//Example of using express middleware in all the routes
// const loggerMiddleware = (req, res, next) => {
//     console.log('New request to: ' + req.method + ' ' + req.path)
//     next()
//    }
   // Register the function as middleware for the application
// const maintenance=(req,res,next)=>{
//     res.status(503).send({
//         error:"The service is not available"
//     })
// }
// app.use(maintenance)

//parses incoming requests with JSON payloads
app.use(express.json())
//use the routes
app.use(homeRouter)
app.use(userRouter)
app.use(taskRouter)

//runnning the app
app.listen(port,()=>{
    console.log("Server running on port "+port)
})

