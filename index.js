const express = require('express')
const db = require('./api/db')
const cors = require('cors');
const morgan = require('morgan');
const courses = require('./api/routes/courses');
const users = require('./api/routes/users')


const port = process.env.PORT || 8000;

// Create express instnace
const app = express()

// Init body-parser options (inbuilt with express)
app.use(cors());
app.use(morgan('combined')); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Use API Routes
app.use(users)
app.use(courses)


// Requests processing will be defined in the file router
app.listen(port, () => console.log('Server app listening on port ' + port));
