/* LOGIQUE DU JEU */

'use strict'

const Obstacle = require('./obstacle.js');
const Player = require('./player.js');
const Weapon = require('./weapon.js');

    
module.exports = Game;


function Game(width, height) {
    this.width = width;
    this.height = height;

    this.forbiddenPosition = [];

    this.chartBoard = this.resetBoard();

    this.generateGame();
}


Game.prototype.resetBoard = function () {
    const chartBoard = [];

    // Création du plateau logique
    for (let i = 0; i < this.width; i++) {
        const row = [];
        chartBoard.push(row);
        for (let j = 0; j < this.height; j++) {
            const col = {};
            row.push(col);
        }
    }
    return chartBoard;
};


Game.prototype.generateGame = function () {

    // GENERER INSTANCES
    const lava = new Obstacle("Lave");
    const lava1 = new Obstacle("Lave1");
    const lava2 = new Obstacle("Lave2");
    const lava3 = new Obstacle("Lave3");
    const lava4 = new Obstacle("Lave4");
    const lava5 = new Obstacle("Lave5");
    const lava6 = new Obstacle("Lave6");
    const lava7 = new Obstacle("Lave7");
    const lava8 = new Obstacle("Lave8");
    const lava9 = new Obstacle("Lave9");
    const obstacleArray = [lava, lava1, lava2, lava3, lava4, lava5, lava6, lava7, lava8, lava9];

    const dagger = new Weapon("Dague", 5);
    const sword = new Weapon("Epée", 10);
    const axe = new Weapon("Hache", 15);
    const flail = new Weapon("Fléau", 20);
    const weaponArray = [dagger, sword, axe, flail];

    let randomWeapons = this.getRandomWeapons(4, weaponArray);

    let pieceToSetArray = obstacleArray.concat(randomWeapons);

    // GENERER INSTANCES
    this.player1 = new Player("Joueur 1", 100, dagger);
    this.player2 = new Player("Joueur 2", 100, dagger);
    const playerArray = [this.player1, this.player2];


    this.setObstaclesWeapons(pieceToSetArray);
    this.setPlayers(playerArray);
};

// CHOISIR ALEATOIREMENT 4 ARMES
Game.prototype.getRandomWeapons = function (maxWeapons, array) {
    const randomWeaponsArray = [];

    for (let i = 0; i < maxWeapons; i++) {
        let randomWeapon = Math.floor(Math.random() * array.length);
        randomWeaponsArray.push(array[randomWeapon]);
    }
    return randomWeaponsArray;
};

// GENERER UNE POSITION POUR UNE PIECE
Game.prototype.generatePieceLocation = function (forbiddenPosition) {
    let location;
    do {
        location = this.generateRandomLocation();
    }
    while (this.isPositionInArray(location, forbiddenPosition));

    return location;
};

// GENERER UNE POSITION POUR UN JOUEUR
Game.prototype.generatePlayerLocation = function (forbiddenPosition) {
    let location;
    do {
        location = this.generateRandomLocation();
    }
    while (this.isPositionInArray(location, forbiddenPosition) || !this.isLocationCorrectForPlayer(location));

    return location;
};

Game.prototype.generateRandomLocation = function () {
    return {
        x: Math.floor(Math.random() * this.width),
        y: Math.floor(Math.random() * this.height)
    };
};

// POSITIONNER UNE PIECE
Game.prototype.setPiece = function (piece, location) {
    if (location.x >= this.width || location.y >= this.height) {
        throw new Error('Pièce hors limite');
    } else {
        if (piece instanceof Player) {
            piece.setLocation(location);
        }
        this.chartBoard[location.y][location.x] = piece;
        this.forbiddenPosition.push(location);
    }
};


// PLACER OBSTACLES ET ARMES
Game.prototype.setObstaclesWeapons = function (piecesToSetArray) {
    for (let piece of piecesToSetArray) {
        const location = this.generatePieceLocation(this.forbiddenPosition);
        this.setPiece(piece, location);
    }
};

