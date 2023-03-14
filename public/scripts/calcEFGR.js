// classless example for javascript implementation of java class
// By: Casey

// Clean, improved code:
console.log("calcEFGR.js loaded");
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
