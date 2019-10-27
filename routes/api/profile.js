const express=require('express')
const router= express.Router()
const mongoose= require('mongoose')
const passport = require('passport')

//load person model
const Person=require('../../models/Personmodel')
//load profile model
const profile =require('../../models/profilemodel')

//@type         GET
//@route        api/profile/
//@des          a route to personal uer profile
//@access       PRIVATE

router.get('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    //it should be users
    profile.findOne({reguser:req.user.id})
    .then((profile)=>{
        if(!profile){
            return res.status(404).json({profile:'no profile find'})
        }
        res.json(profile)
    })
    .catch(err=>console.log('got error in profile'+err))
})

//@type         POST
//@route        api/profile/
//@des          a route updating and saving
//@access       PRIVATE

router.post('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const profilevalues={}
    profilevalues.reguser= req.user.id
    if(req.body.username) profilevalues.username = req.body.username
    if(req.body.website) profilevalues.website = req.body.website
    if(req.body.country) profilevalues.country = req.body.country
    if(req.body.portfolio) profilevalues.portfolio = req.body.portfolio
    if(req.body.languages !== undefined){
        profilevalues.languages = req.body.languages.split(",")
    }
    profilevalues.social={}
    if(req.body.youtube) profilevalues.social.youtube = req.body.youtube
    if(req.body.facebook) profilevalues.social.facebook = req.body.facebook
    if(req.body.instagram) profilevalues.social.instagram = req.body.instagram

    //do database stuff
    profile.findOne({reguser:req.user.id})
    .then(result=>{
        if(result){
            profile.findOneAndUpdate({reguser:req.user.i},profilevalues)
            .then(result=>{
                res.json(result)
            })
            .catch(err=>console.log('problem in update'+err))
        }else{
            profile.findOne({username:req.body.username})
            .then(result =>{
                //username already exists
                if(result){ 
                res.json({username:'username already found'})
                }
                else{
                    //save user 
                    new profile(profilevalues).save()
                    .then((result)=>{
                        res.json(result)
                    })
                    .catch(err=>console.log('error saving users profile'+err))
                }
            })
            .catch(err=>console.log('error finding username'+err))
        }
    })
    .catch(err=>console.log('problem in fetching profile'+err))
})

//@type         GET
//@route        api/profile/:username
//@des          a route for getting the profile by username
//@access       PUBLIC

router.get("/:username",(req,res)=>{
    profile.findOne({username:req.params.username})
    .populate('reguser',['name','email'])
    .then((profind)=>{
        if(!profind){
            res.status(404).json({error:"no such profile founded"})
        }
        res.json(profind)
    })
    .catch(err=> console.log("error when fetching the profile by username" + err))
})

//@type         GET
//@route        api/profile/find/everyone dont use api/pofile/evryone becuase it will take everyone as
//              username that was defined in the previous route,and it may cause error
//@des          a route for getting the profiles of all reg users
//@access       PUBLIC

router.get("/find/everyone",(req,res)=>{
    profile.find()
    .populate('reguser',['name','email'])
    .then((profiles)=>{
        if(!profiles){
            res.status(404).json({error:"no users are reg till now"})
        }
        res.json(profiles)
    })
    .catch(err=> console.log("error when fetching the all profiles" + err))
})

//@type         GET
//@route        api/profile/deleteuser
//@des          a route for deleting the user
//@access       PRIVATE

router.delete('/deleteuser',passport.authenticate('jwt',{session:false}),(req,res)=>{
    profile.findOneAndDelete({reguser:req.user.id})
    .then(()=>{
        Person.findOneAndDelete({_id:req.user.id})
        .then(()=>{
            res.json({message:'deleted user successfully'})
        })
        .catch(err=>console.log('error while deleting person'+err))
    })
    .catch(err=> console.log('error while deleting profile'+err))
})

//@type         POST
//@route        api/profile/workrole
//@des          a route for adding the workrole to profile
//@access       PRIVATE

router.post('/workrole',passport.authenticate('jwt',{session:false}),(req,res)=>{
    profile.findOne({reguser:req.user.id})
    .then((profilefind)=>{
        if(!profilefind){
            res.status(404).json({error:"no such profile founded during workrole route"})
        }
        const newwork={
            role:req.body.role,
            country:req.body.country,
            company:req.body.company,
            from:req.body.from,
            to:req.body.to,
            current:req.body.current,
            details:req.body.details
        }
        profilefind.workrole.push(newwork)
        //use profilefind not profile since the object here is the profilefind
        profilefind.save()
        .then((profile)=>{
            res.json(profile)
        })
        .catch(err=>console.log('error while saving the workrole'+err))
    })
    .catch(err=>console.log("failed to fetch the profile during workrole"+err))
})

//@type         DELETE
//@route        api/profile/workrole/:w_id
//@des          a route for deleting the workrole of a user
//@access       PRIVATE

router.delete('/workrole/:w_id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    profile.findOne({reguser:req.user.id})
    .then((Profile)=>{
        if(!Profile){
            res.status(404).json({error:'profile not found'})
        }
        const arr = Profile.workrole
        arr.forEach((item,i)=>{
            if(item.id==req.params.w_id){
                arr.splice(i,1)
                return 
            }
        })
        //    for(let i=0;i<arr.length;i++)
        //    {
        //         if(arr[i].id==req.params.w_id){
        //             arr.splice(i,1)
        //             return
        //         }
        //    }
        // const index = Profile.workrole.map(item=>item.id).indexOf(req.params.w_id)
        // Profile.workrole.splice(index,1)
        Profile.save()
        .then((Profile)=>{
            res.json(Profile)
        })
        .catch(err=>console.log('err while saving profile at workrole '+err))
    })
    .catch(err=>console.log('error during fetching profile during workrole/:w_id'+err))
})



module.exports=router