const mysql = require('mysql');
require('dotenv').config();

// Connection base de données avec info contenu dans fichier .env
const sql = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

sql.connect(function (err) {

    // si erreur
    if (err) {
        return console.error('error: ' + err.message);
    }

    // si connection ok
    console.log('Connected success !');
});

module.exports = sql;