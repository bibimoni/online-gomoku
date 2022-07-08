const BG_Color = '#35393b'

const socket = io('http://localhost:8080');
socket.on('init', handleInit);
const gameScreen = document.getElementById('gameScreen');
let canvas, c;
const PATTERN = 3;
const winLine = 3;
GRID_WIDTH = GRID_HEIGHT = 600
init(); 

const gameState = {
    player : {
        pos : {
            x : 3,
            y : 10
        }
    },
    gridSize : 15
}

function init() {
    canvas = document.getElementById('canvas');
    c = canvas.getContext('2d');

    canvas.width = canvas.height = 600;

    document.addEventListener('keydown', (e) => {
        console.log(e.keyCode);
    });
}

function handleInit(msg) {
    console.log(msg)
}
let board = new Board({
    boardWidth: PATTERN, 
    boardHeight: PATTERN,
    imageSrc: './img/XO.png',
    requireLineLength: winLine
})
board.initializeBoard();
board.Board = [
    [0, 0, 0],
    [0, 0, 1],
    [2, 0, 1]
]
board.drawBoard();
animationLoop();
function animationLoop() {
    window.requestAnimationFrame(animationLoop);
    board.update();
}