// PLACER JOUEURS
Game.prototype.setPlayers = function (playerArray) {
    for (let player of playerArray) {
        const location = this.generatePlayerLocation(this.forbiddenPosition);

        this.setPiece(player, location);
    }
};

Game.prototype.isLocationCorrectForPlayer = function (location) {
    const {
        x,
        y
    } = location;

    if (location.y === 0) {
        if (this.chartBoard[y][x + 1] instanceof Player ||
            this.chartBoard[y + 1][x] instanceof Player ||
            this.chartBoard[y][x - 1] instanceof Player) {
            return false;
        }
    } else if (location.y === 9) {
        if (this.chartBoard[y][x + 1] instanceof Player ||
            this.chartBoard[y - 1][x] instanceof Player ||
            this.chartBoard[y][x - 1] instanceof Player) {
            return false;
        }
    } else if (location.x === 0) {
        if (this.chartBoard[y][x + 1] instanceof Player ||
            this.chartBoard[y + 1][x] instanceof Player ||
            this.chartBoard[y - 1][x] instanceof Player) {
            return false;
        }
    } else if (location.x === 9) {
        if (this.chartBoard[y + 1][x] instanceof Player ||
            this.chartBoard[y - 1][x] instanceof Player ||
            this.chartBoard[y][x - 1] instanceof Player) {
            return false;
        }
    } else {
        if (this.chartBoard[y][x + 1] instanceof Player ||
            this.chartBoard[y + 1][x] instanceof Player ||
            this.chartBoard[y - 1][x] instanceof Player ||
            this.chartBoard[y][x - 1] instanceof Player) {
            return false;
        }
    }
    return true;
};


Game.prototype.isPositionInArray = function (position, array) {
    return array.some((elem) => {
        return (elem.x === position.x && elem.y === position.y);
    });
};

Game.prototype.getChartBoard = function () {
    return this.chartBoard;
};

Game.prototype.getPlayer1 = function () {
    return this.player1;
};

Game.prototype.getPlayer2 = function () {
    return this.player2;
};

const game = new Game(10,10);


    // ETAPE 2


// POUR LE FICHIER CONTROL.JS
const $ = require("jquery");

$(document).on('keypress', function (e) {
    if (e.which == 13) {
        Game.prototype.incrementTurn();
        e.stopPropagation();
    }
});

$(document).on('keydown', function (e) {
    if (e.which == 37) {
        Game.prototype.movePlayerLeft(availableSquareX, activePlayer);
        e.stopPropagation();
    }
    if (e.which == 38) {
        Game.prototype.movePlayerUp(availableSquareY, activePlayer);
        e.stopPropagation();
    }
    if (e.which == 39) {
        Game.prototype.movePlayerRight(availableSquareX, activePlayer);
        e.stopPropagation();
    }
    if (e.which == 40) {
        Game.prototype.movePlayerDown(availableSquareY, activePlayer);
        e.stopPropagation();
    }
});


let turnNumber = 0;
let activePlayer;
let availableSquareX = [];
let availableSquareY = [];



Game.prototype.doTurn = function (activePlayer) {

    this.checkAvailableSquares(activePlayer);
    
};


Game.prototype.incrementTurn = function () {
    turnNumber++;
    this.switchTurn(turnNumber, game.getPlayer1(), game.getPlayer2());
    return turnNumber;
};

    // Rajouter attribut this.turn = 1 à l'objet Game
Game.prototype.switchTurn = function (turnNumber, player1, player2) {
    console.log(turnNumber);
    
    if (turnNumber % 2 === 0) {
        activePlayer = player1;
        console.log(activePlayer);
        this.checkAvailableSquaresX(availableSquareX, activePlayer);
        this.checkAvailableSquaresY(availableSquareY, activePlayer);
        return activePlayer;
        
    } else if (turnNumber % 2 === 1) {
        activePlayer = player2;
        console.log(activePlayer);
        this.checkAvailableSquaresX(availableSquareX, activePlayer);
        this.checkAvailableSquaresY(availableSquareY, activePlayer);
        return activePlayer;
    } 
};



