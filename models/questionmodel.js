const mongoose = require('mongoose')
const schema = mongoose.Schema

const questionschema = new schema({
    reguser:{
        type:schema.Types.ObjectId,
        ref:'mypeople'
    },
    text1:{
        type:String,
        required:true
    },
    text2:{
        type:String,
        required:true
    },
    upvote:[{
        reguser:{
            type:schema.Types.ObjectId,
            ref:'mypeople'
        }
    }],
    answers:[{
        reguser:{
            type:schema.Types.ObjectId,
            ref:'mypeople'
        },
        text:{
            type:String,
            required:true
        },
        name:{
            type:String
        },
        date:{
            type:Date,
            default:Date.now()
        }
    }],
    date:{
        type:Date,
        default:Date.now()
    }
})

module.exports = question = mongoose.model('question',questionschema)