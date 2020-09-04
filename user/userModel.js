const mongoose = require('../models/init')
const Schema = mongoose.Schema
const uniqueValidator = require("mongoose-unique-validator")
const crypto = require('crypto')
const pbkdf2_iteration = 10000
const jwt = require('jsonwebtoken')
const secret = require("../config").secret

// Define Schema
const userSchema = new Schema({
    username:{
        type: String,
        required: [true, "can't be blank"],
        unique: true,
        match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
        index: true
    },
    email:{
        type: String,
        required: [true, "can't be blank"],
        unique: true,
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true
    },
    salt:{
        type:String
    },
    hash:{
        type:String
    }
})

// add UniqueValidator plugin to schema
userSchema.plugin(uniqueValidator, {message: "is already taken."})

userSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(128).toString('base64')
    this.hash = crypto.pbkdf2Sync(password, this.salt, pbkdf2_iteration, 512, 'sha512').toString("base64")
}

userSchema.methods.validPassword = function(password){
    var hash = crypto.pbkdf2Sync(password, this.salt, pbkdf2_iteration, 512, 'sha512').toString("base64")
    return this.hash === hash;
}

userSchema.methods.generateJWT = function(){
    var today = new Date()
    var exp = new Date(today)
    exp.setDate(today.getDate() + 60)

    // sign new JWT with 60 days expiration.
    // default algorithm is 'HMAC SHA256'
    return jwt.sign({
        id: this._id,
        username: this.username,
        email: this.email,
        exp: parseInt(exp.getTime() / 1000),
    }, secret)
}

userSchema.methods.toAuthJSON = function(){
    return {
        username: this.username,
        email: this.email,
        token: this.generateJWT(),
    }
}

const User = mongoose.model('User', userSchema)
module.exports = User