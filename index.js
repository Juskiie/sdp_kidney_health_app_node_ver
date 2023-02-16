// Express setup
const express = require('express');
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

    // Convert to JSON string
    let testResultsJSON = JSON.stringify(testResults);

    pool.query(updateResultsData, [testResultsJSON,id], (error, results, fields) => {
        if (error) throw error;
        console.log(results);
        console.log(fields);

        pool.query(getResultsData, [id], (error, results, fields) =>{
            if (error) throw error;
            console.log(results);
            console.log(results[0]);
            console.log(results[0].test_results);
            console.log(JSON.parse(results[0].test_results));
            console.log(fields);

            let testResults = {};



            //let testResults = {"2023-01-01":80};
            /*if (results[0].test_results) {
                let testResultsArray = JSON.parse(results[0].test_results);
                testResultsArray.forEach(function (value, index) {
                    console.log(`${index}: ${value}`);
                });
            }*/
            // Send the updated test result data as a JSON response
            res.join(testResults);
        });
    });
});



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