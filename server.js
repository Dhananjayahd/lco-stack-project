const express = require('express')
const mongoose= require('mongoose')
const bodyparser = require('body-parser')
const passport = require('passport')
const ejs = require('ejs')
const path = require('path')
// mongoose.connect('mongodb://127.0.0.1/lcostack1',{ useNewUrlParser: true })
// .then(()=>console.log('connection done'))
// .catch(err=>console.log(err))

//bring all routes
const auth= require('./routes/api/auth')
const profile = require('./routes/api/profile')
const question = require('./routes/api/question')
const linuxque = require('./routes/api/linuxque')

const app = express()
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

app.use(express.static(__dirname+'/public'))
app.set('views',path.join(__dirname,'/views'))
app.set('view engine','ejs')

//monodb configuration
const db = require('./setup/myurl').mongourl

//passport middlware
app.use(passport.initialize())
//configure for jwt
require('./strategies/jwtstrategies')(passport)

// attempt to connect to database
mongoose
.connect(db)
.then(()=>{
    console.log('connection done')
})
.catch(err => console.log(err))


const port = process.env.port || 3000

//route for testing
app.get('/',(req,res)=>{
    res.send('hey there big stack')
})

// actual route
app.use('/api/auth',auth)
app.use('/api/profile',profile)
app.use('/api/question',question)
app.use('/api/linuxque',linuxque)



app.listen(port,()=>{
    console.log('port is running at 3000')
})

