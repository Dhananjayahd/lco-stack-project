const jwtstrategy = require('passport-jwt').Strategy
const extractjwt = require('passport-jwt').ExtractJwt
const mongoose = require('mongoose')
//call the person schema..........................it really causes an error........danger
const Person = mongoose.model("mypeople")
const key = require('../setup/myurl')

var opts = {}
opts.jwtFromRequest = extractjwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = key.secret

module.exports = passport =>{
    passport.use(new jwtstrategy(opts,(jwt_payload,done)=>{
        Person.findById(jwt_payload.id)
        .then(user1 =>{
            if(user1){
                return done(null,user1)
            }
            return done(null,false)
        })
        .catch(err => console.log(err))
    }))
}