Game.prototype.checkAvailableSquaresX = function (availableSquareX, activePlayer) {

    const plusX3 = activePlayer.location.x + 3;
    const minusX3 = activePlayer.location.x - 3;
    
    for (let x = activePlayer.location.x; x >= minusX3; x--) {
        if (!(x instanceof Player || x instanceof Obstacle)) {
            availableSquareX.unshift([x, activePlayer.location.y]);
        }
    }
    
    for (let x = activePlayer.location.x; x <= plusX3; x++) {
        if (!(x instanceof Player || x instanceof Obstacle)) {
            availableSquareX.push([x, activePlayer.location.y]);
        }
    }
    
    availableSquareX.splice(3,2);
    console.log(availableSquareX);
    return availableSquareX;
};

Game.prototype.checkAvailableSquaresY = function (availableSquareY, activePlayer) {

    const plusY3 = activePlayer.location.y + 3;
    const minusY3 = activePlayer.location.y - 3;
    
    for (let y = activePlayer.location.y; y >= minusY3; y--) {
        if (!(y instanceof Player || y instanceof Obstacle)) {
            availableSquareY.unshift([activePlayer.location.x, y]);
        }
    }
    
    for (let y = activePlayer.location.y; y <= plusY3; y++) {
        if (!(y instanceof Player || y instanceof Obstacle)) {
            availableSquareY.push([activePlayer.location.x, y]);
        }
    }
    
    availableSquareY.splice(3,2);
    console.log(availableSquareY);
    return availableSquareY;
};

Game.prototype.movePlayerLeft = function (availableSquareX, activePlayer) {

    const locationPlayer = [];
    locationPlayer.push([activePlayer.location.x, activePlayer.location.y]);
    
    const limitBoard = availableSquareX[0];
    console.log(limitBoard);
    
    let newLocation;
    
    if (locationPlayer > limitBoard) {
        newLocation = activePlayer.location.x -= 1;
        console.log(activePlayer.location);
        return newLocation;
    }
};

Game.prototype.movePlayerUp = function (availableSquareY, activePlayer) {
    
    const locationPlayer = [];
    locationPlayer.push([activePlayer.location.x, activePlayer.location.y]);
    
    const limitBoard = availableSquareY[0];
    console.log(limitBoard);
    
    let newLocation;
    
    if (locationPlayer > limitBoard) {
        const newLocation = activePlayer.location.y -= 1;
        console.log(activePlayer.location);
        return newLocation;
    }
};

Game.prototype.movePlayerRight = function (availableSquareX, activePlayer) {
    
    const locationPlayer = [];
    locationPlayer.push([activePlayer.location.x, activePlayer.location.y]);
    
    const limitBoard = availableSquareX[5];
    console.log(limitBoard);
    
    let newLocation;
    
    if (locationPlayer < limitBoard) {
        newLocation = activePlayer.location.x += 1;
        console.log(activePlayer.location);
        return newLocation;
    }
};

Game.prototype.movePlayerDown = function (availableSquareY, activePlayer) {
    
    const locationPlayer = [];
    locationPlayer.push([activePlayer.location.x, activePlayer.location.y]);
    
    const limitBoard = availableSquareY[5];
    console.log(limitBoard);
    
    let newLocation;
    
    if (locationPlayer < limitBoard) {
        const newLocation = activePlayer.location.y += 1;
        console.log(activePlayer.location);
        return newLocation;
    }
};



Game.prototype.walkOnWeapon = function (activePlayer) {
    // Est-ce que objet player et weapon sur même case ?

    // Si instanceOf Player (pendant tour activePlayer) sur même case instanceOf Weapon ?
};

Game.prototype.switchWeapon = function (activePlayer) {
    // walkOnWeapon
    // Changer l'arme du joueur (mise à jour de l'instance)

    // Remplacer le this.weapon de l'instance par la nouvelle arme

};