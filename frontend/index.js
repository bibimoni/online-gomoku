const BG_Color = '#35393b'

const socket = io('http://localhost:8080');
socket.on('init', handleInit);
const gameScreen = document.getElementById('gameScreen');
let canvas, c;

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
    c.fillStyle = BG_Color;
    c.fillRect(0, 0, canvas.width, canvas.height);

    document.addEventListener('keydown', (e) => {
        console.log(e.keyCode);
    });
}

init(); 

function handleInit(msg) {
    console.log(msg)
}