import Game from "./Models/Game.mjs";

const local_Game_History = "SavedGames";

function saveToLocalStorage(game) {
    localStorage.setItem(local_Game_History, game);
}
