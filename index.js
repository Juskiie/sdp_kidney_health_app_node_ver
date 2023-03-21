/**
 * Node.js server backend.
 * @author L. Casey Bull - K2028885@kingston.ac.uk
 * @type {e | (() => Express)}
 */


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

// Setup express middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());


app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const query = `
            INSERT INTO users (username, email, password)
            VALUES (?, ?, ?);
        `;

        const connection = await pool.getConnection();
        const [result] = await connection.execute(query, [username, email, hashedPassword]);
        connection.release();

        res.status(201).send('User created successfully.');
    } catch (error) {
        res.status(500).send('Error creating user.');
        console.error(error);
    }
});

// Serve static files from the public directory
app.use('/styles', express.static(path.join(__dirname, 'public', 'styles')));
app.use('/scripts', express.static(path.join(__dirname, 'public', 'scripts')));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));


// Create a session and cookie for users
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

// Used by main.js to dynamically update page with current username.
app.get('/getUsername', (req, res) => {
    if (req.session.loggedin) {
        res.json({ username: req.session.username });
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});

// Initialise with login page if user hasn't logged in.
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

/*
/**
 * This code exists purely to add users to the system's database.
 * Should be made into a separate, more robust script.
 * @param plainPassword - Unencrypted user password
 * @param saltRounds - Specifies how the hashed password will be salted.
 * @param username - The username of the patient/clinician
 * @param email - The users email address, defaults to "default@email.com"

function addUsers(plainPassword, saltRounds, username, email){
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
}
*/

//     2000000002: "p10qw2",

const patientData = {
    2000000001: "p100001",
    2000000003: "p100003",
    2000000004: "p100004",
    2000000005: "p100005",
    2000000006: "p100006",
    2000000007: "p100007",
    2000000008: "p100008",
    2000000009: "p1er009",
    2000000010: "p100010",
    2000000011: "p10we21",
    2000000012: "p100012",
    2000000013: "p100013",
    2000000014: "p100014",
    2000000015: "p10_015",
    2000000016: "p100016",
    2000000017: "p10x017",
    2000000018: "p100018",
    2000000019: "p100019",
    2000000020: "p100020"
};
console.log(patientData);
let saltRounds = 10;
let email = "default@email.com";

for (const key in patientData) {
    if (patientData.hasOwnProperty(key)){
        const username = key;
        const password = patientData[key];
        console.log(`Username: ${username}, Password: ${password}`);
        bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
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
    }
}

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