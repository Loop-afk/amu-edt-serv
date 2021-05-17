const express = require("express");
const router = express.Router();
const mysql = require('mysql');

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
   .use((req, res) => {
           res.status(404);
           res.json({
               error: "Page not found"
           });
       });

router
    .get("/persons",(req,res)=>{
        res.json(persons);
    })

router
    .get("/persons/:id",(req,res)=>{
        res.json(getPerson(req.params.id));
    })

router
.post('/person',
        (req, res) => {
            const p = insertPerson(req.body);
            res.status(201)
                .set('Location', '/persons/' + p.id)
                .json(p);
        })

router
.delete('/person/:id',
        (req, res) => {
            removePerson(req.params.id);
            res
                .status(204)
                .end();
        })

router
.patch('/person/:id',
        (req, res) => {
            updatePerson(req.body);
            res
                .status(200)
                .json(req.body);
        })

