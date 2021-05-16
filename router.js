const express = require("express");
const data = require('./db/data');
const router = express.Router();

module.exports = router;




router
    .get("/", (req, res) => {
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
   


router
    .get("/pers",(req,res)=>{
        res.json(data.getPerson(1));
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

router
    .use((req, res) => {
            res.status(404);
            res.json({
                error: "Page not found"
            });
        });

