import { csvToRuns, addRank } from './functions.js';
const app = Vue.createApp({
    data() {
        return {
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
            console.log("Search button")
        }
    },
    updated() {
        console.log("Updated.", this.mercs_runs)
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