const express = require("express");
const router = express.Router();
const mysql = require('mysql2');

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
        con.query("SELECT * FROM User where userFirstName = 'Mickael'", function (err, result) {
            if (err) {throw err;}
            console.log(result);
            res.json(result);
            });
        });
   });


   
