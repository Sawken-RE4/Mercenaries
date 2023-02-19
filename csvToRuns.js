import { Runs } from "./Runs.js";

export function csvToRuns(csv) {
	/*
    Converts a csv string onto an array of objects (runs)
    */
	const columnsIndex = {
		Character: 0,
		Map: 1,
		Platform: 2,
		Region: 3,
		Unknown: 4,
		Flags: 5,
		Player: 6,
		Date: 7,
		Video: 8,
		Comment: 9,
		Link: 10,
		ScoreF: 11,
		Country: 12,
	};
	function csvRowToArray(row) {
		return row.split(",").map((val) => val.substring(1, val.length - 1));
	}
	// Array where each item is one row of the sheet in csv format
	const csvRows = csv.split("\n");

	// Get rid of the headers
	csvRows.splice(0, 1);

	let runs = new Runs();
	csvRows.forEach((csvRow) => {
		let row = csvRowToArray(csvRow);

		// Delete data from columns I and J since they are useless
		row.splice(columnsIndex.Unknown, 2);

		runs.addRun(...row);
	});
	return runs;
}
