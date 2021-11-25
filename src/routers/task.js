//setting up express and router
const express = require("express")
const router = new express.Router()
//authentication middleware
const auth = require('../middleware/auth')
//task model
const Task=require("../models/task")


//crete a new task
router.post('/tasks',auth,async (req,res)=>{
    // const task = new Task(req.body)
    const task=new Task({
        //task body(description and completed)
        ...req.body,
        //task user object id
        owner:req.user._id
    })
    //saving the task in the db
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
    // task.save().then(() => {
    // res.status(201).send(task)
    // }).catch((e) => {
    // res.status(400).send(e)
    // })
})

//Read the tasks
// GET tasks
// 1. /tasks
// 2. /tasks?completed=true
// 3./tasks?limit=10
// 4./tasks?skip=10 (fetch the 2nd page)
// 5. /tasks?sort=createdAt:asc (or desc)
router.get('/tasks',auth,async (req,res)=>{
    const match = {}
    const sort = {}
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    if (req.query.sort) {
        const parts = req.query.sort.split(':')
        //console.log(parts)
        sort[parts[0]] = parts[1]
    }
    try{
        // const tasks=await Task.find({owner:req.user._id})
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit)|| null,
                skip: parseInt(req.query.skip)|| null,
                sort
            }
           })
        // res.send(tasks)
        res.send(req.user.tasks)
    }catch(e){
        res.status(500).send()
    }
    // Task.find({})
    //     .then((tasks)=>{
    //         res.send(tasks)
    //     })
    //     .catch((e) =>{
    //         res.status(500).send()
    //     })
})

//route to read a task
router.get('/tasks/:id',auth,async (req, res) => {
    const _id = req.params.id // Access the id provided
    try{
        //const task=await Task.findById(_id)
        const task= await Task.findOne({_id,owner: req.user._id})
        if (!task) {
            res.status(404).send()
        }else{
            res.send(task)
        }
        
    }catch(e){
        res.status(500).send()
    }
    // Task.findById(_id).then((task) => {
    // if (!task) {
    // return res.status(404).send()
    // }
    // res.send(task)
    // }).catch((e) => {
    // res.status(500).send()
    // })
   })

//route to update a task
router.patch("/tasks/:id",auth,async (req,res)=>{
    //checking if only description and completed is passed in body
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description','completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    
    try{
        const task=await Task.findOne({_id:req.params.id,owner:req.user._id})
        // const task=await Task.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})
        // const task= await Task.findById(_id)
       
        if(!task){
            return res.status(404).send()
        }
        updates.forEach((update)=>{
            task[update]=req.body[update]
        })
        
        await task.save()
        res.send(task)
        
    }catch(e){
        res.status(400).send(e)
    }
})

//route to delete a task
router.delete('/tasks/:id',auth, async (req, res) => {
    try {
        // const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if (!task) {
        return res.status(404).send()
        }
        res.send(task)
       } catch (e) {
        res.status(500).send()
       }
})

//exporting the routes
module.exports=router