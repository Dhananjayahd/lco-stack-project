const mongoose=require('mongoose')
const express = require('express')
const router = express.Router()
const passport = require('passport')

const profile= require('../../models/profilemodel')
const linux=require('../../models/linuxmodel')

//@type         POST
//@route        api/linuxque/
//des           route for posting linux questions
//access        PRIVATE

router.post('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    profile.findOne({reguser:req.user.id})
    .then((pro)=>{
        if(!pro){
            return res.status(404).json({message:'profile not found'})
        }
        const newlinuxque = new linux({
            reguser:req.user.id,
            desc:req.body.desc,
            code:req.body.code,
            error:req.body.error,
        })
        newlinuxque.save()
        .then((linuxque)=>res.json(linuxque))
        .catch(err=>console.log('error during saving linux questions'+err))
    })
    .catch(err=>console.log('error while fetching the profile'))
})

//@type         POST
//@route        api/linuxque/comment/:id
//des           route for posting linux comments
//access        PRIVATE

router.post('/comment/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    profile.findOne({reguser:req.user.id})
    .then((pro)=>{
        if(!pro){
            return res.status(404).json({message:'prfile not found'})
        }
        linux.findById(req.params.id)
        .then((linuxque)=>{
            const newcomment={
                reguser:req.user.id,
                text:req.body.text,
                username:pro.username
            }
            linuxque.comment.push(newcomment)
            linuxque.save()
            .then((li)=>res.json(li))
            .catch(err=>console.log('error during saving comment'+err))
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
})

//@type         GET
//@route        api/linuxque/
//des           route for getting all linux questions
//access        PUBLIC

router.get('/',(req,res)=>{
    linux.find()
    .sort({date:-1})
    .then((linuxque)=>{
        return res.json(linuxque)
    })
    .catch(err=>console.log('error while finding que'+err))
})


//@type         POST
//@route        api/linuxque/upvote/:id
//des           route for upvoting the question
//access        PUBLIC

router.post('/upvote/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    profile.findOne({reguser:req.user.id})
    .then((pro)=>{
        linux.findById(req.params.id)
        .then((linuxque)=>{
            const arr = linuxque.upvote
            var i
            arr.forEach((item,index) => {
                if(item.reguser==req.user.id){
                     i = 1
                    arr.splice(index,1)
                    return
                }
            });
            if(i==1){
                linuxque.save()
                .then((question)=>{
                    res.json({message:'successfully downvoted'})
                })
                .catch(err => console.log(err))
            }else{
                const newupvote = {reguser:req.user.id}
                linuxque.upvote.push(newupvote)
                linuxque.save()
                .then((question)=>{
                    res.json(question)
                })
                .catch(err=>console.log(err))
            }
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
})

//@type         POST
//@route        api/linuxque/loveans/:ans_id/:que_id
//des           route for upvoting the comment
//access        PRIVATE

router.post('/loveans/:ans_id/:que_id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    profile.findOne({reguser:req.user.id})
    .then((pro)=>{
        linux.findById(req.params.que_id)
        .then(que=>{
            const arr1 = que.comment
            arr1.forEach((item1,i1)=>{
                if(item1.id==req.params.ans_id){
                    const index =  item1.loveans.findIndex((todo,i)=>{
                         return todo.reguser.toString() === req.user.id.toString()
                    })
                    if(index==-1){
                        item1.loveans.push({reguser:req.user.id})
                        que.save()
                        .then((question)=>res.json(question))
                        .catch(err=>console.log('error while pushing'+err))          
                        return
                    }else{
                        item1.loveans.splice(index,1)
                        que.save()
                        .then((question)=>res.json(question))
                        .catch(err=>console.log('error while slice'+err))
                        return
                    }
                }
            })
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
})


module.exports = router