const mongoose=require('mongoose')
const schema=mongoose.Schema

const PersonSchema= new schema({
    name:{
        type:String,
        default:true
    },
    email:{
        type:String,
        default:true
    },
    password:{
        type:String,
        default:true
    },
    username:{
        type:String,
        default:true
    },
    profilepic:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    },
    gender:{
        type:String,
        default:true
    }
})
module.exports= Person = mongoose.model('mypeople',PersonSchema)