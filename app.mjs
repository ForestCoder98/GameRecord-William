import Game from "./Models/Game.mjs";

const local_Game_History = "SavedGames";
let games = retrieveAllGameInfo();
createVisual();

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
    setupWatchers();
}

function createGameInfoEntry(index) {
    let gameEntry = games[index];
    let fieldNames = Object.keys(gameEntry);
    let buffer = "";
    for(let i=0;i<fieldNames.length;i++) {
        buffer += createGameInfoField(index, fieldNames[i], gameEntry[fieldNames[i]]);
    }
    buffer += `<button data-index="${index}">Delete</button>`;
    return buffer;
}

function createGameInfoField(index, fieldName, fieldValue) {
    let fieldType = "text";
    if(fieldName==="personalRating") {
        fieldType = "range";
    }
    return `<div class="field"><label>${fieldName}</label><input type="${fieldType}" data-index="${index}" data-name="${fieldName}" value="${fieldValue}" /></div>`;
}

function setupWatchers() {
    let inputElements = document.querySelectorAll("#htmlOutput input");
    for(let i = 0; i<inputElements.length;i++) {
        inputElements[i].addEventListener("input", function(event) {
            let inputElement = event.target;
            games[inputElement.getAttribute("data-index")][inputElement.getAttribute("data-name")] = inputElement.value;
            importJson(games);
        });
    }
    let deleteButtons = document.querySelectorAll("#htmlOutput button");
    for(let i = 0;i<deleteButtons.length;i++) {
        deleteButtons[i].addEventListener("click", function(event) {
            let temporaryGamesList = [];
            for(let j = 0;j<games.length;j++) {
                if(j!=event.target.getAttribute("data-index")) {
                    temporaryGamesList.push(games[j]);
                }
            }
            games = temporaryGamesList;
            importJson(games);
            createVisual();
        });
    }
}

function sortBy(array, fieldName) {
    array.sort(function(a, b) {
        if(a[fieldName]<b[fieldName])
            return -1;
        else
            return 1;
    });
}

document.getElementById("sortByPlayers").addEventListener("click", function() {
    sortBy(games, "players");
    createVisual();
});

document.getElementById("sortByPersonalRating").addEventListener("click", function() {
    sortBy(games, "personalRating");
    createVisual();
});

document.getElementById("sortByDifficulty").addEventListener("click", function() {
    sortBy(games, "difficulty");
    createVisual();
});

document.getElementById("sortByPlayCount").addEventListener("click", function() {
    sortBy(games, "playCount");
    createVisual();
});

document.getElementById("addNewGameListingButton").addEventListener("click", function() {
    let gameEntry = new Game(
        document.getElementById("newGameEntry").value,
        document.getElementById("newGameDesigner").value,
        document.getElementById("newGameArtist").value,
        document.getElementById("newGamePublisher").value,
        document.getElementById("newGameYear").value,
        document.getElementById("newGamePlayers").value,
        document.getElementById("newGameTime").value,
        document.getElementById("newGameDifficulty").value,
        document.getElementById("newGameUrl").value,
        document.getElementById("newGamePlayCount").value,
        document.getElementById("newGamePersonalRating").value
    );
    games.push(gameEntry);
    importJson(games);
    createVisual();


});

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

