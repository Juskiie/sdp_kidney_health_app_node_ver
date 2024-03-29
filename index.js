/*
 * Node.js server backend.
 * @author L. Casey Bull - K2028885@kingston.ac.uk
 */

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 80; // choose any port number you like
const path = require('path')
const session = require('express-session');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const verifyRecaptcha = require('./private-scripts/recaptcha');

// Create mysql connection
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'maindb.cvqsrhluyyah.eu-west-2.rds.amazonaws.com',               // maindb.cvqsrhluyyah.eu-west-2.rds.amazonaws.com
    user: 'root',
    password: process.env.dbPassword,
    database: 'maindb',
    port: 3306
});

// Create a session and cookie for users
app.use(
    session({
        secret: 'secretKey',
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour
    })
);

// Serve static files from the public directory
app.use('/styles', express.static(path.join(__dirname, 'public', 'styles')));
app.use('/scripts', express.static(path.join(__dirname, 'public', 'scripts')));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// Setup express middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

/**
 * @deprecated - Used to register new users, currently unused
 */
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const query = `
            INSERT INTO users (username, email, password)
            VALUES (?, ?, ?);
        `;

        pool.getConnection((err, connection) => {
            if (err) {
                res.status(500).send('Error getting a database connection.');
                console.error(err);
                return;
            }

            connection.query(query, [username, email, hashedPassword], (error, result) => {
                connection.release();

                if (error) {
                    res.status(500).send('Error creating user.');
                    console.error(error);
                } else {
                    res.status(201).send('User created successfully.');
                }
            });
        });
    } catch (error) {
        res.status(500).send('Error hashing password.');
        console.error(error);
    }
});

/**
 * Creates the login route, and verifies reCaptcha was completed.
 */
app.post('/login', verifyRecaptcha, (req, res) => {
    const { username, password } = req.body;

    const usersSql = 'SELECT * FROM users WHERE username = ?';

    pool.query(usersSql, [username], (err, userResults) => {
        if (err) throw err;

        if (userResults.length > 0) {
            bcrypt.compare(password, userResults[0].password, (err, result) => {
                if (result) {
                    req.session.loggedin = true;
                    req.session.username = username;

                    const clinicianSql = 'SELECT * FROM clinicians WHERE username = ?';
                    pool.query(clinicianSql, [username], (err, clinicianResults) => {
                        if (err) throw err;

                        if (clinicianResults.length > 0) {
                            res.redirect('/clinician.html');
                        } else {
                            res.redirect('/patient.html');
                        }
                    });
                } else {
                    res.send('Incorrect username and/or password!');
                }
            });
        } else {
            res.send('Incorrect username and/or password!');
        }
    });
});

/**
 * Gets the username of the user currently logged in.
 * First authenticates the user is logged in, and if not returns
 * a response code 401.
 */
app.get('/getUsername', (req, res) => {
    if (req.session.loggedin) {
        res.json({ username: req.session.username });
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});

/**
 * Static route for the main page index.html.
 * If user isn't logged in, redirects to login page.
 */
app.get('/', (req, res) => {
    if (req.session.loggedin) {
        res.sendFile(path.join(__dirname, 'index.html'));
    } else {
        res.redirect('/login.html');
    }
});

/**
 * Serves the same function as the above code, except
 * it works from the main page if the user tries to load it without logging in.
 */
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

/**
 * Creates the static route for the login page
 */
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

/**
 * Creates the static route for clinician page
 */
app.get('/clinician.html', (req, res) => {
    if (req.session.loggedin) {
        res.sendFile(path.join(__dirname, 'public', 'clinician.html'));
    } else {
        res.redirect('/login.html');
    }
});

app.get('/CSV_clinician.html', (req, res) => {
    if (req.session.loggedin) {
        res.sendFile(path.join(__dirname, 'public', 'CSV_clinician.html'));
    } else {
        res.redirect('/login.html');
    }
});

/**
 * Creates the static route for patient page
 */
app.get('/patient.html', (req, res) => {
    if (req.session.loggedin) {
        res.sendFile(path.join(__dirname, 'public', 'patient.html'));
    } else {
        res.redirect('/login.html');
    }
});

/**
 * Creates the static route for patient general information page
 */
app.get('/patient_general_info.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'patient_general_info.html'));
})

app.get('/clinician_general_info.html', (req, res) => {
    if (req.session.loggedin) {
        res.sendFile(path.join(__dirname, 'public', 'clinician_general_info.html'));
    } else {
        res.redirect('/login.html');
    }
})

// SQL QUERIES
app.use(express.json());

/**
 * Pre-made sql queries
 */

// const updateResultsData = `
// UPDATE patients
// SET test_results = JSON_MERGE_PATCH(test_results, ?)
// WHERE name = ?
// `;
const updateResultsData = `
UPDATE patients
SET test_results = CASE
    WHEN test_results IS NULL THEN ?
    ELSE JSON_MERGE_PATCH(test_results, ?)
END
WHERE name = ?
`;
const getResultsData = `
    SELECT test_results
    FROM patients 
    WHERE name = ?
`

/**
 * Handles post requests to the database for updating the 'patients' table.
 * First, handles the data send from the front end.
 * Then returns the completed results from the database.
 */
app.post('/update', (req, res) => {
    // Retrieve the data from the backend
    let id = req.body.ID;
    let testResults = req.body.data;
    const testResultsJson = JSON.stringify(testResults);
    const returnResults = req.body.returnResults || false;

    pool.query(updateResultsData, [testResultsJson, testResultsJson, id], (error, updateResults, fields) => { //pool.query(updateResultsData, [testResultsJson, id], (error, updateResults, fields) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error: Unable to update table' });
            return;
        }

        if (returnResults) {
            pool.query(getResultsData, [id], (error, getResults, fields) => {
                if (error) {
                    console.error(error);
                    res.status(500).json({ error: 'Internal Server Error: Unable to retrieve table data' });
                    return;
                }
                if (!getResults[0] || getResults[0].test_results === undefined || getResults[0].test_results === null) {
                    res.status(404).json({ error: 'No test results found for the given ID' });
                    return;
                }
                const testResultsFromDb = JSON.parse(getResults[0].test_results);
                const result = Object.entries(testResultsFromDb).map(([date, value]) => ({ date, value }));
                res.json(result);
            });
        } else {
            res.status(200).json({ message: 'Update successful' });
        }
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log('Connected to MySQL server!');
    connection.release();
});

// I'm listening...
app.listen(port,() => {
    console.log(`Server running at http://localhost:${port}`);
});