const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require("../user/userModel")

// Local Strategy --> Login
// passport will look for email and password in req.body{}
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, function (email, password, done) {
    User.findOne({email:email}).then(function(user){
        if(!user || !user.validPassword(password)){
            return done(null, false)
        }
        return done(null, user)
    }).catch(done)
}))