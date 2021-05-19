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
        let from = req.query.from
        let to = req.query.to
        
        //if (from = 'undefined') { from = new Date(YYYY-MM-DD)}
        //if (to = 'undefined') { to = new Date(YYYY-MM-DD)}
        console.log(from, to)
        con.connect(function(err) {
        if (err) {throw err;}   
        //console.log("Connecté à la base de données MySQL!");
        con.query(`SELECT EXTRACT(YEAR FROM courseDate) AS year, EXTRACT(MONTH FROM courseDate) AS month, EXTRACT(DAY FROM courseDate) as day,
                    C.gradeId, G.gradeName, 
                    EXTRACT(HOUR FROM courseStart) as hourStart, EXTRACT(MINUTE FROM courseStart) as minuteStart,
                    EXTRACT(HOUR FROM courseEnd) as hourEnd, EXTRACT(MINUTE FROM courseEnd) as minuteEnd,
                    C.subjectId, S.subjectName,
                    C.teacherId, U.userFirstName as teacherfirstName, U.userLastName as teacherLastName,
                    C.roomId, R.roomName, Ca.campusId, Ca.campusName
                    FROM Course C INNER JOIN Grade G on C.gradeId = G.gradeId INNER JOIN Subject S on C.subjectId = S.subjectId
                    INNER JOIN User U on C.teacherId = U.userId INNER JOIN Room R on C.roomId = R.roomId INNER JOIN Campus Ca on R.campusId = Ca.campusId
                    WHERE courseDate <= '${to}' AND courseDate >=  '${from}'`, function (err, result) {
            if (err) {throw err;}
            //console.log(result);
            let length = result.length
            res.json([
                        {
                          "date": {
                            "day": result[0].day,
                            "month": result[0].month,
                            "year": result[0].year
                          },
                          "groups": [
                            {
                              "id": result[0].groupId,
                              "value": result[0].groupName
                            }
                          ],
                          "start": {
                            "hours": result[0].hourStart,
                            "minutes": result[0].minuteStart
                          },
                          "end": {
                            "hours": result[0].hourEnd,
                            "minutes": result[0].minuteEnd
                          },
                          "ue": {
                              "id": result[0].subjectId,
                              "value": result[0].subjectName
                          },
                          "teacher": {
                            "id": result[0].teacherId,
                            "value": result[0].teacherFirstName + result[0].teacherLastName
                          },
                          "place": {
                            "room": {
                              "id": result[0].roomId,
                              "value": result[0].roomName
                            },
                            "campus": {
                              "id": result[0].campusId,
                              "value": result[0].campusName
                            }
                          }
                        },
                        {
                              "date": {
                                "day": result[1].day,
                                "month": result[1].month,
                                "year": result[1].year
                              },
                              "groups": [
                                {
                                  "id": result[1].groupId,
                                  "value": result[1].groupName
                                }
                              ],
                              "start": {
                                "hours": result[1].hourStart,
                                "minutes": result[1].minuteStart
                              },
                              "end": {
                                "hours": result[1].hourEnd,
                                "minutes": result[1].minuteEnd
                              },
                              "ue": {
                                  "id": result[1].subjectId,
                                  "value": result[1].subjectName
                              },
                              "teacher": {
                                "id": result[1].teacherId,
                                "value": result[1].teacherFirstName + result[1].teacherLastName
                              },
                              "place": {
                                "room": {
                                  "id": result[1].roomId,
                                  "value": result[1].roomName
                                },
                                "campus": {
                                  "id": result[1].campusId,
                                  "value": result[1].campusName
                                }
                              }
                            }]);
        });
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
   


   
