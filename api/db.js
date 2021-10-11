const mysql = require('mysql2');

const con = mysql.createConnection({
    host: "host",
    port: "port",
    user: "root",
    password: "amuedtmdp",
    database : "amu_edt"
    });

    con.connect(function (err) {
        if (err) {
          console.error("error connecting: " + err.stack);
          return;
        }
      
        console.log("MySQL connected as id " + con.threadId);
      });
      
      module.exports = con;
   
