export function addRank(runs) {
    for (let i = 0; i < runs.length; i++) {
        runs[i].Rank = i + 1;
    }
    return runs;
}

function addWrComment(runs) {
    let comment = runs[0].Comment
    if(comment === "") {
        runs[0].Comment = "Category WR"
    }
    if( (comment !== "") && (!comment.includes("Category WR")) ) {
        runs[0].Comment = comment + " | Category WR"
    } 
    return runs
}

function deleteColumn(runs, column) {
    runs.forEach(run => {
        delete run[column]
    });
    return runs;
} 

function deleteWrComments(runs) {
    runs.forEach(run => {
        if(run["Comment"] === "Category WR") {
            run["Comment"] = ""
        }
    });
return runs;    
}

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
    const newGenConsoles = ["Switch", "PlayStation 4", "PlayStation 5", "Xbox One", "Xbox Series X", "Xbox Series S"]
    const oldGenConsoles = ["PlayStation 3", "Xbox 360", "Steam 30fps", "GameCube"]

    switch (category) {
        case "Steam 60fps":
            return runs.filter(function (run) {
                return (run["Platform"] == category) | (run["Platform"] == category.slice(0, 5))
            });
        case "Switch, PS4/5 and XboxOne/SeriesS/SeriesX":
            return runs.filter(function (run) {
                return newGenConsoles.includes(run["Platform"])
            });
        case "PS3, Xbox 360, Steam 30fps, GC PAL, GC NTSC-J":
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

export function findRuns(runs, map, character, category) {
    let response_runs;

    if ((map) && (character) && (category)) {
        let runs_map = findRunsMap(runs, map)
        let runs_character = findRunsCharacter(runs_map, character)
        response_runs = findRunsCategory(runs_character, category)
    }

    if ((map) && (character) && (!category)) {
        let runs_map = findRunsMap(runs, map)
        response_runs = findRunsCharacter(runs_map, character)
    }

    if ((map) && (!character) && (category)) {
        let runs_map = findRunsMap(runs, map)
        response_runs = findRunsCategory(runs_map, category)
    }

    if ((map) && (!character) && (!category))
        response_runs = findRunsMap(runs, map)

    if ((!map) && (character) && (category)) {
        let runs_character = findRunsCharacter(runs, character)
        response_runs = findRunsCategory(runs_character, category)
    }

    if ((!map) && (character) && (!category))
        response_runs = findRunsCharacter(runs, character)

    if ((!map) && (!character) && (category))
        response_runs = findRunsCategory(runs, category)

    if ((!map) && (!character) && (!category))
        response_runs = runs

    let header = [map || "All maps", character || "All characters", category || "All categories"]
        .join(" | ") + ` (${response_runs.length} runs)`;
    
    response_runs.sort( (a, b) => b.ScoreF - a.ScoreF)
    addRank(response_runs)

    return {
        "runs": response_runs,
        "header": header
    }
}

export function findRunsPlayer(runs, player) {
    const platformToCategory = { 
        "Steam 60fps": "Steam 60fps", 
        "Switch": "Switch, PS4/5 and XboxOne/SeriesS/SeriesX", 
        "PlayStation 4": "Switch, PS4/5 and XboxOne/SeriesS/SeriesX",
        "PlayStation 5": "Switch, PS4/5 and XboxOne/SeriesS/SeriesX",
        "Xbox One": "Switch, PS4/5 and XboxOne/SeriesS/SeriesX",
        "Xbox Series S": "Switch, PS4/5 and XboxOne/SeriesS/SeriesX",
        "Xbox Series X": "Switch, PS4/5 and XboxOne/SeriesS/SeriesX",
        "PlayStation 3": "PS3, Xbox 360, Steam 30fps, GC PAL, GC NTSC-J",
        "Xbox 360": "PS3, Xbox 360, Steam 30fps, GC PAL, GC NTSC-J",
        "Steam 30fps": "PS3, Xbox 360, Steam 30fps, GC PAL, GC NTSC-J",
        "GameCube PAL/NSTSC-J": "PS3, Xbox 360, Steam 30fps, GC PAL, GC NTSC-J",
        "GameCube NTSC": "GC NTSC",
        "Wii": "Wii",
        "PlayStation 2": "PS2, PC07",
        "PC '07": "PS2, PC07"
    }
    let runsPlayer = runs.filter(function (run) {
        return run["Player"].toLowerCase().includes(player)
    });
    runsPlayer.forEach(playerRun => {
        let full_runs;
        let runs_map = findRunsMap(runs, playerRun.Map)
        
        let runs_character = findRunsCharacter(runs_map, playerRun.Character)
        let platform = playerRun.Platform
        if ((playerRun.Platform == "GameCube") && (playerRun.Region == "NTSC")) {
            platform = "GameCube NTSC"
        }
        else if ((playerRun.Platform == "GameCube") && ((playerRun.Region == "NTSC-J") || (playerRun.Region == "PAL"))) {
            platform = "GameCube PAL/NTSC-J"
        }
        full_runs = findRunsCategory(runs_character, platformToCategory[platform])
        if (full_runs !== undefined) {
            addRank(full_runs)
        }
    });
    
    runsPlayer.sort( (a, b) => a.Rank - b.Rank)
    let header = `All ${runsPlayer.length} runs from ${player}`
    return { "runs": runsPlayer, "header": header }
}
/* 

function parseDate(dateString) {
    return new Date(dateString);
} 

*/