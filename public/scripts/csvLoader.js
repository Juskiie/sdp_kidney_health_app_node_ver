console.log("csvLoader.js loaded");
import calcEFGR from './calcEFGR.js';

export function csvLoader(csvData) {
	const lines = csvData.split('\n');
	const patients = [];
	const patientIds = new Set();

	for (const line of lines) {
		const values = line.split(',');

		if (values.length !== 5) {
			continue; // Skip invalid lines
		}

		const [patientID, rawGender, ethnicity, age, creatinine] = values;
		const gender = rawGender === '1' ? 'Male' : 'Female';

		// Validate age and creatinine
		const ageInt = parseInt(age, 10);
		const creatinineInt = parseInt(creatinine, 10);

		if (ageInt < 0 || ageInt > 105 || creatinineInt < 0 || isNaN(ageInt) || isNaN(creatinineInt)) {
			continue;
		}

		// Skip duplicate patient data, only one per patient can exist in the CSV.
		if (patientIds.has(patientID)) {
			console.log(`Duplicate PatientID: ${patientID}`);
			continue;
		}

		patientIds.add(patientID);
		patients.push({
			patientID,
			gender,
			ethnicity,
			age: ageInt,
			creatinine: creatinineInt,
		});
	}

	for (const patient of patients) {
		let currentResult = calcEFGR(patient.creatinine, patient.age, patient.gender, patient.ethnicity)
		console.log(currentResult);
		appendResult(currentResult);
	}
}

function appendResult(result) {
	const resultsDiv = document.getElementById('results');
	const listItem = document.createElement('div');
	listItem.innerText = result;
	resultsDiv.appendChild(listItem);
}

document.getElementById('csvFile').addEventListener('change', async (event) => {
	const file = event.target.files[0];
	if (file) {
		const fileContent = await file.text();
		csvLoader(fileContent);
	}
});
