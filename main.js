import { csvToRuns, findRuns } from './functions.js';
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
                { name: 'HUNK', active: false },
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
            columns: ["Rank", "Score", "Character", "Map", "Platform", "Region", "Player", "Date", "Video", "Comment"],
            mercs_runs: [],
            numberOfRuns: 0,
            itemsPerPage: 20,
            currentPage: 1,
            //dataHeader: "Mercenaries Leaderboard",
        };
    },
    methods: {
        isNotEmpty(video) {
            return video != "";
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
        changePage(page) {
            this.currentPage = page;
        }
    },
    computed: {
        filteredRuns() {
            let runs = this.mercs_runs
            let filterMap = { ...this.currentMapFilter }.name
            let filterCharacter = { ...this.currentCharacterFilter }.name
            let filterCategory = { ...this.currentCategoryFilter }.name

            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;

            if ((filterMap === undefined) & (filterCharacter === undefined) & (filterCategory === undefined)) {
                return this.mercs_runs.slice(start, end);
            }
            else {
                let filters = [filterMap, filterCharacter, filterCategory]
                let response = findRuns(runs, filters)
                this.numberOfRuns = response.length
                return response.slice(start, end);
            }
        },
        dataHeader() {
            let filterMap = { ...this.currentMapFilter }.name
            let filterCharacter = { ...this.currentCharacterFilter }.name
            let filterCategory = { ...this.currentCategoryFilter }.name
            return `${filterMap} | ${filterCharacter} | ${filterCategory} (${this.numberOfRuns} runs)`
        },
        pageCount() {
            return Math.ceil(this.mercs_runs.length / this.itemsPerPage);
        }
    },
    created() {
        const sheetId = "1UbFSXJwmFCBQDZibaDoJon3pJmA342L9l0mF5Dmubco";
        const sheetName = encodeURIComponent("The Mercenaries");
        const range = "&range=E8:Q1427"
        let sheetURL = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}${range}`;
        fetch(sheetURL)
            .then((response) => response.text())
            .then((csvText) => {
                this.mercs_runs = csvToRuns(csvText);
            })
    },
})
app.mount('#app')