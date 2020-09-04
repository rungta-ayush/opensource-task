const router = require('express').Router()
const auth = require('./auth')
const passport = require('passport')
const User = require('./userModel')

/* 
    index page, can access with/without jwt 
    but if there are jwt, you will get req.payload (user data)
*/
router.get('/', auth.optional, (req, res, next) => {
    if(req.payload){
        res.json({
            message: "Get to the page with JWT",
            credentials: req.payload
        })
    }else{
        res.json({
            message:'Get to the page without JWT',
            credentials: req.payload
        })
    }
    
})

/* 
    must have jwt in header !!,
    user data kept in req.payload
*/
router.get('/profile', auth.required, (req, res, next) => {
    res.send(req.payload)
});

router.post('/register', (req, res, next) => {
    var user = new User({
        username: req.body.username,
        email: req.body.email,
    })
    // call setPassword method to generate hash and salt
    user.setPassword(req.body.password)
    user.save(function (err, result) {
        if (err) return next(err)
        res.send("Successfully, created user: " + result.username)
    })
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', { session: "false" }, (err, user) => {
        if (err) return next(err)
        if (!user) {
            // if user == false
            res.send("no user or password")
        }
        if (user) {
            // user is from 'config/passport.js', user is mongoose model
            res.send(user.toAuthJSON())
        }
    })(req, res, next)
})

module.exports = router