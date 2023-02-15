const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'SDPKodeGreen123',
    database: 'maindb'
});

const updateUsersTable = `
    UPDATE users
    SET email = ?, password = ?
    WHERE id = ?;
`
const valuesForUsers = ['email@host.com','example_pwrd',1];

pool.query(updateUsersTable, valuesForUsers, (error, results) => {
    if (error) throw error;
    console.log(`Updated ${results.affectedRows} row(s)`);
})

pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log('Connected to MySQL server!');
    connection.release();
});


const express = require('express');
const app = express();
const port = 3000; // choose any port number you like

// Start listening on port...
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Link to html -- load main page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});