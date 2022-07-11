class Board {
    constructor({ boardWidth, boardHeight, imageSrc, requireLineLength }) {
        const K = 0.29 / 200;
        this.width = boardWidth;
        this.height = boardHeight;
        this.image = new Image();
        this.image.src = imageSrc;
        this.Board = new Array(this.width).fill(0); //board is an 2D array
        //scale = K * 1/number of tie * pixel of the board
        this.scale = K * (1 / this.width) * GRID_WIDTH; // 0,29 is suitable for 600 by 600 GRID with 3 ties
        this.currentImage = 0;
        this.requireLineLength = requireLineLength;
        this.drawing = false;
        //2 end point if there is a 5 in a row
        this.win_r1 = -1; this.win_r2 = -1; this.win_c1 = -1; this.win_c2 = -1;
    }

    initializeBoard() {
        // 2D array, 1 represents x, 2 represents o, 0 doesn't represent anything
        // so we need to fill the array with 0 to start  
        for (let i = 0; i < this.width; i++) {
            this.Board[i] = new Array(this.height).fill(0);
        }
    }
    drawBoard() {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                (i + j) % 2 === 0 ? c.fillStyle = '#635170' : c.fillStyle = 'pink';
                c.fillRect(i * GRID_WIDTH / this.width, j * GRID_HEIGHT / this.height, GRID_WIDTH / this.width, GRID_HEIGHT / this.height)
            }
        }
    }
    draw() {
        const boardX = GRID_WIDTH;
        const boardY = GRID_HEIGHT;

        //set the ratio between default grid value 600 and current grid value 
        const K = GRID_WIDTH / 600;

        // this is the different X-offset that will 
        //be added to the draw function specific for the O tie
        //making it fits nicely on the board 
        let AdjustedOffsetForTheOTie = 56 * (1 / this.width) * K;

        const defaultOffset = 24;
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                // when the indexes is 0, 
                //dont draw anything or set the frame on the current image to nothing
                if (this.Board[i][j] === 0) this.currentImage = 2;
                //the X tie
                else
                    if (this.Board[i][j] === 1) this.currentImage = 1;
                    //the O tie    
                    else
                        if (this.Board[i][j] === 2) this.currentImage = 0;

                c.drawImage(this.image,
                    this.currentImage * (this.image.width / 2),
                    0,
                    (this.image.width / 2),
                    this.image.height,
                    //x,y coordinates is determined by the d efault 
                    //offset for 600 x 600, 3 ties * 1/tie * pixel of the board
                    //plus the coordinates of the current tie which is calculated 
                    //by multiplying the index of the board with (pixel of the board / number of ties)
                    i * (boardX / this.width) + defaultOffset * (1 / this.width) * K + ((this.currentImage !== 0) ? 0 : AdjustedOffsetForTheOTie),
                    j * (boardY / this.height) + defaultOffset * (1 / this.height) * K,
                    (this.image.width) * this.scale,
                    this.image.width * this.scale
                )
            }
        }
    }
    drawWinLine() {
        const GRID_SIZE = (GRID_WIDTH / this.width);
        //horizontal
        c.fillStyle = 'green';
        if (this.win_c1 === this.win_c2) {
            for (let i = this.win_r2; i <= this.win_r1; i++) {
                c.fillRect(i * GRID_SIZE, this.win_c1 * GRID_SIZE, GRID_SIZE, GRID_SIZE);
            }
        }

        //vertical
        else if (this.win_r1 === this.win_r2) {
            for (let i = this.win_c2; i <= this.win_c1; i++) {
                c.fillRect(this.win_r1 * GRID_SIZE, i * GRID_SIZE, GRID_SIZE, GRID_SIZE);
            }
        }
        //diagonal
        else if (this.win_c2 !== this.win_c1 && this.win_r1 !== this.win_r2) {
            //diagonal 1 bottom -> top
            if (this.win_c2 > this.win_c1) {                    
                let b = this.win_c2;
                for (let a = this.win_r2; a <= this.win_r1; a++) {
                    c.fillRect(a * GRID_SIZE, b * GRID_SIZE, GRID_SIZE, GRID_SIZE);
                    b--;
                }
            }
            else if (this.win_c2 < this.win_c1) {
                let b = this.win_c2;
                for (let a = this.win_r2; a <= this.win_r1; a++) {
                    c.fillRect(a * GRID_SIZE, b * GRID_SIZE, GRID_SIZE, GRID_SIZE);
                    b++;
                }
            }
            //diagonal 2 top -> bottom
        }
    }
    checkWin(playerId, lastMove) {

        if (this.countMove(playerId, lastMove.x, lastMove.y, 1, 1) >= 5) return true;
        if (this.countMove(playerId, lastMove.x, lastMove.y, 1, -1) >= 5) return true;
        if (this.countMove(playerId, lastMove.x, lastMove.y, 1, 0) >= 5) return true;
        if (this.countMove(playerId, lastMove.x, lastMove.y, 0, 1) >= 5) return true;

        this.win_r1 = -1; this.win_r2 = -1; this.win_c1 = -1; this.win_c2 = -1;
        return false;

    }
    //count the length of a player's row
    countMove(playerId, lastMoveRow, lastMoveColumn, directionRow, directionColumn) {
        let currentLine = 1;

        let r = lastMoveRow + directionRow;
        let c = lastMoveColumn + directionColumn;
        while (this.legalSquare(r, c) && this.Board[r][c] === playerId) {
            currentLine++;
            r += directionRow;
            c += directionColumn;
        }
        //set the end point to the last checked square
        //because on the while loop above we added dRow and dColumn so when currLine = 5
        //r c is added 1 extra time, so we need to subtract(add for the bottom) dRow and dColumn 
        this.win_r1 = r - directionRow; this.win_c1 = c - directionColumn;

        r = lastMoveRow - directionRow;
        c = lastMoveColumn - directionColumn;
        while (this.legalSquare(r, c) && this.Board[r][c] === playerId) {
            currentLine++;
            r -= directionRow;
            c -= directionColumn;
        }
        //the other end
        this.win_r2 = r + directionRow; this.win_c2 = c + directionColumn;

        return currentLine;
    }
    //check draw method by using the 0 element of the board array
    checkDraw() {
        for (let i = 0; i < this.width; i++)
            for (let j = 0; j < this.height; j++) {
                if (this.Board[i][j] === 0) {
                    this.drawing = false;
                    return;
                }
            }
        this.drawing = true;
    }

    legalSquare(r, c) {
        return r < this.width && c < this.width && r >= 0 && c >= 0;
    }
    //take the game state object and change it to 2d array board position
    handleGameState(gameState) {
        let tie = 0;
        // if the game is not ended place the tie depends on the player 
        (gameState.player1 && this.win_r1 === -1) ? tie = 1 : tie = 2;
        this.board[gameState.pos.x][gameState.pos.y] = tie;   
    }

    update(gameState) {
        this.handleGameState(gameState)
        this.drawWinLine();
        this.draw();
        this.checkDraw();
    }
}






