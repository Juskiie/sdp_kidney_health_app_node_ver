import calcEFGR from './calcEFGR.js';
console.log("submitForm.js loaded");

/**
 * Processes information sent from the eGFR calculator form and updates the HTML.
 * @author L. Casey Bull - K2028885@kingston.ac.uk
 * @param event - This is the form details when the submit button is clicked.
 * @returns {boolean} - Returns false, unless there's an error
 */
function submitForm(event) {
	try{
		event.preventDefault();     // Prevent page reloading needlessly
		let sex = document.querySelector('select[name="sex"]').value;
		let age = document.querySelector('input[name="age"]').value;
		let ethnicity = document.querySelector('select[name="ethnicity"]').value;
		let creatinine = document.querySelector('input[name="creat"]').value;
		let isFemale = sex==="female";
		let isBlack = ethnicity==="black";
		let isMmol = document.querySelector("mmol").checked;
		const efgrResult = calcEFGR(creatinine, age, isFemale, isBlack, isMmol);    // Use eGFR calculator script to get value for patient
		document.querySelector('.result').textContent = efgrResult;

		// Simple logging for debugging purposes; can be removed.
		console.log("Sex:", sex);
		console.log("Age:", age);
		console.log("Ethnicity:", ethnicity);
		console.log("Creatinine:", creatinine);
		console.log(efgrResult);
		alert("Your EFGR value is: "+efgrResult);

		// let resultMessageElement = document.querySelector('#result-message');
		const rightBoxElement = document.querySelector('.results');

		// Determines background colour based on eGFR value
		// document.getElementById("resultMessage").style.visibility = "visible";
		switch(true) {
			case efgrResult >= 90:
				rightBoxElement.style.backgroundColor = '#C9CC3F';
				document.getElementById("resultMessage").innerText = 'This is considered normal.';
				break;
			case efgrResult >= 60 && efgrResult <= 89:
				rightBoxElement.style.backgroundColor = '#E7DFC9';
				document.getElementById("resultMessage").innerText = 'This is considered mildly low.';
				break;
			case efgrResult >= 45 && efgrResult <= 59:
				rightBoxElement.style.backgroundColor = '#E8D5CE';
				document.getElementById("resultMessage").innerText = 'This is considered moderately low.';
				break;
			case efgrResult >= 30 && efgrResult <= 44:
				rightBoxElement.style.backgroundColor = '#E8CDD2';
				document.getElementById("resultMessage").innerText = 'This is considered severely low.';
				break;
			case efgrResult >= 15 && efgrResult <= 29:
				rightBoxElement.style.backgroundColor = '#D4C3CA';
				document.getElementById("resultMessage").innerText = 'This is considered very severely low.';
				break;
			default:
				rightBoxElement.style.backgroundColor = '#D4C3CA';
				document.getElementById("resultMessage").innerText = 'Your eGFR result is extremely low. Please see your doctor immediately.';
				break;
		}

		return false;
	} catch (e) {
		console.error(e);
	} finally {
		return false;
	}
}

document.querySelector('#testForm').addEventListener('submit', submitForm);
export default { submitForm };