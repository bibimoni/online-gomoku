const io = require('socket.io')({
    cors : {
        origin: "*"
    }
});
const { createGameState, gameLoop } = require('./game')
const { FPS } = require('./constants');
const { setInterval } = require('timers/promises');
const { clearInterval } = require('timers');

io.on('connection', client => {
    const state = createGameState();

    startGameInterval(client, state);
})

function startGameInterval(client,  state) {
    const intervalId = setInterval(() => {
        //if this return 1 player 1 wins, 2 means 2 wins, 0 means the game continue
        //3 means the game ends in a draw
        const winner = gameLoop(state);

        if(!winner) {
            client.emit('gameState', JSON.stringify(state))
        }
        else {
            client.emit('gameOver');
            clearInterval(intervalId);
        }

    }, 1000 / FPS)
}
io.listen(8080)