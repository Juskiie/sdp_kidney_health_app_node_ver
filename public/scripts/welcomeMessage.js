<<<<<<< HEAD
console.log("welcomeMessage.js loaded");
=======
// welcomeMessage.js
>>>>>>> origin/master
/**
 * Very simple script, when main page loads updates welcome message with users username.
 */
export async function updateWelcomeMessage() {
	try {
		const response = await fetch('/getUsername');
		if (response.ok) {
			const data = await response.json();
			const welcomeMsg = document.getElementById('welcome-msg');
			welcomeMsg.textContent = `${data.username}`;
		} else {
			throw new Error('Unauthorized');
		}
	} catch (error) {
		console.error('Error fetching username:', error);
	}
}

window.addEventListener('DOMContentLoaded', async () => {
	try {
		await updateWelcomeMessage();
	} catch (error) {
		console.error('Error in DOMContentLoaded event listener:', error);
	}
});
/*
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
 */