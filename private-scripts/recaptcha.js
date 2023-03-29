const axios = require('axios');

/**
 * Checks that the reCAPTCHA was completed by the user
 * @param req - HTTP request argument to the middleware function
 * @param res - HTTP response argument to the middleware function
 * @param next - Callback argument for middleware function
 * @returns {Promise<*>} - async function promises to complete
 */
const verifyRecaptcha = async (req, res, next) => {
	const recaptchaResponse = req.body['g-recaptcha-response'];

	if (!recaptchaResponse) {
		return res.status(400).send('reCAPTCHA not completed.');
	}

	try {
		const result = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
			params: {
				secret: '6Ld9Ox0lAAAAAI0kgVw4Ty4CSOExbmlzzeLmCuIj',
				response: recaptchaResponse,
				remoteip: req.ip
			}
		});

		if (result.data.success) {
			next();
		} else {
			res.status(400).send('reCAPTCHA validation failed.');
		}
	} catch (error) {
		res.status(500).send('Error validating reCAPTCHA.');
		console.error(error);
	}
};

module.exports = verifyRecaptcha;