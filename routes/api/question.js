const express=require('express')
const router= express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const question = require('../../models/questionmodel')
const Person = require('../../models/Personmodel')
const profile=require('../../models/profilemodel')

//@type         GET
//@route        api/question/
//des           route for getting the questions
//access        PUBLIC

router.get('/',(req,res)=>{
    question.find()
    .sort({date:-1})
    .then((que)=>{
        if(!que){
            res.status(404).json({message:'no questions found'})
        }
        res.json(que)
    })
    .catch(err=>console.log('error while fetching the questions'+err))
})

//@type         POST
//@route        api/question/
//des           route for submitting questions
//access        PRIVATE

router.post('/',passport.authenticate('jwt',{session:false}),(req,res)=>{

    const newquestion = new question({
        reguser:req.user.id,
        text1:req.body.text1,
        text2:req.body.text2,
    })
    newquestion.save()
    .then((que)=>{
        res.json(que)
    })
    .catch(err=>console.log(err))
})

//@type         POST
//@route        api/question/answer/:id
//des           route for submitting answers
//access        PRIVATE

router.post('/answer/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    question.findById(req.params.id)
    .then((que)=>{
        const newanswer = {
            requser:req.user.id,
            text:req.body.text,
            name:req.body.name
        }
        que.answers.push(newanswer)
        que.save()
        .then((question)=>res.json(question))
        .catch(err=>console.log('error when saving answer'+err))
    })
    .catch(err=>console.log(err))
})

//@type         POST
//@route        api/question/upvote/:id
//des           route for upvoting the question not the answer
//access        PRIVATE

router.post('/upvote/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    profile.findOne({reguser:req.user.id})
    .then((pro)=>{
        question.findById(req.params.id)
        .then((que)=>{
            const arr=que.upvote
            var i
            arr.forEach((item,index) => {
                if(item.reguser==req.user.id){
                    i=1
                    arr.splice(index,1)
                    return
                }
            });
            if(i==1){
                que.save()
                .then((question)=>res.json({message:'successfully downvoted'}))
                .catch(err=>console.log('saving error'+err))
                return
            }else{
                que.upvote.push({reguser:req.user.id})
                que.save()
                .then((question)=>res.json(question))
                .catch(err=>console.log('saving error'+err))
            }
            // if(que.upvote.filter(upvote=>upvote.reguser.toString()===req.user.id.toString()).length>0){
            //     return res.json({message:'u have already upvoted'})
            // }            
        
        })
        .catch(err=>console.log('querying'+err))
    })
    .catch(err=>console.log(err))
})

//@type         DELETE
//@route        api/question/:id
//des           route for deleting the question based on id
//access        PRIVATE

router.delete('/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    question.deleteOne({_id:req.params.id})
    .then((que)=>{
        res.json({message:'question deleted'})
    })
    .catch(err=>console.log('error while deleting the question'+err))
})

//@type         DELETE
//@route        api/question/
//des           route for deleting all the questions
//access        PRIVATE

router.delete('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    profile.findOne({reguser:req.user.id})
    .then((pro)=>{
        if(!pro){
            res.json({message:'no profile founded'})
        }
        question.deleteMany({reguser:req.user.id})
        .then(()=>res.json({message:'all questions deleted'}))
        .catch(err=>console.log('error during deletin the question'+err))
    })
    .catch(err=>console.log('error during finding a profile'+err))
})


module.exports=router