export function csvToRuns(csv) {
    /*
    Converts a csv string onto an array of objects (runs)
    */
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
        "Country": 12,
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
    addRank(runs)
    return runs;
}

function addRank(runs) {
    for (let i = 0; i < runs.length; i++) {
        runs[i].Rank = i + 1;
    }
    return runs;
}

/* function deleteColumn(runs, column) {
    for (let i = 0; i < runs.length; i++) {
        delete (runs[i][column])
    }
    return runs;
} */

export function findRuns(runs, map, character, category) {
    function findRunsMap(runs, map) {
        return runs.filter(function (run) {
            return run["Map"] == map
        });
    }
    function findRunsCharacter(runs, character) {
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
                    return (run["Platform"] == category) | (run["Platform"] == category.slice(0, 5))
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
        }
    }

    let header;
    let response_runs;

    if ((map) && (character) && (category)) {
        let runs_map = findRunsMap(runs, map)
        let runs_character = findRunsCharacter(runs_map, character)
        response_runs = findRunsCategory(runs_character, category)

        header = `${map} | ${character} | ${category} `
    }

    if ((map) && (character) && (!category)) {
        let runs_map = findRunsMap(runs, map)
        response_runs = findRunsCharacter(runs_map, character)

        header = `${map} | ${character} | All categories `
    }

    if ((map) && (!character) && (category)) {
        let runs_map = findRunsMap(runs, map)
        response_runs = findRunsCategory(runs_map, category)

        header = `${map} | All characters | ${category} `
    }

    if ((map) && (!character) && (!category)) {
        response_runs = findRunsMap(runs, map)

        header = `${map} | All characters | All categories `
    }

    if ((!map) && (character) && (category)) {
        let runs_character = findRunsCharacter(runs, character)
        response_runs = findRunsCategory(runs_character, category)

        header = `All maps | ${character} | ${category} `
    }

    if ((!map) && (character) && (!category)) {
        response_runs = findRunsCharacter(runs, character)

        header = `All maps | ${character} | All categories `
    }

    if ((!map) && (!character) && (category)) {
        response_runs = findRunsCategory(runs, category)

        header = `All maps | All characters | ${category} `
    }
    if ((!map) && (!character) && (!category)) {
        response_runs = runs

        header = `All maps | All characters | All categories `
    }
    header += `(${response_runs.length} runs)`
    addRank(response_runs)
    return {
        "runs": response_runs,
        "header": header
    }
}

export function findRunsPlayer(runs, player) {
    let runsPlayer = runs.filter(function (run) {
        return run["Player"].toLowerCase().includes(player)
    });
    let header = `All ${runsPlayer.length} runs from ${player}`
    return { "runs": runsPlayer, "header": header }
}
/* Useful for later

let test = runs.filter(function (run) {
    return run.Map == "Village" & run.Character == "Wesker"
});

function parseDate(dateString) {
    return new Date(dateString);
} 

*/