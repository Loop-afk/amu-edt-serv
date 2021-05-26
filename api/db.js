const mysql = require('mysql2');

const con = mysql.createConnection({
    host: "77.145.66.7",
    port: "18931",
    user: "root",
    password: "amuedtmdp",
    database : "amu_edt"
    });

    // login test ---  YY.kevin@etu.univ-amu.fr mdp Kevin

    con.connect(function (err) {
        if (err) {
          console.error("error connecting: " + err.stack);
          return;
        }
      
        console.log("MySQL connected as id " + con.threadId);
      });
      
      module.exports = con;
   
