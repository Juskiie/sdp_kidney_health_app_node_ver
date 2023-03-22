import {Chart} from "chart.js";


export function splitJSONData(data) {
	const arr = data.map(obj => Object.entries(obj));
	const mapArr = arr.map(([date, value]) => [date[1], value[1]]);
	const keys = mapArr.map(([date]) => date);
	const values = mapArr.map(([, value]) => value);
	return [keys, values];
}

/*
			 * The values for the dates are always going to be in order, as entries added to database
			 * are added on the date the entry was created.
			 * Since time cannot go backwards... they will already be in order.
			 */
export function drawNewChart(dates, values) {
	if(window.chart){
		window.chart.destroy(); // First destroy any existing chart
	}
	const ctx = document.getElementById('line-chart').getContext('2d'); // use correct id "line-chart"
	const data = {
		labels: dates, //
		datasets: [
			{
				label: 'EFGR Results history',
				data: values,
				fill: false,
				borderColor: 'rgb(75, 192, 192)',
				tension: 0.1
			}
		]
	};
	const options = {
		scales: {
			yAxes: [{
				ticks: {
					beginAtZero: true
				}
			}]
		}
	}; // your options object
	window.chart = new Chart(ctx, {
		type: 'line',
		data: data,
		options: options
	});
}
