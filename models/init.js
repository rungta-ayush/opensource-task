const mongoose = require("mongoose")

mongoose
    .connect('mongodb://localhost:27017/opensource-demo', {
        useNewUrlParser: true
    })
    .then(() => {
        console.log("Successfully connected to database")
    })
    .catch(err => {
        if (err) console.error("Error connecting to MongoDB database", err)
    })

module.exports = mongoose
