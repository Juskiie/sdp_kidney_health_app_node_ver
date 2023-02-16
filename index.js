// Express setup
const express = require('express');
const app = express();
const port = 3000; // choose any port number you like

app.use(express.static(__dirname));


// Handle POST requests to chart.js lib
app.post('/api/data', (req, res) => {
    // Retrieve the data from the backend
    const data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'My First Dataset',
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }
        ]
    };
    res.json(data);
});

// const scripts = require('./scripts/line-chart.js');

// scripts.updateChartFunc();

// Start listening on port...
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Link to html -- load main page
app.get('/', (req, res) => {
    res.sendFile('index.html');
});



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