const mysql = require('mysql');
/**
 *
 * @type {Pool}
 */
const pool = mysql.createPool({
	connectionLimit: 10,
	host: 'maindb.cvqsrhluyyah.eu-west-2.rds.amazonaws.com',
	user: 'root',
	password: 'SDPKodeGreen123',
	database: 'maindb',
	port: 3306
});

pool.connect((err) => {
	if (err) throw err;
	console.log('Connected to MySQL database!');
});

module.exports = pool;