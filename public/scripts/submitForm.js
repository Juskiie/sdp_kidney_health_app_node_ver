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

		return false;
	} catch (e) {
		console.error(e);
	} finally {
		return false;
	}
}

document.querySelector('#testForm').addEventListener('submit', submitForm);
export default { submitForm };