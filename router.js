const express = require("express");
const router = express.Router();

module.exports = router;




router
    .get("/", (req, res) => {
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

