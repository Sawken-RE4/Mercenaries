import { csvToObjects, addRank } from './functions.js';
const app = Vue.createApp({
    data() {
        return {
            headers: ["Rank", "Score", "Character", "Map", "Platform", "Region", "Player", "Date", "Video", "Comment"],
            mercs_runs: [],
            dataHeader: "Mercenaries Leaderboard",
        };
    },
    methods: {
        isNotEmpty(video) {
            return video != "";
        }
    },
    created() {
        function handleResponse(csvText) {
            let sheetObjects = csvToObjects(csvText);
            sheetObjects.shift();
            sheetObjects = addRank(sheetObjects)
            return sheetObjects;
        }
        const sheetId = "1UbFSXJwmFCBQDZibaDoJon3pJmA342L9l0mF5Dmubco";
        const sheetName = encodeURIComponent("The Mercenaries");
        const range = "&range=E8:P1427"
        let sheetURL = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}${range}`;
        fetch(sheetURL)
            .then((response) => response.text())
            .then((csvText) => this.mercs_runs = handleResponse(csvText))
    },
})
app.mount('#app')