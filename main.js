import { csvToRuns, addRank, findRuns } from './functions.js';
const app = Vue.createApp({
    data() {
        return {
            maps: [
                { name: 'Village', active: false },
                { name: 'Castle', active: false },
                { name: 'Base', active: false },
                { name: 'Waterworld', active: false }
            ],
            characters: [
                { name: 'Wesker', active: false },
                { name: 'Hunk', active: false },
                { name: 'Ada', active: false },
                { name: 'Krauser', active: false },
                { name: 'Leon', active: false }
            ],
            categories: [
                { name: 'Steam 60fps', active: false },
                { name: 'PS4/5 and XboxOne/SeriesS/SeriesX', active: false },
                { name: 'PS3, Xbox 360, Steam30fps, GC PAL, GC NTSC-J', active: false },
                { name: 'GC NTSC', active: false },
                { name: 'Wii', active: false },
                { name: 'PS2, PC07', active: false }
            ],
            currentMapFilter: "",
            currentCharacterFilter: "",
            currentCategoryFilter: "",
            headers: [],
            mercs_runs: [],
            dataHeader: "Mercenaries Leaderboard",
        };
    },
    methods: {
        isNotEmpty(video) {
            return video != "";
        },
        search() {
            const selectedOptions = document.querySelectorAll(".active");
            let options = {}
            selectedOptions.forEach(element => {
                options.name = (element.innerText)
                options.type = (element.classList)
            });
            //this.mercs_runs = findRuns(mercs_runs, options)

        },
        toggleActiveMap(map) {
            this.maps.forEach(m => m.active = false)
            map.active = !map.active
            this.currentMapFilter = map
        },
        toggleActiveCharacter(character) {
            this.characters.forEach(c => c.active = false)
            character.active = !character.active
            this.currentCharacterFilter = character
        },
        toggleActiveCategory(category) {
            this.categories.forEach(c => c.active = false)
            category.active = !category.active
            this.currentCategoryFilter = category
        },
    },
    computed: {
        filteredRuns() {
            let runs = this.mercs_runs
            let filter = this.currentMapFilter
            console.log(runs)
            console.log(filter)
            return runs.filter(function (run) {
                return run["Map"] == filter
            });
        }
    },
    updated() {
        //console.log("Updated.", this.mercs_runs)
    },
    created() {
        function handleResponse(csvText) {
            let runs = csvToRuns(csvText);
            runs = addRank(runs)
            return runs;
        }
        function getColumns() {
            return ["Rank", "Score", "Character", "Map", "Platform", "Region", "Player", "Date", "Video", "Comment"]
        }
        const sheetId = "1UbFSXJwmFCBQDZibaDoJon3pJmA342L9l0mF5Dmubco";
        const sheetName = encodeURIComponent("The Mercenaries");
        const range = "&range=E8:P1427"
        let sheetURL = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}${range}`;
        fetch(sheetURL)
            .then((response) => response.text())
            .then((csvText) => {
                this.mercs_runs = handleResponse(csvText);
                this.headers = getColumns()
                //this.dataHeader = getDataHeader()
            })
    },
})
app.mount('#app')