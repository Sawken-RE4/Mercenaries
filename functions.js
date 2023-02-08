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

        // Delete data from columns I and J since they are useless
        row.splice(columnsIndex["Unknown"], 2)

        let run = {};
        // Iterate value by value of current row and assign the corresponding data
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



export function findRuns(runs, options) {
    /* Example options:
    [
        {type: "Map", name: "Village"},
        {type: "Character", name: "Krauser"}
        {type: "Category", name: "Wii"}
    ]
    */
    function findRunsMap(runs, map) {
        const maps = ["Village", "Castle", "Base", "Waterworld"]
        if (!maps.includes(map))
            return []
        return runs.filter(function (run) {
            return run["Map"] == map
        });
    }
    function findRunsCharacter(runs, character) {
        const characters = ["Wesker", "HUNK", "Ada", "Krauser", "Leon"]
        if (!characters.includes(character))
            return []
        return runs.filter(function (run) {
            return run["Character"] == character
        });
    }
    function findRunsCategory(runs, category) {
        const newGenConsoles = ["PlayStation 4", "PlayStation 5", "Xbox One", "Xbox Series X", "Xbox Series S"]
        const oldGenConsoles = ["PlayStation 3", "Xbox 360", "Steam 30fps", "GameCube"]
        switch (category) {
            case "Steam 60fps":
                return runs.filter(function (run) {
                    return run["Platform"] == category
                });
            case "PS4/5 and XboxOne/SeriesS/SeriesX":
                return runs.filter(function (run) {
                    return newGenConsoles.includes(run["Platform"])
                });
            case "PS3, Xbox 360, Steam30fps, GC PAL, GC NTSC-J":
                let all_runs = runs.filter(function (run) {
                    return oldGenConsoles.includes(run["Platform"])
                });
                return all_runs.filter(function (run) {
                    return run["Region"] != "NTSC"
                });
            case "GC NTSC":
                return runs.filter(function (run) {
                    return run["Platform"] == "GameCube" & run["Region"] == "NTSC"
                });
            case "Wii":
                return runs.filter(function (run) {
                    return run["Platform"] == "Wii"
                });
            case "PS2, PC07":
                return runs.filter(function (run) {
                    return run["Platform"] == "PlayStation 2" | run["Platform"] == "PC '07"
                });
            default:
                return []
        }
    }
    if (options.length == 0)        // no options, show all runs
        return runs
    if (options.length == 1) {      // only one option, either map, character or category
        let arg = options[0].name
        switch (options[0].type) {
            case "Map": return findRunsMap(runs, arg)
            case "Character": return findRunsCharacter(runs, arg)
            case "Category": return findRunsCategory(runs, arg)
        }
    }
}

/* Useful for later

let test = runs.filter(function (run) {
    return run.Map == "Village" & run.Character == "Wesker"
});

function parseDate(dateString) {
    return new Date(dateString);
} 

*/