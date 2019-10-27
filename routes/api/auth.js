const express = require('express')
const router = express.Router()
const bcrypt= require('bcryptjs')
const passport= require('passport')
const jwt=require('jsonwebtoken')
const key=require('../../setup/myurl')

//import schema for registration
const Person=require('../../models/Personmodel')

//@type         get
//@route        /api/auth
//@des          route for testing
//@access        public
router.get('/',(req , res)=>{
    res.json({test:'auth is sucess'})
})

//@type         post
//@route        api/auth/registratons
//des           for registration
//access         public
router.post('/registrations',(req,res)=>{
 Person.findOne({email:req.body.email})
 .then(personisthere=>{
     if(personisthere){
         res.status(400).json({emailerror:'this email as been already registerd'})
     }
     else{
         const newuser=new Person({
             name:req.body.name,
             email:req.body.email,
             password:req.body.password,
             gender:req.body.gender
            })
            bcrypt.genSalt(10, (err, salt)=> {
                bcrypt.hash(newuser.password, salt, (err, hash)=> {
                    if(err) throw err
                    newuser.password=hash
                    newuser.save()
                    .then(Person=>res.json(Person))
                    .catch(err => console.log(err))
                });
            });
     }
 })
 .catch(err =>console.log(err))
})

//@type         POST
//@route        api/auth/login
//@des          a route to login the user
//@access       PUBLIC

router.post('/login',(req,res)=>{
    const email = req.body.email;
    const password= req.body.password;
    Person.findOne({email})
    .then(userfind =>{
        if(!userfind){
            res.status(400).json({emailerror:'user has not registered'})
        }
        bcrypt.compare(password,userfind.password)
        .then(compared =>{
            if(compared){
                //res.json({success:'user logined in successfully'})
                
                const payload={
                    id:userfind.id,
                    name: userfind.name,
                    email:userfind.email
                }
                jwt.sign(payload,
                    key.secret,
                    {expiresIn:3600},
                    (err,token)=>{
                        if(err) throw err

                        res.json({
                            success: true,
                            token:"Bearer "+token
                        })
                    })
            }else{
                res.json({passworderror:'password is incorrect'})
            }
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
})

//@type         GET
//@route        api/auth/profile
//@des          a route for user profile
//@access       PRIVATE

router.get('/profile',passport.authenticate('jwt',{session:false}),(req,res)=>{
    res.json({
        id:req.user.id,
        name:req.user.email,
        date:req.user.date,
        gender:req.user.gender
    })
})

module.exports=router