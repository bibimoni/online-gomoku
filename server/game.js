const {GRID_SIZE} = require('./constants');

module.exports = {
    createGameState,
    gameLoop
}

function createGameState() {
    return {
        pos : {
            x : -1,
            y : -1
        },
        player1 : true
    }
}

gameLoop(state) {

}