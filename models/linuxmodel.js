const mongoose = require('mongoose')
const schema = mongoose.Schema

const linuxmodel = new schema({
    reguser:{
        type:schema.Types.ObjectId,
        ref:'mypeople'
    },
    desc:{
        type:String,
        required:true
    },
    code:{
        type:String,
        required:true
    },
    error:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now()
    },
    comment:[{
        reguser:{
            type:schema.Types.ObjectId,
            ref:'mypeople'
        },
        text:{
            type:String,
            required:true
        },
        username:{
            type:String,
            required:true
        },
        loveans:[{
            reguser:{
                type:schema.Types.ObjectId,
                ref:'mypeople'
            }
        }],
        date:{
            type:Date,
            default:Date.now()
        }
    }],
    upvote:[{
        reguser:{
            type:schema.Types.ObjectId,
            ref:'mypeople'
        }
    }],
})

module.exports = linux = mongoose.model('linuxque',linuxmodel)