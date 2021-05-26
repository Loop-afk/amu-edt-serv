const con = require("../db");
const config = require('../config')
const validator = require('express-validator')

module.exports.list = function (req, res, next) {
        let from = req.query.from;
        let to = req.query.to;

        if (from == undefined) { from = "2020-01-01"; }
        if (to == undefined) { to = "2022-12-31"; }
        console.log(from, to);
        con.connect(function (err) {
                if (err) { throw err; }
                con.query(` SELECT courseId,
                                EXTRACT(YEAR FROM courseDate) AS year, EXTRACT(MONTH FROM courseDate) AS month, EXTRACT(DAY FROM courseDate) as day,
                                C.gradeId, G.gradeName, 
                                EXTRACT(HOUR FROM courseStart) as hourStart, EXTRACT(MINUTE FROM courseStart) as minuteStart,
                                EXTRACT(HOUR FROM courseEnd) as hourEnd, EXTRACT(MINUTE FROM courseEnd) as minuteEnd,
                                C.subjectId, S.subjectName,
                                C.teacherId, U.userFirstName as teacherFirstName, U.userLastName as teacherLastName,
                                C.roomId, R.roomName, Ca.campusId, Ca.campusName
                                FROM Course C INNER JOIN Grade G on C.gradeId = G.gradeId INNER JOIN Subject S on C.subjectId = S.subjectId
                                INNER JOIN User U on C.teacherId = U.userId INNER JOIN Room R on C.roomId = R.roomId INNER JOIN Campus Ca on R.campusId = Ca.campusId
                                WHERE courseDate <= '${to}' AND courseDate >=  '${from}'`, function (err, result) {
                        if (err) { throw err; }
                        //console.log(result);
                        let data = [];
                        result.forEach(element => data.push(
                                {
                                        "date": {
                                                "day": element.day,
                                                "month": element.month,
                                                "year": element.year
                                        },
                                        "groups":
                                        {
                                                "id": element.gradeId,
                                                "value": element.gradeName
                                        }
                                        ,
                                        "start": {
                                                "hours": element.hourStart,
                                                "minutes": element.minuteStart
                                        },
                                        "end": {
                                                "hours": element.hourEnd,
                                                "minutes": element.minuteEnd
                                        },
                                        "ue": {
                                                "field": {
                                                        "id": element.subjectId,
                                                        "value": element.subjectName
                                                }
                                        },
                                        "teacher": {
                                                "id": element.teacherId,
                                                "value": element.teacherFirstName + " " + element.teacherLastName
                                        },
                                        "place": {
                                                "room": {
                                                        "id": element.roomId,
                                                        "value": element.roomName
                                                },
                                                "campus": {
                                                        "id": element.campusId,
                                                        "value": element.campusName
                                                }
                                        },
                                        "id": element.courseId
                                }
                        ));
                        res.json(data);
                });
        });

}

