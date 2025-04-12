import Game from "./Models/Game.mjs";

const local_Game_History = "SavedGames";
let games = retrieveAllGameInfo();

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

function createVisual() {
    let htmlBuffer = "";
    for(let i=0;i<games.length;i++) {
        htmlBuffer += `<div class="gameEntry">${createGameInfoEntry(i)}</div>`;
    }
    document.getElementById("htmlOutput").innerHTML = htmlBuffer;
}

function createGameInfoEntry(index) {
    let gameEntry = games[index];
    let fieldNames = Object.keys(gameEntry);
    let buffer = "";
    for(let i=0;i<fieldNames.length;i++) {
        buffer += createGameInfoField(index, fieldNames[i], gameEntry[fieldNames[i]]);
    }
    return buffer;
}

function createGameInfoField(index, fieldName, fieldValue) {
    let fieldType = "text";
    return `<div class="field"><label>${fieldName}</label><input type="${fieldType}" data-index="${index}" data-name="${fieldName}" value="${fieldValue}" /></div>`;
}

document.getElementById("importSource").addEventListener("change", function(event) {
    let file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
        saveToLocalStorage(evt.target.result);
        games = retrieveAllGameInfo();
        createVisual();
    };
    reader.readAsText(file);
});

