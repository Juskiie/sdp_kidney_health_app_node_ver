// Express setup
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000; // choose any port number you like

app.use(express.static(__dirname));

const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'SDPKodeGreen123',
    database: 'maindb'
});

// Link to html -- load main page
app.get('/', (req, res) => {
    res.sendFile('index.html');
});

// SQL QUERIES
app.use(express.json());

// Update the users table
const updateUsersTable = `
    UPDATE users
    SET email = ?, password = ?
    WHERE id = ?;
`
const valuesForUsers = ['email@host.com','example_pwrd',1];

const updateResultsData = `
UPDATE patients 
SET test_results = ? 
WHERE id = ?
`

const getResultsData = `
    SELECT test_results
    FROM patients 
    WHERE id = ?
`

// Handle request to update results data
// Handle POST requests to receive test results
app.post('/update', (req, res) => {
    // Retrieve the data from the backend
    // let data=req.body;
    let id=req.body.ID;
    let testResults = req.body.data;
    const testResultsJson = JSON.stringify(testResults);

    pool.query(updateResultsData, [testResultsJson,id], (error, updateResults, fields) => {
        if (error){
            console.error(error);
            res.sendStatus(500);
        }

        pool.query(getResultsData, [id], (error, getResults, fields) =>{
            if (error) {
                console.error(error);
                res.sendStatus(500);
            }
            const testResultsFromDb = JSON.parse(getResults[0].test_results);
            const result = Object.entries(testResultsFromDb).map(([date, value]) => ({ date, value }));
            res.json(result);
        });
    });
});

//  const resultEntries =  Object.entries(results);
//  const result = resultEntries.map(([key, value]) => ({key, value}));

pool.query(updateUsersTable, valuesForUsers, (error, results) => {
    if (error) throw error;
    console.log(`Updated ${results.affectedRows} row(s)`);
})

pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log('Connected to MySQL server!');
    connection.release();
});

// Start listening on port...
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});