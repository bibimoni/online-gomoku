const BG_Color = '#35393b'
const socket = io('http://localhost:8080');

socket.on('init', handleInit);
socket.on('gameState', handleGameState)

const gameScreen = document.getElementById('gameScreen');
let canvas, c;
const PATTERN = 30;
const winLine = 5;
GRID_WIDTH = GRID_HEIGHT = 600

init(); 

const gameState = {
    pos : {
        x : -1,
        y : -1
    },
    player1 : true,    
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

board.drawBoard();

function handleGameState() {
    gameState = JSON.parse(gameState);
    requestAnimationFrame(() => {
        board.update(gameState);
    }) 
}