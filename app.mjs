import Game from "./Models/Game.mjs";

const local_Game_History = "SavedGames";

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