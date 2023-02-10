import { csvToRuns, findRuns, findRunsPlayer } from './functions.js';
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
            dataHeader: "All runs",
            mercs_runs: [],
            itemsPerPage: 50,
            currentPage: 1,
            pageCount: 0,
            searchPlayer: "",
        };
    },
    methods: {
        isNotEmpty(video) {
            return video != "";
        },
        clearFilters() {
            this.maps.forEach(m => m.active = false)
            this.characters.forEach(c => c.active = false)
            this.categories.forEach(c => c.active = false)
            this.currentMapFilter = ""
            this.currentCharacterFilter = ""
            this.currentCategoryFilter = ""
            this.searchPlayer = ""
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
        noFilters() {
            return (
                this.currentMapFilter == "" &
                this.currentCharacterFilter == "" &
                this.currentCategoryFilter == ""
            )
        },
        changePage(page) {
            this.currentPage = page;
        }
    },
    computed: {
        filteredRuns() {
            let runs = this.mercs_runs
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            let response;

            if (this.searchPlayer != "")    // user is using the search button
                response = findRunsPlayer(runs, this.searchPlayer.toLowerCase())
            else {
                let filterMap = { ...this.currentMapFilter }.name
                let filterCharacter = { ...this.currentCharacterFilter }.name
                let filterCategory = { ...this.currentCategoryFilter }.name
                response = findRuns(runs, filterMap, filterCharacter, filterCategory)
            }

            this.dataHeader = response.header
            this.pageCount = Math.ceil(response.runs.length / this.itemsPerPage);
            return response.runs.slice(start, end);
        },
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