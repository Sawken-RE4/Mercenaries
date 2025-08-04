import { csvToRuns } from "./csvToRuns.js";
import { Runs } from "./Runs.js";

const app = Vue.createApp({
	data() {
		return {
			maps: [
				{ name: "Village", active: false },
				{ name: "Castle", active: false },
				{ name: "Base", active: false },
				{ name: "Waterworld", active: false },
			],
			characters: [
				{ name: "Wesker", active: false },
				{ name: "HUNK", active: false },
				{ name: "Ada", active: false },
				{ name: "Krauser", active: false },
				{ name: "Leon", active: false },
			],
			categories: [
				{ name: "Steam 60fps", active: false },
				{ name: "Switch, PS4/5 and XboxOne/SeriesS/SeriesX", active: false },
				{ name: "PS3, Xbox 360, Steam 30fps, GC PAL, GC NTSC-J", active: false },
				{ name: "GC NTSC", active: false },
				{ name: "Wii", active: false },
				{ name: "PS2, PC07", active: false },
			],
			currentMapFilter: "",
			currentCharacterFilter: "",
			currentCategoryFilter: "",
			dataColumns: [
				"Rank",
				"Score",
				"Character",
				"Map",
				"Platform",
				"Region",
				"Player",
				"Date",
				"Video",
				"Comment",
			],
			statsColumns: ["Platform", "Runs", "Runners", "---", ""],
			dataHeader: "",
			allRuns: new Runs(),
			itemsPerPage: 50,
			currentPage: 1,
			pageCount: 0,
			searchPlayer: "",
			showStats: false,
		};
	},
	methods: {
		isNotEmpty(video) {
			return video != "";
		},
		clearFilters() {
			this.maps.forEach((m) => (m.active = false));
			this.characters.forEach((c) => (c.active = false));
			this.categories.forEach((c) => (c.active = false));
			this.currentMapFilter = "";
			this.currentCharacterFilter = "";
			this.currentCategoryFilter = "";
			this.searchPlayer = "";
		},
		toggleActiveMap(map) {
			this.maps.forEach((m) => (m.active = false));
			map.active = !map.active;
			this.currentMapFilter = map;
		},
		toggleActiveCharacter(character) {
			this.characters.forEach((c) => (c.active = false));
			character.active = !character.active;
			this.currentCharacterFilter = character;
		},
		toggleActiveCategory(category) {
			this.categories.forEach((c) => (c.active = false));
			category.active = !category.active;
			this.currentCategoryFilter = category;
		},
		toggleStats() {
			this.showStats = !this.showStats;
		},
		noFilters() {
			return (
				(this.currentMapFilter == "") &
				(this.currentCharacterFilter == "") &
				(this.currentCategoryFilter == "")
			);
		},
		changePage(page) {
			this.currentPage = page;
		},
	},
	computed: {
		filteredRuns() {
			const start = (this.currentPage - 1) * this.itemsPerPage;
			const end = start + this.itemsPerPage;
			let response;

			if (this.searchPlayer != "")
				// user is using the search button
				response = this.allRuns.findRunsPlayer(this.searchPlayer.toLowerCase());
			else {
				let filterMap = { ...this.currentMapFilter }.name;
				let filterCharacter = { ...this.currentCharacterFilter }.name;
				let filterCategory = { ...this.currentCategoryFilter }.name;
				response = this.allRuns.findRuns(filterMap, filterCharacter, filterCategory);
			}

			this.dataHeader = response.header;
			this.pageCount = Math.ceil(response.runs.length / this.itemsPerPage);
			return response.runs.slice(start, end);
		},
		getStats() {
			return this.allRuns.getPlatformStats();
		},
	},
	created() {
		const sheetID = "1UbFSXJwmFCBQDZibaDoJon3pJmA342L9l0mF5Dmubco";
		const sheetName = encodeURIComponent("Mercs");
		const sheetRange = "&range=E8:Q1469";
		let sheetURL = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:csv&sheet=${sheetName}${sheetRange}`;
		fetch(sheetURL)
			.then((response) => response.text())
			.then((csvText) => {
				this.allRuns = csvToRuns(csvText);
			});
	},
});
app.mount("#app");
