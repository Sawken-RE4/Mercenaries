export function csvToRuns(csv) {
    const columnsIndex = {
        "Character": 0,
        "Map": 1,
        "Platform": 2,
        "Region": 3,
        "Unknown": 4,
        "Flags": 5,
        "Player": 6,
        "Date": 7,
        "Video": 8,
        "Comment": 9,
        "Link": 10,
        "ScoreF": 11,
    };
    function csvToArray(row) {
        return row
            .split(",")
            .map((val) => val.substring(1, val.length - 1));
    };
    function insertDot(score) {
        return score.slice(0, 3) + "." + score.slice(3)
    }
    /*     function parseDate(dateString) {
            return new Date(dateString);
        } */

    // Array where each item is one row of the sheet in csv format
    const csvRows = csv.split("\n");

    // Array where each item is a valid data column
    let columns = csvToArray(csvRows[0])
        .filter(str => str != "")
        .map(item => {
            return item.slice(0, -1);
        });;

    let runs = [];
    csvRows.forEach(csvRow => {
        let row = (csvToArray(csvRow))

        // Ignore rows that arent runs
        if ((row[columnsIndex["Map"]] == "") | (row[columnsIndex["Map"]] == "Map"))
            return;

        row[columnsIndex["ScoreF"]] = insertDot(row[columnsIndex["ScoreF"]])

        // Delete columns I and J since they are useless
        row.splice(columnsIndex["Unknown"], 2)

        let run = {};
        // Iterate value by value of current row
        for (let j = 0; j < row.length; j++) {
            run[columns[j]] = row[j];
        }
        runs.push(run);
    });
    runs.shift();
    return runs;
}

export function addRank(runs) {
    for (let i = 0; i < runs.length; i++) {
        runs[i].Rank = i + 1;
    }
    return runs;
}