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
    player1,
    player2
} from "./objects.js";

// POSITIONNER UNE PIECE
Board.prototype.setPiece = function (piece) {

    let randomX = Math.floor(Math.random() * board.width);
    let randomY = Math.floor(Math.random() * board.height);

    if (randomX >= this.width || randomY >= this.height) {
        throw new Error('Pièce hors limite');
    }

    if (piece instanceof Obstacle) {

        if (!(this.chartBoard[randomY][randomX] instanceof Obstacle)) {
            this.chartBoard[randomY][randomX] = piece;
        }

    } else if (piece instanceof Weapon) {

        if (!(this.chartBoard[randomY][randomX] instanceof Obstacle) && (!(this.chartBoard[randomY][randomX] instanceof Weapon))) {
            this.chartBoard[randomY][randomX] = piece;
        }

    } else if (piece instanceof Player) {

        if (!(this.chartBoard[randomY][randomX] instanceof Obstacle) &&
            (!(this.chartBoard[randomY][randomX] instanceof Weapon) &&
                (!(this.chartBoard[randomY][randomX] instanceof Player) &&
                    (!(this.chartBoard[randomY][randomX + 1] instanceof Player)) &&
                    (!(this.chartBoard[randomY][randomX - 1] instanceof Player)) &&
                    (!(this.chartBoard[randomY + 1][randomX] instanceof Player)) &&
                    (!(this.chartBoard[randomY - 1][randomX] instanceof Player))))) {

            this.chartBoard[randomY][randomX] = piece;
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

    const piece1 = board.setPiece(player1);
    const piece2 = board.setPiece(player2);

};
board.setPlayers();