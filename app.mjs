import Game from "./Models/Game.mjs";

const local_Game_History = "SavedGames";
let games = listOfAllGamesInfo();

function retrieveAllGameInfo() {
    let listOfAllGamesInfo = outputJson(retrieveAllLocalGames()||"[]");
    let result = [];
    for(let i = 0;i<listOfAllGamesInfo.length;i++) {
        let entry = listOfAllGamesInfo[i];
        result.push(new Game(
            entry.title,
            entry.designer,
            entry.artist,
            entry.publisher,
            entry.year,
            entry.players,
            entry.time,
            entry.difficulty,
            entry.url,
            entry.playCount,
            entry.personalRating
        ));
    }
    return result;
}

function saveToLocalStorage(game) {
    localStorage.setItem(local_Game_History, game);
}

function retrieveAllLocalGames() {
    return localStorage.getItem(local_Game_History);
}

function outputJson(jsonString) {
    return JSON.parse(jsonString)
}

function importJson(gameFile) {
    saveToLocalStorage(JSON.stringify(gameFile));
}

document.getElementById("importSource").addEventListener("change", function(event) {
    let file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
        saveToLocalStorage(evt.target.result);
    };
    reader.readAsText(file);
});

