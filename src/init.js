import {
    Board,
    board,
    ctx,
    drawBoard
} from "./board.js";

import {
    Obstacle,
    lavaArray,
    Weapon,
    weaponArray,
    Player,
    playerArray
} from "./objects.js";

// POSITIONNER UNE PIECE
Board.prototype.setPiece = function (piece) {

    let randomX = Math.floor(Math.random() * board.width);
    let randomY = Math.floor(Math.random() * board.height);
    
    let drawX = randomX * 64;
    let drawY = randomY * 64;
    

    if (randomX >= this.width || randomY >= this.height) {
        throw new Error('Pièce hors limite');
    }

    if (piece instanceof Obstacle) {

        if (!(this.chartBoard[randomY][randomX] instanceof Obstacle)) {
            this.chartBoard[randomY][randomX] = piece;
//            ctx.fillRect(drawX, drawY,64,64);
              let image = piece.sprite;
              ctx.drawImage(image, drawX, drawY);
        }

    } else if (piece instanceof Weapon) {

        if (!(this.chartBoard[randomY][randomX] instanceof Obstacle) && (!(this.chartBoard[randomY][randomX] instanceof Weapon))) {
            this.chartBoard[randomY][randomX] = piece;
            ctx.fillStyle = "red";
            ctx.fillRect(drawX, drawY,64,64);
        }

    } else if (piece instanceof Player) {
        
            if  (!(this.chartBoard[randomY][randomX] instanceof Obstacle) &&
                (!(this.chartBoard[randomY][randomX] instanceof Weapon) &&
                (!(this.chartBoard[randomY][randomX] instanceof Player) &&
                ((!(this.chartBoard[randomY][randomX + 1] instanceof Player)) || (typeof this.chartBoard[randomY][randomX + 1] === undefined)) &&
                ((!(this.chartBoard[randomY][randomX - 1] instanceof Player)) || (typeof this.chartBoard[randomY][randomX - 1] === undefined)) &&
                ((!(this.chartBoard[randomY + 1][randomX] instanceof Player)) || (typeof this.chartBoard[randomY + 1][randomX] === undefined)) &&
                ((!(this.chartBoard[randomY - 1][randomX] instanceof Player)) || (typeof this.chartBoard[randomY - 1][randomX] === undefined))))) {
                
                this.chartBoard[randomY][randomX] = piece;
                ctx.fillStyle = "blue";
                ctx.fillRect(drawX, drawY,64,64);
            }

    } else {
        throw new Error('Pièce non valide');
    }
};


// PLACER OBSTACLES
Board.prototype.setObstacles = function () {
    for (let lava of lavaArray) {

        const obstacle = board.setPiece(lava);
    }
};
board.setObstacles();


// PLACER ARMES
Board.prototype.setWeapons = function () {
    let numWeapons = 4;
    let randomWeapon;
    let spawnWeapon;

    for (let i = 0; i < numWeapons; i++) {
        randomWeapon = Math.floor(Math.random() * weaponArray.length);
        spawnWeapon = board.setPiece(weaponArray[randomWeapon]);
    }
};
board.setWeapons();


// PLACER JOUEURS
Board.prototype.setPlayers = function () {
    
    for (let player of playerArray) {
        
        const spawnPlayer = board.setPiece(player);
    }
};
board.setPlayers();