const express = require("express");
const data = require('./db/data');
const router = express.Router();
const mysql = require('mysql');


const mysql = require('mysql');

const con = mysql.createConnection({
   host: "http://77.145.66.7:18932/",
   user: "root",
   password: "fqm28bdh"
 });

  con.connect(function(err) {
   if (err) throw err;
   console.log("Connecté à la base de données MySQL!");
   con.query("SELECT userFirstName from User", function (err, result) {
       if (err) throw err;
       console.log(result);
     });
 });

 module.exports = router;


router
    .get("/", (req, res) => {
        const con = mysql.createConnection({
        host: "77.145.66.7",
        port: "18931",
        user: "root",
        password: "amuedtmdp",
        database : "amu_edt"
        });

        con.connect(function(err) {
        if (err) {throw err;}
        console.log("Connecté à la base de données MySQL!");
        con.query("SELECT * FROM Users", function (err, result) {
            if (err) {throw err;}
            console.log(result);
            res.json(result)
            });
        });

       res.json("Hello world!!");
   });


router
.get("/test", (req, res) => {
    res.json([
        {
          "day": {
            "day": 20,
            "month": 5,
            "year": 2021
          },
          "groups": [
            {
              "id": 2,
              "value": "L3 info"
            }
          ],
          "start": {
            "hours": 7,
            "minutes": 45
          },
          "end": {
            "hours": 10,
            "minutes": 0
          },
          "ue": {
            "field": {
              "id": 1,
              "value": "Fourth Event"
            },
            "date": {
              "year": 2020,
              "semester": 0
            }
          },
          "teacher": {
            "id": 1,
            "value": "Nobody."
          },
          "place": {
            "room": {
              "id": 1,
              "value": "Home"
            },
            "campus": {
              "id": 1,
              "value": "Luminy"
            }
          }
        },
        {
          "day": {
            "day": 14,
            "month": 5,
            "year": 2021
          },
          "groups": [
            {
              "id": 1,
              "value": "L3 info"
            }
          ],
          "start": {
            "hours": 6,
            "minutes": 0
          },
          "end": {
            "hours": 28,
            "minutes": 0
          },
          "ue": {
            "field": {
              "id": 1,
              "value": "Third Event"
            },
            "date": {
              "year": 2020,
              "semester": 0
            }
          },
          "teacher": {
            "id": 1,
            "value": "Nobody."
          },
          "place": {
            "room": {
              "id": 1,
              "value": "Home"
            },
            "campus": {
              "id": 1,
              "value": "Luminy"
            }
          }
        }
      ]);
});