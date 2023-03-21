/**
 * Very simple script, when main page loads updates welcome message with users username.
 */
window.addEventListener('DOMContentLoaded', () => {
	fetch('/getUsername')
		.then((response) => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error('Unauthorized');
			}
		})
		.then((data) => {
			const welcomeMsg = document.getElementById('welcome-msg');
			welcomeMsg.textContent = `${data.username}`;
		})
		.catch((error) => {
			console.error('Error fetching username:', error);
		});
});
