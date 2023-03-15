import calcEFGR from './calcEFGR.js';
console.log("submitForm.js loaded");
function submitForm(event) {
	try{
		event.preventDefault();
		let gender = document.querySelector('select[name="gender"]').value;
		let age = document.querySelector('input[name="age"]').value;
		let ethnicity = document.querySelector('select[name="ethnicity"]').value;
		let creatinine = document.querySelector('input[name="creat"]').value;
		let isFemale = gender==="female";
		let isBlack = ethnicity==="black";
		const efgrResult = calcEFGR(creatinine, age, isFemale, isBlack);
		document.querySelector('.result').textContent = efgrResult;

		// Do something with the form values here
		console.log("Gender:", gender);
		console.log("Age:", age);
		console.log("Ethnicity:", ethnicity);
		console.log("Creatinine:", creatinine);
		console.log(efgrResult);
		alert("Your EFGR value is: "+efgrResult);

		let resultMessageElement = document.querySelector('#result-message');
		const rightBoxElement = document.querySelector('.results');

		switch(true) {
			case efgrResult >= 90:
				rightBoxElement.style.backgroundColor = '#C9CC3F';
				resultMessageElement.innerHTML = 'This is considered normal.';
				break;
			case efgrResult >= 60 && efgrResult <= 89:
				rightBoxElement.style.backgroundColor = '#E7DFC9';
				resultMessageElement.innerHTML = 'This is considered mildly low.';
				break;
			case efgrResult >= 45 && efgrResult <= 59:
				rightBoxElement.style.backgroundColor = '#E8D5CE';
				resultMessageElement.innerHTML = 'This is considered moderately low.';
				break;
			case efgrResult >= 30 && efgrResult <= 44:
				rightBoxElement.style.backgroundColor = '#E8CDD2';
				resultMessageElement.innerHTML = 'This is considered severely low.';
				break;
			case efgrResult >= 15 && efgrResult <= 29:
				rightBoxElement.style.backgroundColor = '#D4C3CA';
				resultMessageElement.innerHTML = 'This is considered very severely low.';
				break;
			default:
				rightBoxElement.style.backgroundColor = '#D4C3CA';
				resultMessageElement.innerHTML = 'Your eGFR result is extremely low. Please see your doctor immediately.';
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