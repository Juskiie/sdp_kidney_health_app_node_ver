// Express setup
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000; // choose any port number you like

app.use(express.static(__dirname));

const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'maindb.cvqsrhluyyah.eu-west-2.rds.amazonaws.com',
    user: 'root',
    password: 'SDPKodeGreen123',
    database: 'maindb',
    port: 3306
});

// Link to html -- load main page
app.get('/', (req, res) => {
    res.sendFile('index.html');
});

// SQL QUERIES
app.use(express.json());

const createUsersTable = `
CREATE TABLE \`users\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`name\` varchar(255) NOT NULL,
  \`email\` varchar(255) NOT NULL,
  \`password\` varchar(255) NOT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`

// Update the users table
const updateUsersTable = `
    UPDATE users
    SET email = ?, password = ?
    WHERE id = ?;
`

const createPatientsTable = `
CREATE TABLE \`patients\` (
  \`ID\` int NOT NULL AUTO_INCREMENT COMMENT 'A unique ID for each patient in the database',
  \`name\` varchar(255) DEFAULT NULL COMMENT 'The full name for the patient',
  \`age\` int DEFAULT NULL COMMENT 'Stores the value for the patients age, updates based on their DOB.',
  \`dob\` date NOT NULL COMMENT 'Stores the date of birth for the patient',
  \`test_results\` json DEFAULT NULL,
  PRIMARY KEY (\`ID\`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='This table stores patient information';
`
pool.query(createPatientsTable);

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