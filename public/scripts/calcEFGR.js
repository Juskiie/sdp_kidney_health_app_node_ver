console.log("calcEFGR.js loaded");

/**
 * Takes input of creatinine, age, if the patient is female or not and if the patient's ethnicity is black or not,
 * then calculates the eGFR and returns to user in mmol/ml
 * @param creat - the creatinine value recorded by the patient
 * @param age - the patients age
 * @param isFemale - is the patient female?
 * @param isBlack - is the patient black?
 * @returns {string} - The eGFR value for the patient, to 3 digits.
 */
export default function calcEFGR(creat, age, isFemale, isBlack) {
	const a = Math.pow((creat / 88.4), -1.154);
	const b = Math.pow(age, -0.203);
	const c = isFemale ? 0.742 : 1;
	const d = isBlack ? 1.210 : 1;
	return (a * b * c * d).toFixed(3);
}


// UGLY HARD TO READ CODE:
/*
export default function calcEFGR(creat, age, isFemale, isBlack) {
	if (isFemale) {
		return isBlack ? (Math.pow((creat / 88.4), -1.154) * Math.pow(age, -0.203) * (0.742) * (1.210)).toFixed(3) : (Math.pow((creat / 88.4), -1.154) * Math.pow(age, -0.203) * (0.742)).toFixed(3);
	} else {
		return isBlack ? (Math.pow((creat / 88.4), -1.154) * Math.pow(age, -0.203) * (1.210)).toFixed(3) : (Math.pow((creat / 88.4), -1.154) * Math.pow(age, -0.203)).toFixed(3);
	}
}
 */
