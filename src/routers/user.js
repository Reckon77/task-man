//setting up express and router
const express = require("express")
const router = new express.Router()
//importing user model
const User=require("../models/user")
//authentication middleware
const auth=require("../middleware/auth")
//multer for file upload
const multer=require('multer')
//sharp to corp images
const sharp=require("sharp")
//sendgrid email modules
const {sendWelcomeEmail, sendCancelationEmail}=require('../emails/accounts')

//Create new user
router.post('/users',async (req,res)=>{
    const user = new User(req.body)
    try{
        await user.save()
        //sending welcome mail
        sendWelcomeEmail(user.email, user.name)
        //logging in the user and generating new token
        const token=await user.generateAuthToken()
        res.status(201).send({user,token})
    }catch(e){
        res.status(400).send(e)
    }
    
    // user.save().then(() => {
    // res.status(201).send(user)
    // }).catch((e) => {
    // res.status(400).send(e)
    // })
})

//Login route
router.post('/users/login',async (req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token=await user.generateAuthToken()
        res.send({user,token})
    }catch(e){
        res.status(400).send()
    }
})
//Route to logout user from current device
router.post('/users/logout',auth,async(req,res)=>{
    try{
        //only removing the current token, keeping the others
        req.user.tokens=req.user.tokens.filter((token) =>{
            return token.token !== req.token
        } )
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})
//Route to logout user from all devices
router.post('/users/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens=[]
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

//Read the currently logged in user
router.get('/users/me',auth,async (req,res)=>{
  res.send(req.user)
})
// router.get('/users/:id',async (req, res) => {
//     const _id = req.params.id // Access the id provided
//     try{
//         const user=await User.findById(_id)
//         if (!user) {
//             res.status(404).send()
//         }else{
//             res.send(user)
//         }
        
//     }catch(e){
//         res.status(500).send()
//     }
//     // User.findById(_id).then((user) => {
//     // if (!user) {
//     // return res.status(404).send()
//     // }
//     // res.send(user)
//     // }).catch((e) => {
//     // res.status(500).send()
//     // })
//    })

// router.patch("/users/:id",async (req,res)=>{
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['name', 'email', 'password', 'age']
//     const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

//     if (!isValidOperation) {
//         return res.status(400).send({ error: 'Invalid updates!' })
//     }

//     const _id = req.params.id
//     try{
//         const user= await User.findById(_id)
//         updates.forEach((update)=>{
//             user[update]=req.body[update]
//         })
//         await user.save()
//         // const user=await User.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})
//         if(!user){
//             res.status(404).send()
//         }else{
//             res.send(user)
//         }
//     }catch(e){
//         res.status(400).send(e)
//     }
// })

//Update the details of the currently logged in user
router.patch("/users/me",auth,async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    
    try{
        const user= req.user
        updates.forEach((update)=>{
            user[update]=req.body[update]
        })
        await user.save()
        // const user=await User.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})
        res.send(user)

    }catch(e){
        res.status(400).send(e)
    }
})

//Delete the profile of the currently logged in user
router.delete('/users/me',auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id)
        // if (!user) {
        // return res.status(404).send()
        // }
        await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user)
       } catch (e) {
        res.status(500).send()
       }
})

//multer config and validation
const upload = multer(
    { 
        // dest: 'avatars/',
        limits:{
            fileSize:1000000
        },
        fileFilter(req,file,callBack){
            if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                return callBack(new Error('Please upload an image document'))
                }
                callBack(undefined, true)

        }
    }
    )

//module to saving the image as a buffer in the db
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
        const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer()
        //  req.user.avatar = req.file.buffer
        req.user.avatar = buffer
         await req.user.save()
         res.send()
        }, (error, req, res, next) => {
         res.status(400).send({ error: error.message })
})

//delete the avatar image
router.delete('/users/me/avatar',auth,async (req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

//Fetching an avatar
router.get('/users/:id/avatar', async (req, res) => {
    try {
    const user = await User.findById(req.params.id)
    if (!user || !user.avatar) {
    throw new Error()
    }
    res.set('Content-Type', 'image/png')
    res.send(user.avatar)
    } catch (e) {
    res.status(404).send()
    }
})
module.exports=router