module.exports.newCourse = function (req, res, next) {
        var errors = 0;
        var verifs = 0;
        let subjectId = req.query.ueName;
        let courseDate = req.query.date;
        let courseStart = req.query.start;
        let courseEnd = req.query.end;
        let gradeId = req.query.groups;
        let teacherId = req.query.teacher;
        let roomId = req.query.room;
        let occurences = req.query.occurences;
        let duration = req.query.duration;
    
        if (subjectId == undefined){errors += 1;
            return res.status(400).json({message: "Please enter a subject ID"});}
        if (courseDate == undefined){errors += 1;
            return res.status(400).json({message: "Please enter a date"});}
        if (courseStart == undefined){errors += 1;
            return res.status(400).json({message: "Please enter a start hour"});}
        if (courseEnd == undefined){errors += 1;
            return res.status(400).json({message: "Please enter an end hour"});}
        if (gradeId == undefined){errors += 1;
            return res.status(400).json({message: "Please enter a grade ID"});}
        if (teacherId == undefined){errors += 1;
            return res.status(400).json({message: "Please enter a teacher ID"});}
        if (roomId == undefined){errors += 1;
            return res.status(400).json({message: "Please enter a room ID"});}
        
    
        if (occurences == undefined  || occurences == null) { occurences = 1; }
        else{occurences = parseInt(occurences);}
    
        if (duration == undefined) { duration = 1; }
        else {duration = parseInt(duration);}
    
        dateCourseDate = new Date(courseDate);
        
    
        con.connect(function(err) {
            if (err) {throw err;}
    
            if(dateCourseDate < Date.now()){
                errors += 1;
                verifs += 1;
                return res.status(400).json({message: "Date can't be in the past"});
            }
            else verifs += 1;
    
            
            if(Date.parse(`01/01/2011 ${courseStart} `) > Date.parse(`01/01/2011 ${courseEnd}`)){
                errors += 1;
                verifs += 1;
                return res.status(400).json({message: "Course can't end before the start"});
            }
            else verifs += 1;
        
           
    
            splitStart = courseStart.split(":");
            splitEnd = courseEnd.split(":");
    
            if(parseInt(splitStart[0]) < 0 || parseInt(splitStart[0]) >= 24 ||
               parseInt(splitEnd[0]) < 0 || parseInt(splitEnd[0]) >= 24 ||
               parseInt(splitStart[1]) < 0 || parseInt(splitStart[1]) >= 60 ||
               parseInt(splitEnd[1]) < 0 || parseInt(splitEnd[1]) >= 60 ){
                errors += 1;
                verifs += 1;
                return res.status(400).json({message: "Course hours must be between 00:00 and 23:59"});
            }
            else verifs += 1;
    
           
    
            
            
            con.query(`SELECT * from Grade where gradeId = '${gradeId}' `, verifs += 1 ,function(err, result){
                if (err) {throw err;}
                
                if(result == 0){
                    errors += 1;
                    console.log(errors + "aaaaaaa");
                    return res.status(400).send({message: "Group doesn't exist"});
                    
                }
           
    
                con.query(`SELECT * from Subject where subjectId = '${subjectId}' `, verifs += 1, function(error, result1){
                    if (err) {throw err;}
                    
                    if(result1 == 0){
                        errors += 1;
                        console.log(errors + "bbbbbbb");
                        return res.status(400).send({message: "UE doesn't exist"});
                }
            
    
                    con.query(`SELECT * from User where userId = '${teacherId}' `, verifs += 1, function(error, result2){
                        if (err) {throw err;}
                        
                        if(result2 == 0){
                        errors += 1;
                        console.log(errors + "ccccccc");
                        return res.status(400).json({message: "Professor doesn't exist"});
                    }
            
    
                        con.query(`SELECT * from Room where roomId = '${roomId}' `, verifs += 1,  function(error, result3){
                            if (err) {throw err;}
                            if(result3 == 0){
                                errors += 1;
                                console.log(errors + "ddddddd");
                                return res.status(400).json({message: "Room doesn't exist"});
                            }
    
            if (verifs == 7){
            if (errors == 0){
                for(i = 0; i < duration; i += occurences) {
                    finalDate = new Date(courseDate)
                    finalDate.setDate(finalDate.getDate() + i);
                if ( ((finalDate.getDay() == 0) ||finalDate.getDay() == 6)) { continue;}
                else {console.log("REQUETE EFFECTUEE");
                    con.query(
                        `INSERT INTO Course (courseDate, gradeId, courseStart, courseEnd, subjectId, teacherId, roomId)
                        VALUES ('${finalDate.getFullYear()}' '-' '${(finalDate.getMonth() + 1)}' '-' '${finalDate.getDate()}',    
                                '${gradeId}',
                                '${courseStart}',
                                '${courseEnd}',
                                '${subjectId}',
                                '${teacherId}',
                                '${roomId}')`, function (err, result) {
                    if (err) {throw err;}                 
                    });
                
                 }
            }
            res.json("Course added succesfully");
            }
        }
    });
    });
    });
    });
});
}

module.exports.deleteCourse = function (req, res, next) {

        let courseId = req.query.courseId;

    if (courseId == undefined){ 
        return res.status(400).json( {message: "Please enter a course ID"} );
    }

    con.connect(function(err) {
        if (err) {throw err;}

    con.query(`SELECT * from Course where courseId = '${courseId}' `, function(err, result){
        if (err) {throw err;}
        if(result == 0){
            return res.status(400).send({message: "Course doesn't exist"});
            
        }
        else {
            con.query(
                `DELETE FROM Course WHERE courseId = '${courseId}';`, function (err, result) { if (err) {throw err;} 
                res.json("Course deleted succesfully");
            })
        }
    })    
    });
}