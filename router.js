const express = require("express");
const router = express.Router();
const mysql = require('mysql2');

const con = mysql.createConnection({
    host: "77.145.66.7",
    port: "18931",
    user: "root",
    password: "amuedtmdp",
    database : "amu_edt"
    });

module.exports = router;

/* http://192.168.1.29:8000/?userFirstName=Mickael */

router
    .get("/", (req, res) => {
        let userFirstName = req.query.userFirstName
        con.connect(function(err) {
        if (err) {throw err;}
        console.log("Connecté à la base de données MySQL!");
        con.query(`SELECT * FROM User where userFirstName = '${userFirstName}'`, function (err, result) {
            if (err) {throw err;}
            console.log(result);
            res.json(result);
            });
        });
   });


   
