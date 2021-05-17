const mysql = require('mysql');

const con = mysql.createConnection({
   host: "88db7b7f7c60",
   user: "root",
   password: "amuedtmdp"
 });

  con.connect(function(err) {
   if (err) throw err;
   console.log("Connecté à la base de données MySQL!");
   con.query("SELECT eleves.id as 'eleve_id', eleves.nom as 'eleve_nom', eleves.cours_id, cours.nom as 'cours_nom', cours.date as 'cours_date' FROM eleves JOIN cours on eleves.cours_id = cours.id", function (err, result) {
       if (err) throw err;
       console.log(result);
     });
 });
