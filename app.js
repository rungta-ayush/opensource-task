const express = require("express")
const app = express()
const port = process.env.PORT || 3000
// Parser Middleware
const bodyParser = require("body-parser")
app.use(bodyParser.json())

// Import to start passport initialization
require('./config/passport')

// Routes
app.use('/user', require('./user/userRoute'))

// Error Handler
app.use((err, req, res, next) => {
   let statusCode = err.status || 500
   if (statusCode == 401) {
      // TODO: Redirect login page
      res.status(statusCode)
      res.json({
         error: {
            status: statusCode,
            message: "Unauthorized",
         }
      })
   }
   res.status(statusCode);
   res.json({
      error: {
         status: statusCode,
         message: err.message,
      }
   });
});

app.listen(port, err => {
   if (err) console.error("Error starting", error)
   else console.log('Started at http://localhost:' + port)
});