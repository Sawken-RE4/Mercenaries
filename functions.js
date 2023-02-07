export function csvToObjects(csv) {
    function csvSplit(row) {
        return row.split(",").map((val) => val.substring(1, val.length - 1));
    }
    const csvRows = csv.split("\n");
    let propertyNames = csvSplit(csvRows[0]).filter(str => str.length > 0);
    propertyNames = propertyNames.map(item => {
        if (item === "Score GameCube NTSC") {
            return "Score";
        }
        return item.slice(0, -1);
    });
    let runs = [];
    for (let i = 0; i < csvRows.length; i++) { // iterate the whole row
        let row = csvSplit(csvRows[i]);
        if (row[0] == "" | row[0] == "Character") { // rows that arent runs
            continue;
        }
        let run = {};
        //row = row.filter(str => str.length > 0)
        // Delete useless values from columns D, I, and J (1, 6, 7) 
        row.splice(4, 2)    // delete I and J
        row[9] = row[9].slice(0, 3) + "." + row[9].slice(3)
        // insert the dot on the scores for readability
        for (let j = 0; j < row.length; j++) { // iterate value by value of current row
            run[propertyNames[j]] = row[j];


            // BELOW 4 LINES WILL CONVERT DATES IN THE "ENROLLED" COLUMN TO JS DATE OBJECTS
            // if (propertyNames[j] === "Enrolled") {
            //   thisObject[propertyNames[j]] = new Date(row[j]);
            // } else {
            //   thisObject[propertyNames[j]] = row[j];
            // }
        }
        runs.push(run);
    }
    return runs;
}

export function addRank(runs) {
    for (let index = 0; index < runs.length; index++) {
        runs[index].Rank = index + 1;
    }
    return runs;
}