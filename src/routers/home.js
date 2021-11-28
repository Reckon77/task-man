//setting up express and router
const express = require("express")
const router = new express.Router()

//Home page/Docs
router.get('/', (req,res)=>{
    res.render('index')
})

module.exports=router