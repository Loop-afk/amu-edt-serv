const con = require("../db");
const config = require('../config')
const validator = require('express-validator')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')



// Login
module.exports.login = [
  // validation rules
  validator.body('email', 'Please enter Email').isLength({ min: 1 }),
  validator.body('password', 'Please enter Password').isLength({ min: 1 }),

  function(req, res) {
    // throw validation errors
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    // validate email and password are correct
    con.query('SELECT * FROM User WHERE userEmail=?', [req.body.email], function(err, results, fields) {
      if(err) {
        return res.status(500).json({
            message: 'Error logging in',
            err: err
        });
      }

      // Perform Update if record found
      if(results.length>0){
        const user = results[0];

        // compare submitted password with password inside db
        if(req.body.password === user.userPassword) {
            return res.json({
              user: {
                id: user.userId,
                email: user.userEmail,
                role: user.Role,
              },
              token: jwt.sign({id: user.userId, email: user.userEmail,role: user.Role}, config.authSecret) // generate JWT token here
            });
          }
          else{
            return res.status(500).json({
              message: 'Invalid Email or Password entered.'
            });
          }
        }
      else{
        return res.status(500).json({
          message: 'Invalid Email or Password entered.'
        });
      }
    });

  }
]

// Get User
module.exports.user = function(req, res) {
  var token = req.headers.authorization
  if (token) {
    // verifies secret and checks if the token is expired
    jwt.verify(token.replace(/^Bearer\s/, ''), config.authSecret, function(err, decoded) {
      if (err) {
        return res.status(401).json({message: 'unauthorizd'})
      } else {
        return res.json({ user: decoded })
      }
    });
  }
  else{
    return res.status(401).json({message: 'unauthorizd'})
  }
}