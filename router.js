const { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } = require("constants");
const { listenerCount } = require("events");
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
///schedule/?from=2021-04-10&to=2021-04-20

/*router
    .get("/", (req, res) => {
        let userFirstName = req.query.userFirstName
        con.connect(function(err) {
        if (err) {throw err;}
        //console.log("Connecté à la base de données MySQL!");
        con.query(`SELECT * FROM User where userFirstName = '${userFirstName}'`, function (err, result) {
            if (err) {throw err;}
            //console.log(result);
            res.json(result);
            });
        });
   });*/

//    /?from=2021-04-10&to=2021-04-20

router
   .get("/", (req, res) => {
       res.json("Connecté au serveur de AMU\'EDT");
   });

router
    .get("/affichage/", (req, res) => {
        let from = req.query.from
        let to = req.query.to
        
        if (from == undefined) { from = "2020-01-01" }
        if (to == undefined) { to = "2022-12-31" }
        console.log(from, to)
        con.connect(function(err) {
        if (err) {throw err;}   
        //console.log("Connecté à la base de données MySQL!");
        con.query(`SELECT EXTRACT(YEAR FROM courseDate) AS year, EXTRACT(MONTH FROM courseDate) AS month, EXTRACT(DAY FROM courseDate) as day,
                    C.gradeId, G.gradeName, 
                    EXTRACT(HOUR FROM courseStart) as hourStart, EXTRACT(MINUTE FROM courseStart) as minuteStart,
                    EXTRACT(HOUR FROM courseEnd) as hourEnd, EXTRACT(MINUTE FROM courseEnd) as minuteEnd,
                    C.subjectId, S.subjectName,
                    C.teacherId, U.userFirstName as teacherFirstName, U.userLastName as teacherLastName,
                    C.roomId, R.roomName, Ca.campusId, Ca.campusName
                    FROM Course C INNER JOIN Grade G on C.gradeId = G.gradeId INNER JOIN Subject S on C.subjectId = S.subjectId
                    INNER JOIN User U on C.teacherId = U.userId INNER JOIN Room R on C.roomId = R.roomId INNER JOIN Campus Ca on R.campusId = Ca.campusId
                    WHERE courseDate <= '${to}' AND courseDate >=  '${from}'`, function (err, result) {
            if (err) {throw err;} 
            //console.log(result);
            let data = []
            result.forEach(element => data.push(
                        {
                          "date": {
                            "day": element.day,
                            "month":  element.month,
                            "year":  element.year
                          },
                          "groups": 
                            {
                              "id":  element.gradeId,
                              "value":  element.gradeName
                            }
                          ,
                          "start": {
                            "hours":  element.hourStart,
                            "minutes":  element.minuteStart
                          },
                          "end": {
                            "hours":  element.hourEnd,
                            "minutes": element.minuteEnd
                          },
                          "ue": {
                            "field": {
                              "id":  element.subjectId,
                              "value":  element.subjectName
                            }
                          },
                          "teacher": {
                            "id":  element.teacherId,
                            "value":  element.teacherFirstName +' ' + element.teacherLastName
                          },
                          "place": {
                            "room": {
                              "id":  element.roomId,
                              "value":  element.roomName
                            },
                            "campus": {
                              "id":  element.campusId,
                              "value":  element.campusName
                            }
                          }
                        }
                        ));
                res.json(data);
        });
        });
        
   });

   //http://localhost:8000/nouveau/cours/?ueName=1&date=2021-05-24&start=07:45&occurences=7&duration=14&groups=1&teacher=1&room=1&campus=1
   //http://localhost:8000/nouveau/cours/?ueName=2&date=2021-05-25&start=07:45&end=10:00&groups=1&teacher=1&room=1&campus=1

   router
   .get("/nouveau/cours/", (req, res) => {
    
    let errors = 0;
    let subjectId = req.query.ueName
    let courseDate = req.query.date
    let courseStart = req.query.start
    let courseEnd = req.query.end
    let gradeId = req.query.groups
    let teacherId = req.query.teacher
    let roomId = req.query.room
    let occurences = req.query.occurences
    let duration = req.query.duration

    if (subjectId == undefined){errors += 1;
        return res.status(400).json({message: "Please enter a subject ID"})}
    if (courseDate == undefined){errors += 1;
        return res.status(400).json({message: "Please enter a date"})}
    if (courseStart == undefined){errors += 1;
        return res.status(400).json({message: "Please enter a start hour"})}
    if (courseEnd == undefined){errors += 1;
        return res.status(400).json({message: "Please enter an end hour"})}
    if (gradeId == undefined){errors += 1;
        return res.status(400).json({message: "Please enter a grade ID"})}
    if (teacherId == undefined){errors += 1;
        return res.status(400).json({message: "Please enter a teacher ID"})}
    if (roomId == undefined){errors += 1;
        return res.status(400).json({message: "Please enter a room ID"})}
    

    if (occurences == undefined) { occurences = 1 }
    else{occurences = parseInt(occurences)}

    if (duration == undefined) { duration = 1 }
    else {duration = parseInt(duration)}

    dateCourseDate = new Date(courseDate)
    

    con.connect(function(err) {
        if (err) {throw err;}

        if(dateCourseDate < Date.now()){
            errors += 1;
            return res.status(400).json({message: "Date can't be in the past"})
        }
        
        con.query(`SELECT * from Grade where gradeId = '${gradeId}' `, function(error, result){
            if (err) {throw err;}
            if(result == 0){
                errors += 1;
                return res.status(400).json({message: "Group doesn't exist"})
            }
        })

        if(Date.parse(`01/01/2011 ${courseStart} `) > Date.parse(`01/01/2011 ${courseEnd}`)){
            errors += 1;
            return res.status(400).json({message: "Course can't end before the start"})
        }
    
        splitStart = courseStart.split(":")
        splitEnd = courseEnd.split(":")

        if(parseInt(splitStart[0]) < 0 || parseInt(splitStart[0]) >= 24 ||
           parseInt(splitEnd[0]) < 0 || parseInt(splitEnd[0]) >= 24 ||
           parseInt(splitStart[1]) < 0 || parseInt(splitStart[1]) >= 60 ||
           parseInt(splitEnd[1]) < 0 || parseInt(splitEnd[1]) >= 60 ){
            errors += 1;
            return res.status(400).json({message: "Course hours must be between 00:00 and 23:59"})
        }

        con.query(`SELECT * from Subject where subjectId = '${subjectId}' `, function(error, result){
            if (err) {throw err;}
            if(result == 0){
                errors += 1;
                return res.status(400).json({message: "UE doesn't exist"})
            }
        })


        con.query(`SELECT * from User where userId = '${teacherId}' `, function(error, result){
            if (err) {throw err;}
            if(result == 0){
                errors += 1
                return res.status(400).json({message: "Professor doesn't exist"})
            }
        })

        con.query(`SELECT * from Room where roomId = '${roomId}' `, function(error, result){
            if (err) {throw err;}
            if(result == 0){
                errors += 1
                return res.status(400).json({message: "Room doesn't exist"})
            }
        })
    

        if (errors == 0){
        for(i = 0; i < duration; i += occurences) {
            
            //if(i >= 1){break}
            
            if ( ( (dateCourseDate.getDay()+i)%6 ) != 0 || ((dateCourseDate.getDay()+i)%6 ) != 6) {  
                con.query(
                    `INSERT INTO Course (courseDate, gradeId, courseStart, courseEnd, subjectId, teacherId, roomId)
                    VALUES ('${courseDate}', 
                            '${gradeId}',
                            '${courseStart}',
                            '${courseEnd}',
                            '${subjectId}',
                            '${teacherId}',
                            '${roomId}')`, function (err, result) {
                if (err) {throw err;}                 
                })
            }
            else continue;
        }
        //res.json("Cours créé")
    }
        
    });
    });
    

   /*router
   .get("/", (req, res) => {
        let from = req.query.from
        let fromSplit = from.split('-')
        let to = req.query.to
        let toSplit = to.split('-')
        let schedule = [
                    {
                      "date": {
                        "day": 18,
                        "month": 04,
                        "year": 2021
                      },
                      "groups": [
                        {
                          "id": 2,
                          "value": "L3 info"
                        }
                      ],
                      "start": {
                        "hours": 7,
                        "minutes": 45
                      },
                      "end": {
                        "hours": 10,
                        "minutes": 0
                      },
                      "ue": {
                        "field": {
                          "id": 1,
                          "value": "Fourth Event"
                        },
                        "date": {
                          "year": 2020,
                          "semester": 0
                        }
                      },
                      "teacher": {
                        "id": 1,
                        "value": "Nobody."
                      },
                      "place": {
                        "room": {
                          "id": 1,
                          "value": "Home"
                        },
                        "campus": {
                          "id": 1,
                          "value": "Luminy"
                        }
                      }
                    },
                    {
                      "date": {
                        "day": 14,
                        "month": 05,
                        "year": 2021
                      },
                      "groups": [
                        {
                          "id": 1,
                          "value": "L3 info"
                        }
                      ],
                      "start": {
                        "hours": 6,
                        "minutes": 0
                      },
                      "end": {
                        "hours": 28,
                        "minutes": 0
                      },
                      "ue": {
                        "field": {
                          "id": 1,
                          "value": "Third Event"
                        },
                        "date": {
                          "year": 2020,
                          "semester": 0
                        }
                      },
                      "teacher": {
                        "id": 1,
                        "value": "Nobody."
                      },
                      "place": {
                        "room": {
                          "id": 1,
                          "value": "Home"
                        },
                        "campus": {
                          "id": 1,
                          "value": "Luminy"
                        }
                      }
                    }
                  ]
            var inFromTo =  schedule.filter(function(course) {
                return course.date.day >= fromSplit[2] && course.date.day <= toSplit[2] && course.date.month >= fromSplit[1] && course.date.month <= toSplit[1] && course.date.year >= fromSplit[0] && course.date.year <= toSplit[0];
                      });
        res.json(inFromTo);
   });
   
   */

router
.use((req, res) => {
        res.status(404);
        res.json({
            error: "Page not found"
        });
    });
   


   
