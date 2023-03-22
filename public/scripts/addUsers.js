const bcrypt = require('bcrypt');
const pool = require("./dbConnect");

/**
 * This code exists purely to add users to the system's database.
 * Should be made into a separate, more robust script.
 * @param plainPassword - Unencrypted user password
 * @param saltRounds - Specifies how the hashed password will be salted.
 * @param username - The username of the patient/clinician
 * @param email - The users email address, defaults to "default@email.com"
*/
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
