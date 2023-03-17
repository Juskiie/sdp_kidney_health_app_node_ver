// Express setup
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000; // choose any port number you like
const hostname = "18.134.161.238";
const path = require('path')
const session = require('express-session');
const bcrypt = require('bcrypt');
const mysql = require('mysql');

// Create mysql connection
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'maindb.cvqsrhluyyah.eu-west-2.rds.amazonaws.com',               // maindb.cvqsrhluyyah.eu-west-2.rds.amazonaws.com
    user: 'root',
    password: 'SDPKodeGreen123',
    database: 'maindb',
    port: 3306
});

// Serve static files from the "public" directory
app.use('/styles', express.static(path.join(__dirname, 'public', 'styles')));
app.use('/scripts', express.static(path.join(__dirname, 'public', 'scripts')));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// Setup express middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.use(
    session({
        secret: 'secretKey',
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour
    })
);

// Create login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const sql = 'SELECT * FROM users WHERE username = ?';
    pool.query(sql, [username], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            bcrypt.compare(password, results[0].password, (err, result) => {
                if (result) {
                    req.session.loggedin = true;
                    req.session.username = username;
                    res.redirect('/index.html');
                } else {
                    res.send('Incorrect username and/or password!');
                }
            });
        } else {
            res.send('Incorrect username and/or password!');
        }
    });
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Link to html -- load main page
app.get('/', (req, res) => {
    if (req.session.loggedin) {
        res.sendFile(path.join(__dirname, 'index.html'));
    } else {
        res.redirect('/login.html');
    }
});

app.get('/index.html', (req, res) => {
    if (req.session.loggedin) {
        res.sendFile(path.join(__dirname, 'index.html'));
    } else {
        res.redirect('/login.html');
    }
});

// User creation
const saltRounds = 10;

// Dummy data
const username = 'exampleUser';
const email = 'example@email.com';
const plainPassword = 'examplePassword';

bcrypt.hash(plainPassword, saltRounds, (err, hashedPassword) => {
    if (err) {
        console.error(err);
        return;
    }

    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    pool.query(sql, [username, email, hashedPassword], (err, results) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('User inserted:', results.insertId);
    });
});

// SQL QUERIES
app.use(express.json());


const createUsersTable = `
CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`name\` varchar(255) NOT NULL,
  \`email\` varchar(255) NOT NULL,
  \`password\` varchar(255) NOT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`

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

/*pool.query(updateUsersTable, valuesForUsers, (error, results) => {
    if (error) throw error;
    console.log(`Updated ${results.affectedRows} row(s)`);
})*/

pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log('Connected to MySQL server!');
    connection.release();
});

// Start listening on port...
app.listen(port,() => {
    console.log(`Server running at http://localhost:${port}`);
});