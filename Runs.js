export class Run {
    constructor(character, map, platform, region, player, date, video, comment, link, score, country) {
        this.character = character;
        this.map = map;
        this.platform = platform;
        this.region = region;
        this.player = player;
        this.date = date;
        this.videoType = video;
        this.comment = this.setComment(comment);
        this.link = link;
        this.score = score.slice(0, 3) + "." + score.slice(3);
        this.country = country;
        this.rank = 0;
        this.category = this.setCategoryByPlatform(platform, region)
    }

    setCategoryByPlatform(platform, region) {
        switch(platform) {
            case "Steam 60fps":
            case "Steam":
                return "Steam 60fps"
            case "Switch":
            case "PlayStation 4":
            case "PlayStation 5":
            case "Xbox One":
            case "Xbox Series S":
            case "Xbox Series X":
                return "Switch, PS4/5 and XboxOne/SeriesS/SeriesX" 
            case "PlayStation 3":
            case "Xbox 360":
            case "Steam 30fps":
                return "PS3, Xbox 360, Steam 30fps, GC PAL, GC NTSC-J"
            case "GameCube":
                if ((region === "PAL") || (region === "NTSC-J")) {
                    return "PS3, Xbox 360, Steam 30fps, GC PAL, GC NTSC-J"
                }                    
                else {
                    return "GC NTSC"
                }
            case "Wii":
                return "Wii"
            case "PlayStation 2":
            case "PC '07":
                return "PS2, PC07"
        }        
    }

    setComment(comment) {
        if((comment === "") || (!comment.includes("Category WR")) && (!comment.includes("Unofficial WR |"))) {
            return comment
        }
        if (comment.includes("Category WR")) {
            return comment.replace("Category WR", "")
        }
        if (comment.includes("Unofficial WR |")) {
            return comment.replace("Unofficial WR |", "")
        }
    }
}
  
export class Runs {
    constructor() {
        this.runs = [];
    }
  
    addRun(character, map, platform, region, player, date, video, comment, link, score, country) {
        if((map === "") || (map === "Map") ) {
            return
        }
        const run = new Run(character, map, platform, region, player, date, video, comment, link, score, country);
        this.runs.push(run);
    }
  
    deleteRun(run) {
        const index = this.runs.indexOf(run);
        if (index !== -1) {
            this.runs.splice(index, 1);
        }
    }
  
    getRuns() {
        return this.runs;
    }

    addRank() {
        for (let i = 0; i < this.runs.length; i++) {
            this.runs[i].rank = i + 1;
        }
    }

    findRuns(map, character, category) {
        let filteredRuns = this.runs.filter(run => 
            (map ? run.map === map : true) &&
            (character ? run.character === character : true) &&
            (category ? run.category === category : true)
        );
    
        let header = [map || "All maps", character || "All characters", category || "All categories"]
            .join(" | ") + ` (${filteredRuns.length} runs)`;
        
        filteredRuns.sort( (a, b) => b.score - a.score)

        for (let i = 0; i < filteredRuns.length; i++) {
            filteredRuns[i].rank = i + 1;
        }

        if(!filteredRuns[0].comment.includes("Category WR")) {
            if(filteredRuns[0].comment !== "")
                filteredRuns[0].comment += " | Category WR"
            else
                filteredRuns[0].comment = "Category WR"
        }
        return {
            "runs": filteredRuns,
            "header": header
        }
    }

    findRunsPlayer(player) {
        let runsPlayer = this.runs.filter(function (run) {
            return run.player.toLowerCase().includes(player)
        });
        runsPlayer.forEach(playerRun => {
            let test = this.findRuns(playerRun.map, playerRun.character, playerRun.category)
            if (test !== undefined) {
                for (let i = 0; i < test.length; i++) {
                    test[i].rank = i + 1;
                }
            }
        });
        
        runsPlayer.sort( (a, b) => a.rank - b.rank)
        let header = `All ${runsPlayer.length} runs from ${player}`
        return { "runs": runsPlayer, "header": header }
    }
}
  