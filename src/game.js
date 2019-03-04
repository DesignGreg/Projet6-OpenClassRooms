/* LOGIQUE DU JEU */

'use strict'

const Obstacle = require('./obstacle.js');
const Player = require('./player.js');
const Weapon = require('./weapon.js');


module.exports = Game;


function Game(width, height) {
    this.width = width;
    this.height = height;

    this.turnNumber = 0;
    this.moves = 0;

    this.availableSquaresX = [];
    this.availableSquaresY = [];
    this.availableSquares = [];

    this.forbiddenPosition = [];

    this.chartBoard = this.resetBoard();

    this.generateGame();
    this.activePlayer = this.player1;
    this.waitingPlayer = this.player2;
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
    this.player1 = new Player("Lucifer", 100, dagger);
    this.player2 = new Player("Michael", 100, dagger);
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

// Vérifie si position est dans le tableau (forbiddenPosition)
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


// ETAPE 2


// Peut-être inutile
//Game.prototype.doTurn = function () {
//
//    this.checkAvailableSquares();
//
//};

Game.prototype.switchTurn = function () {

    if (this.turnNumber % 2 === 0) {
        this.activePlayer = this.player1;
        this.waitingPlayer = this.player2;
        
        console.log(this.activePlayer);
        
        this.checkAvailableSquaresX();
        this.checkAvailableSquaresY();
        
        this.turnNumber++;
        return this.activePlayer;

    } else if (this.turnNumber % 2 === 1) {
        this.activePlayer = this.player2;
        this.waitingPlayer = this.player1;
        
        console.log(this.activePlayer);
        
        this.checkAvailableSquaresX(location);
        this.checkAvailableSquaresY();
        
        this.turnNumber++;
        return this.activePlayer;
    }
};

Game.prototype.checkAvailableSquaresX = function () {

    this.availableSquaresX = [];
    const plusX3 = this.activePlayer.location.x + 3;
    const minusX3 = this.activePlayer.location.x - 3;
    const y = this.activePlayer.location.y;

    for (let x = this.activePlayer.location.x; x >= minusX3; x--) {

        if (minusX3 >= 0) {
            if (!(this.chartBoard[y][x] instanceof Player || this.chartBoard[y][x] instanceof Obstacle)) {
                this.availableSquaresX.unshift([x, this.activePlayer.location.y]);
            } else if (this.chartBoard[y][x] === this.waitingPlayer || this.chartBoard[y][x] instanceof Obstacle) {
                break;
            }
        } else if (minusX3 < 0) {
            if (!(x < 0 || x > 9)) {
                this.availableSquaresX.unshift([x, this.activePlayer.location.y]);
            }
        }
    }

    for (let x = this.activePlayer.location.x; x <= plusX3; x++) {

        if (plusX3 <= 9) {
            if (!(this.chartBoard[y][x] instanceof Player || this.chartBoard[y][x] instanceof Obstacle)) {
                this.availableSquaresX.push([x, this.activePlayer.location.y]);
            } else if (this.chartBoard[y][x] === this.waitingPlayer || this.chartBoard[y][x] instanceof Obstacle) {
                break;
            }
        } else if (plusX3 > 9) {
            if (!(x < 0 || x > 9)) {
                this.availableSquaresX.push([x, this.activePlayer.location.y]);
            }
        }
    }
    
    this.addPlayerLocationToArray(this.availableSquaresX);
    return this.availableSquaresX;
};

Game.prototype.checkAvailableSquaresY = function () {

    this.availableSquaresY = [];
    const plusY3 = this.activePlayer.location.y + 3;
    const minusY3 = this.activePlayer.location.y - 3;
    const x = this.activePlayer.location.x;
    
    for (let y = this.activePlayer.location.y; y >= minusY3; y--) {

        if (minusY3 >= 0) {
            if (!(this.chartBoard[y][x] instanceof Player || this.chartBoard[y][x] instanceof Obstacle)) {
                this.availableSquaresY.unshift([this.activePlayer.location.x, y]);
            } else if (this.chartBoard[y][x] === this.waitingPlayer || this.chartBoard[y][x] instanceof Obstacle) {
                break;
            }
        } else if (minusY3 < 0) {
            if (!(y < 0 || y > 9)) {
                this.availableSquaresY.unshift([this.activePlayer.location.x, y]);
            }
        }
    }

    for (let y = this.activePlayer.location.y; y <= plusY3; y++) {

        if (plusY3 <= 9) {
            if (!(this.chartBoard[y][x] instanceof Player || this.chartBoard[y][x] instanceof Obstacle)) {
                this.availableSquaresY.push([this.activePlayer.location.x, y]);
            } else if (this.chartBoard[y][x] === this.waitingPlayer || this.chartBoard[y][x] instanceof Obstacle) {
                break;
            }
        } else if (plusY3 > 9) {
            if (!(y < 0 || y > 9)) {
                this.availableSquaresY.push([this.activePlayer.location.x, y]);
            }
        }
    }
    
    this.setTurnMovesValue(3);
    
    this.addPlayerLocationToArray(this.availableSquaresY);
    
    this.concatAvailableSquaresArrays();
    return this.availableSquaresY;
};

Game.prototype.setTurnMovesValue = function (value) {
    this.moves = value;
};

Game.prototype.addPlayerLocationToArray = function (array) {
    const locationPlayer = [];
    locationPlayer.push([this.activePlayer.location.x, this.activePlayer.location.y]);
    
    if (!(array.some(a => a.toString() === locationPlayer.toString()))) {
        array.push([this.activePlayer.location.x, this.activePlayer.location.y]);
    };
};

// Utilisé pour afficher les cases disponibles au mouvement, pas pour gérer le mouvement directement
Game.prototype.concatAvailableSquaresArrays = function () {
    this.availableSquares = this.availableSquaresX.concat(this.availableSquaresY);
    console.log(this.availableSquares);
};

Game.prototype.compareLocationPlayerToArray = function (array) {
    
    const locationPlayer = [];
    locationPlayer.push([this.activePlayer.location.x, this.activePlayer.location.y]);
    
    return array.some(a => a.toString() === locationPlayer.toString());
}

Game.prototype.movePlayerLeft = function () {
    
    const locationPlayer = [];
    locationPlayer.push([this.activePlayer.location.x, this.activePlayer.location.y]);
    const result = this.compareLocationPlayerToArray(this.availableSquaresX);
    
    const x = this.activePlayer.location.x;
    const y = this.activePlayer.location.y;
    
    console.log(locationPlayer);

    if (result && this.moves > 0) {
        if (locationPlayer >= this.availableSquaresX[1]) {
            this.activePlayer.location.x -= 1;
            this.chartBoard[y][x] = this.activePlayer;
            this.walkOnWeapon();
            this.moves--;
            console.log(result);
        }
    }
};

Game.prototype.movePlayerUp = function () {
    
    const locationPlayer = [];
    locationPlayer.push([this.activePlayer.location.x, this.activePlayer.location.y]);
    const result = this.compareLocationPlayerToArray(this.availableSquaresY);
    
    const x = this.activePlayer.location.x;
    const y = this.activePlayer.location.y;
    
    console.log(locationPlayer);

    if (result && this.moves > 0) {
        if (locationPlayer >= this.availableSquaresX[0]) {
            this.activePlayer.location.y -= 1;
            this.chartBoard[y][x] = this.activePlayer;
            this.walkOnWeapon();
            this.moves--;
            console.log(result);
        }
    }
};

Game.prototype.movePlayerRight = function () {
    
    const locationPlayer = [];
    locationPlayer.push([this.activePlayer.location.x, this.activePlayer.location.y]);
    const result = this.compareLocationPlayerToArray(this.availableSquaresX);
    
    const x = this.activePlayer.location.x;
    const y = this.activePlayer.location.y;
    
    console.log(locationPlayer);

    if (result && this.moves > 0) {
            this.activePlayer.location.x += 1;
            this.chartBoard[y][x] = this.activePlayer;
            this.walkOnWeapon();
            this.moves--;
            console.log(result);
            console.log(this.chartBoard);
    }
};

Game.prototype.movePlayerDown = function () {

    const locationPlayer = [];
    locationPlayer.push([this.activePlayer.location.x, this.activePlayer.location.y]);
    const result = this.compareLocationPlayerToArray(this.availableSquaresY);
    
    const x = this.activePlayer.location.x;
    const y = this.activePlayer.location.y;
    
    console.log(locationPlayer);

    if (result && this.moves > 0) {
            this.activePlayer.location.y += 1;
            this.chartBoard[y][x] = this.activePlayer;
            this.walkOnWeapon();
            this.moves--;
            console.log(result);
    }
};

Game.prototype.walkOnWeapon = function () {
    
    const x = this.activePlayer.location.x;
    const y = this.activePlayer.location.y;
    this.chartBoard[y][x] = this.activePlayer;
    
    // Le joueur laisse son arme actuelle sur la case, et prend celle qui était sur la case
    if (this.chartBoard[y][x] instanceof Weapon) {
        // Arme sur la case devient arme du joueur
        // Arme du joueur devient disponible sur la case
    }

};



// ETAPE 3

Game.prototype.checkIfPlayersAdjacent = function () {
    // Fonction appelée à chaque mouvement, si true, appelle fonction fight()
};

Game.prototype.fight = function () {
    // Supprimer la possibilité de se déplacer, et aussi l'affichage des cases disponibles
    
    // Appelée par attack() et defend() pour appliquer les résultats (perte PV ou bonus %)
    
    // Appel endGame à la fin pour vérifier si un joueur a PV.
};

Game.prototype.attack = function () {
    // dégâts en fonction de l'arme
};

Game.prototype.defend = function () {
    // renvoie un true, si true, joueur encaisse 50% de dégâts en moins
}

Game.prototype.endGame = function () {
    // Si un joueur = 0PV, fin de partie.
    
    // Les valeurs affichées à l'écran du joueur perdant disparaissent, et celles du joueur gagnant clignote quelques secondes, avant que le DOM redémarre
    
    // Appeler une fonction de Board pour mettre à jour le DOM, afficher à nouveau le bouton Start et les règles du jeu, pour permettre de relancer une partie
    
}