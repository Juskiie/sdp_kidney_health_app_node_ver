console.log("csvLoader.js loaded");
import calcEFGR from './calcEFGR.js';


/**
 * Allows clinicians to upload a CSV file, containing patient eGFR data.
 * Then batch performs the eGFR calculation on all the patient data, and output to user.
 * @param csvData - The CSV file
 */
export async function csvLoader(csvData) {
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

	await Promise.all(
		patients.map(async (patient) => {
			const currentResult = calcEFGR(patient.creatinine, patient.age, patient.gender, patient.ethnicity);
			console.log(currentResult);
			return appendResult(patient, currentResult);
		})
	);
}

/**
 * Appends the results data to the main page in a list view for the clinician.
 * @param id - The patients ID
 * @param result - The patients eGFR value
 * @returns {Promise<void>}
 */
async function appendResult(id, result) {
	const resultsDiv = document.getElementById('resultsFromCSV');
	const listItem = document.createElement('div');
	listItem.innerText = (id + ": " + result);
	resultsDiv.appendChild(listItem);

	const dateResult = new Date().toISOString().slice(0, 10);
	const results = {};
	results[dateResult] = result;

	const data = {
		ID: patient.patientID,
		data: results,
	};

	try {
		const response = await fetch('/update', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			throw new Error(response.statusText);
		}

		const responseData = await response.json();
		console.log(responseData);
	} catch (error) {
		console.error(error);
	}
}

document.getElementById('csvFile').addEventListener('change', async (event) => {
	const file = event.target.files[0];
	if (file) {
		const fileContent = await file.text();
		csvLoader(fileContent);
	}
});