class Player {

    constructor({ win, firstTurn, id, boardWidth, boardHeight }) {
        this.boardWidth = boardWidth;
        this.boardHeight = boardHeight;
        this.win = win;
        this.canPlace = firstTurn; // if the first turn is available, the player can place X/O
        this.id = id
        this.translatedMousePosition = { x: 0, y: 0 };
        this.placeTieSuccess = false;
        this.moves = [];
        this.lastMove = undefined;
        this.isWinning = false;
    }
    performAction() {
        if (this.isWinning === false && board.drawing === false) {
            this.updateBoard();
            this.isWinning = board.checkWin(this.id, this.lastMove);
            //if player wins, stop the game
        }
    }
    // taking mouse position and translate it into indexes of the board
    mouseBoardPosition() {
        let translated = { x: 0, y: 0 }
        let boardX = GRID_WIDTH;
        let boardY = GRID_HEIGHT;
        for (let i = 0; i < this.boardWidth; i++) {
            if (mouseCurrentPosition.x >= i * (boardX / this.boardWidth) && mouseCurrentPosition.x < (i + 1) * (boardX / this.boardWidth)) {
                translated.x = i;
            }
        }
        for (let i = 0; i < this.boardHeight; i++) {
            if (mouseCurrentPosition.y >= i * (boardY / this.boardHeight) && mouseCurrentPosition.y < (i + 1) * (boardY / this.boardHeight)) {
                translated.y = i;
            }
        }
        return translated
    }
    updateBoard() {
        if (board.Board[this.mouseBoardPosition().x][this.mouseBoardPosition().y] === 0
            && this.isWinning === false
            && board.drawing === false) {
            board.Board[this.mouseBoardPosition().x][this.mouseBoardPosition().y] = this.id;
            this.placeTieSuccess = true;
            //push the success move into the moves array
            this.lastMove = {
                x: this.mouseBoardPosition().x,
                y: this.mouseBoardPosition().y
            }
            this.moves.push(this.lastMove);
        }
    }
}
