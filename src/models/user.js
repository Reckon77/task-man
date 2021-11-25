const mongoose = require('mongoose')
//validator for email validation
const validator = require('validator')
//bcrypt to hash the password
const bcrypt = require('bcryptjs')
//jwt for web tokens
const jwt =require("jsonwebtoken")
const Task = require('./task')
const userSchema=new mongoose.Schema({
    name: {
    type: String,
    trim: true,
    required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
        if (!validator.isEmail(value)) {
        throw new Error('Email is invalid')
        }
        }
    },
    age: {
    type: Number,
    default:0,
    validate(value){
        if(value<0){
            throw new Error("Age must be a positive number")
        }
    }
    },
    password:{
        type:String,
        required: true,
        trim: true,
        minLength: 7,
        validate(value){
            if(value.toLowerCase().includes("password")){
                throw new Error("Invalid Password")
            }
        }
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }],
    //image as buffer
    avatar:{
        type: Buffer
    }
},{
    timestamps: true
})
//Relationship between User and tasks
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})
//method to call on a single user for generating web token
userSchema.methods.generateAuthToken= async function(){
    const user=this
    const token=jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn:'7 days' })
    //storing the token in tokens array
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token
}
//method to call on a single user to remove password and tokens
userSchema.methods.toJSON=function(){
    const user=this
    const userObject=user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}
//method to call on User model to find a user by its credentials
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
    throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
    throw new Error('Unable to login')
    }
    return user
}
//Hash the password before we save a user
userSchema.pre('save',async function (next){
    const user = this
    if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

//Delete users tasks when the user is deleted
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User',userSchema)

module.exports=User
