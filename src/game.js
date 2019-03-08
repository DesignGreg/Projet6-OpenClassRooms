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
    this.combatMoves = 0;

    // 2 tableaux pour simplifier la gestion du mouvement sur les deux axes
    this.availableSquaresX = [];
    this.availableSquaresY = [];
    // Un tableau joint pour simplifier la gestion de l'affichage des cases disponibles
    this.availableSquares = [];

    this.forbiddenPosition = [];

    this.chartBoard = this.resetBoard();

    this.generateGame();
    this.activePlayer = this.player1;
    this.waitingPlayer = this.player2;

    this.isFighting = false;
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

    const spear = new Weapon("Lance", 10);
    const scepter = new Weapon("Sceptre", 20);
    const sword = new Weapon("Epée", 30);
    const axe = new Weapon("Hache", 40);
    const weaponArray = [spear, sword, scepter, axe];

    let randomWeapons = this.getRandomWeapons(4, weaponArray);

    let pieceToSetArray = obstacleArray.concat(randomWeapons);

    // GENERER INSTANCES
    this.player1 = new Player("Lucifer", 100, spear);
    this.player2 = new Player("Michael", 100, spear);
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
            //            if (destination instanceof Weapon) {
            //                piece.takeWeapon(destination);
            //            }
            // Possible de laisser l'arme précédente, deuxième attribut objet Player
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

Game.prototype.getAvailableSquares = function () {
    return this.availableSquares;
};

Game.prototype.getActivePlayer = function () {
    return this.activePlayer;
};

//Game.prototype.getIsFighting = function () {
//    return this.isFighting;
//};


// ETAPE 2


// Incrémentation du tour de jeu
Game.prototype.incrementTurn = function () {
    this.turnNumber++;
};

// Valeur du nombre de déplacement possibles
Game.prototype.setTurnMovesValue = function (value) {
    this.moves = value;
};

Game.prototype.switchTurn = function () {

    if (this.turnNumber % 2 === 0) {
        this.activePlayer = this.player1;
        this.waitingPlayer = this.player2;

        console.log(this.activePlayer);

        this.checkAvailableSquaresX();
        this.checkAvailableSquaresY();

    } else if (this.turnNumber % 2 === 1) {
        this.activePlayer = this.player2;
        this.waitingPlayer = this.player1;

        console.log(this.activePlayer);

        this.checkAvailableSquaresX(location);
        this.checkAvailableSquaresY();

    }
    this.setTurnMovesValue(3);
    this.setCombatMovesValue(1);
    this.setCombatStance();
    return this.activePlayer;
};

Game.prototype.checkAvailableSquaresX = function () {

    this.availableSquaresX = [];
    const plusX3 = this.activePlayer.location.x + 3;
    const minusX3 = this.activePlayer.location.x - 3;
    const y = this.activePlayer.location.y;


    //    for (let x = minusX3; x <= plusX3; x++) {
    //
    //        if (minusX3 >= 0 && plusX3 <= 9) {
    //            // Regarde si la case jusqu'à -3, est une instance de l'objet Player ou Obstacle
    //            if (!(this.chartBoard[y][x] instanceof Player || this.chartBoard[y][x] instanceof Obstacle)) {
    //                this.availableSquaresX.unshift([x, this.activePlayer.location.y]);
    //                // Arrête la boucle la case est une l'autre joueur ou une instance d'Obstacle
    //            } else if (this.chartBoard[y][x] === this.waitingPlayer || this.chartBoard[y][x] instanceof Obstacle) {
    //                break;
    //            }
    //        } else if (minusX3 < 0 || plusX3 > 9) {
    //            if (!(x < 0 || x > 9)) {
    //                if (!(this.chartBoard[y][x] instanceof Player || this.chartBoard[y][x] instanceof Obstacle)) {
    //                    this.availableSquaresX.unshift([x, this.activePlayer.location.y]);
    //                } else if (this.chartBoard[y][x] === this.waitingPlayer || this.chartBoard[y][x] instanceof Obstacle) {
    //                    break;
    //                }
    //            }
    //        }
    //    }


    for (let x = this.activePlayer.location.x; x >= minusX3; x--) {

        if (minusX3 >= 0) {
            // Regarde si la case jusqu'à -3, est une instance de l'objet Player ou Obstacle
            if (!(this.chartBoard[y][x] instanceof Obstacle)) {
                this.availableSquaresX.unshift([x, this.activePlayer.location.y]);
                // Arrête la boucle la case est une l'autre joueur ou une instance d'Obstacle
            } else if (this.chartBoard[y][x] === this.waitingPlayer || this.chartBoard[y][x] instanceof Obstacle) {
                break;
            }
        } else if (minusX3 < 0) {
            if (!(x < 0 || x > 9)) {
                if (!(this.chartBoard[y][x] instanceof Player || this.chartBoard[y][x] instanceof Obstacle)) {
                    this.availableSquaresX.unshift([x, this.activePlayer.location.y]);
                } else if (this.chartBoard[y][x] === this.waitingPlayer || this.chartBoard[y][x] instanceof Obstacle) {
                    break;
                }
            }
        }
    }

    for (let x = this.activePlayer.location.x; x <= plusX3; x++) {

        if (plusX3 <= 9) {
            if (!(this.chartBoard[y][x] instanceof Obstacle)) {
                this.availableSquaresX.push([x, this.activePlayer.location.y]);
            } else if (this.chartBoard[y][x] === this.waitingPlayer || this.chartBoard[y][x] instanceof Obstacle) {
                break;
            }
        } else if (plusX3 > 9) {
            if (!(x < 0 || x > 9)) {
                if (!(this.chartBoard[y][x] instanceof Player || this.chartBoard[y][x] instanceof Obstacle)) {
                    this.availableSquaresX.push([x, this.activePlayer.location.y]);
                } else if (this.chartBoard[y][x] === this.waitingPlayer || this.chartBoard[y][x] instanceof Obstacle) {
                    break;
                }
            }
        }
    }

    return this.availableSquaresX;
};

Game.prototype.checkAvailableSquaresY = function () {

    this.availableSquaresY = [];
    const plusY3 = this.activePlayer.location.y + 3;
    const minusY3 = this.activePlayer.location.y - 3;
    const x = this.activePlayer.location.x;


    //    for (let y = minusY3; y <= plusY3; y++) {
    //
    //        if (minusY3 >= 0 && plusY3 <= 9) {
    //            if (!(this.chartBoard[y][x] instanceof Player || this.chartBoard[y][x] instanceof Obstacle)) {
    //                this.availableSquaresY.unshift([this.activePlayer.location.x, y]);
    //            } else if (this.chartBoard[y][x] === this.waitingPlayer || this.chartBoard[y][x] instanceof Obstacle) {
    //                break;
    //            }
    //        } else if (minusY3 < 0 || plusY3 > 0) {
    //            if (!(y < 0 || y > 9)) {
    //                if (!(this.chartBoard[y][x] instanceof Player || this.chartBoard[y][x] instanceof Obstacle)) {
    //                    this.availableSquaresY.unshift([this.activePlayer.location.x, y]);
    //                } else if (this.chartBoard[y][x] === this.waitingPlayer || this.chartBoard[y][x] instanceof Obstacle) {
    //                    break;
    //                }
    //            }
    //        }
    //    }

    for (let y = this.activePlayer.location.y; y >= minusY3; y--) {

        if (minusY3 >= 0) {
            if (!(this.chartBoard[y][x] instanceof Obstacle)) {
                this.availableSquaresY.unshift([this.activePlayer.location.x, y]);
            } else if (this.chartBoard[y][x] === this.waitingPlayer || this.chartBoard[y][x] instanceof Obstacle) {
                break;
            }
        } else if (minusY3 < 0) {
            if (!(y < 0 || y > 9)) {
                if (!(this.chartBoard[y][x] instanceof Player || this.chartBoard[y][x] instanceof Obstacle)) {
                    this.availableSquaresY.unshift([this.activePlayer.location.x, y]);
                } else if (this.chartBoard[y][x] === this.waitingPlayer || this.chartBoard[y][x] instanceof Obstacle) {
                    break;
                }
            }
        }
    }

    for (let y = this.activePlayer.location.y; y <= plusY3; y++) {

        if (plusY3 <= 9) {
            if (!(this.chartBoard[y][x] instanceof Obstacle)) {
                this.availableSquaresY.push([this.activePlayer.location.x, y]);
            } else if (this.chartBoard[y][x] === this.waitingPlayer || this.chartBoard[y][x] instanceof Obstacle) {
                break;
            }
        } else if (plusY3 > 9) {
            if (!(y < 0 || y > 9)) {
                if (!(this.chartBoard[y][x] instanceof Player || this.chartBoard[y][x] instanceof Obstacle)) {
                    this.availableSquaresY.unshift([this.activePlayer.location.x, y]);
                } else if (this.chartBoard[y][x] === this.waitingPlayer || this.chartBoard[y][x] instanceof Obstacle) {
                    break;
                }
            }
        }
    }

    this.concatAvailableSquaresArrays();
    return this.availableSquaresY;
};

// Pour pusher la position de activePlayer dans le tableau de cases disponibles. Plus utilisée.
//Game.prototype.addPlayerLocationToArray = function (array) {
//    const locationPlayer = [];
//    locationPlayer.push([this.activePlayer.location.x, this.activePlayer.location.y]);
//
//    // Pour intégrer l'emplacement du joueur si pas déjà dans le tableau de cases disponibles. Donc parfois des doublons
//    if (!(array.some(a => a.toString() === locationPlayer.toString()))) {
//        array.push([this.activePlayer.location.x, this.activePlayer.location.y]);
//    };
//};

// Utilisée pour afficher les cases disponibles au mouvement, pas pour gérer le mouvement directement
Game.prototype.concatAvailableSquaresArrays = function () {
    this.availableSquares = this.availableSquaresX.concat(this.availableSquaresY);
    console.log(this.availableSquaresX);
    console.log(this.availableSquaresY);
    console.log(this.availableSquares);
};

// Pour comparer l'emplacement du joueur aux cases disponibles, qu'il ne se déplace que parmi ces cases
Game.prototype.isCompareLocationPlayerToArray = function (array) {
    const locationPlayer = [];
    locationPlayer.push([this.activePlayer.location.x, this.activePlayer.location.y]);

    console.log(locationPlayer);

    return array.some(a => a.toString() === locationPlayer.toString());
}

//Game.prototype.movePlayer = function (yValue, xValue, playerLocation, limitValueLocation, changeLocationValue) {
//    
//    const isPlayerOnAvailableSquares = this.isCompareLocationPlayerToArray(this.availableSquaresY);
//
//    const x = this.activePlayer.location.x;
//    const y = this.activePlayer.location.y;
//
//    if (isPlayerOnAvailableSquares && this.moves > 0 && (!(this.chartBoard[yValue][xValue] instanceof Obstacle)) && playerLocation !== limitValueLocation && this.chartBoard[y][x] !== this.waitingPlayer) {
//        this.chartBoard[y][x] = {};
//        playerLocation = changeLocationValue;
//        console.log(playerLocation);
//        this.chartBoard[yValue][xValue] = this.activePlayer;
//        this.walkOnWeapon();
//        this.moves--;
//        this.checkIfPlayerAdjacent();
//    }
//};
//
//// Argument Not Defined
//
//Game.prototype.movePlayerLeft = function () {
//    const x = this.activePlayer.location.x;
//    const y = this.activePlayer.location.y;
//    
//    this.movePlayer (y, x-1, this.activePlayer.location.x, 0, this.activePlayer.location.x-1);
//};
//
//Game.prototype.movePlayerUp = function () {
//    const x = this.activePlayer.location.x;
//    const y = this.activePlayer.location.y;
//    
//    this.movePlayer (y-1, x, this.activePlayer.location.y, 0, this.activePlayer.location.y-1);
//};
//
//Game.prototype.movePlayerRight = function () {
//    const x = this.activePlayer.location.x;
//    const y = this.activePlayer.location.y;
//    
//    this.movePlayer (y, x+1, this.activePlayer.location.x, 9, this.activePlayer.location.x+1);
//};
//
//Game.prototype.movePlayerDown = function () {
//    const x = this.activePlayer.location.x;
//    const y = this.activePlayer.location.y;
//    
//    this.movePlayer (y+1, x, this.activePlayer.location.y, 9, this.activePlayer.location.y+1);
//};

Game.prototype.movePlayerLeft = function () {

    // essayer de finir comme ça
    // movePlayerLeft = seulement la location
    // chaque déplacement de location push dans un array (activeSquare) qui est get par une fonction d'affichage pour la représenter
    // quand déplacement effectif (touche entrée), alors les valeurs de la location passent en chartBoard, et le déplacement devient effectif
    // Si instanceof Weapon sur l'une des cases entre la location d'origine et la nouvelle, cette arme remplace la prédédente
    // L'ancienne arme devient secondaryWeapon (pas utilisée en combat) qui sera déposée une fois un nouveau déplacement effectuée

    const isPlayerOnAvailableSquares = this.isCompareLocationPlayerToArray(this.availableSquaresX);

    const x = this.activePlayer.location.x;
    const y = this.activePlayer.location.y;

    if (isPlayerOnAvailableSquares && this.moves > 0 && (!(this.chartBoard[y][x - 1] instanceof Obstacle)) && this.activePlayer.location.x !== 0 && this.chartBoard[y][x - 1] !== this.waitingPlayer) {
        this.dropWeapon();
        this.activePlayer.location.x -= 1;
        this.walkOnWeapon();
        this.chartBoard[y][x - 1] = this.activePlayer;
        this.moves--;
        this.checkIfPlayerAdjacent();
    }
};

Game.prototype.movePlayerUp = function () {

    const isPlayerOnAvailableSquares = this.isCompareLocationPlayerToArray(this.availableSquaresY);

    const x = this.activePlayer.location.x;
    const y = this.activePlayer.location.y;

    if (isPlayerOnAvailableSquares && this.moves > 0 && (!(this.chartBoard[y - 1][x] instanceof Obstacle)) && this.activePlayer.location.y !== 0 && this.chartBoard[y - 1][x] !== this.waitingPlayer) {
        this.dropWeapon();
        this.activePlayer.location.y -= 1;
        this.walkOnWeapon();
        this.chartBoard[y - 1][x] = this.activePlayer;
        this.moves--;
        this.checkIfPlayerAdjacent();
    }
};

Game.prototype.movePlayerRight = function () {

    const isPlayerOnAvailableSquares = this.isCompareLocationPlayerToArray(this.availableSquaresX);

    const x = this.activePlayer.location.x;
    const y = this.activePlayer.location.y;

    if (isPlayerOnAvailableSquares && this.moves > 0 && (!(this.chartBoard[y][x + 1] instanceof Obstacle)) && this.activePlayer.location.x !== 9 && this.chartBoard[y][x + 1] !== this.waitingPlayer) {
        this.dropWeapon();
        this.activePlayer.location.x += 1;
        this.walkOnWeapon();
        this.chartBoard[y][x + 1] = this.activePlayer;
        this.moves--;
        this.checkIfPlayerAdjacent();
    }
};

Game.prototype.movePlayerDown = function () {

    const isPlayerOnAvailableSquares = this.isCompareLocationPlayerToArray(this.availableSquaresY);

    const x = this.activePlayer.location.x;
    const y = this.activePlayer.location.y;

    if (isPlayerOnAvailableSquares && this.moves > 0 && (!(this.chartBoard[y + 1][x] instanceof Obstacle)) && this.activePlayer.location.y !== 9 && this.chartBoard[y + 1][x] !== this.waitingPlayer) {
        this.dropWeapon();
        this.activePlayer.location.y += 1;
        this.walkOnWeapon();
        this.chartBoard[y + 1][x] = this.activePlayer;
        this.moves--;
        this.checkIfPlayerAdjacent();
    }
};

// Vérifier si une arme est présente sur la case d'arrivée du joueur
Game.prototype.walkOnWeapon = function () {

    const x = this.activePlayer.location.x;
    const y = this.activePlayer.location.y;

    if (this.chartBoard[y][x] instanceof Weapon) {
        this.activePlayer.secondaryWeapon = this.activePlayer.weapon;
        this.activePlayer.weapon = this.chartBoard[y][x];

    }
};

// Lâcher l'arme secondaire s'il y en a une, et à défaut remettre vide la case de départ du joueur
Game.prototype.dropWeapon = function () {

    const x = this.activePlayer.location.x;
    const y = this.activePlayer.location.y;

    if (this.activePlayer.secondaryWeapon instanceof Weapon) {
        this.chartBoard[y][x] = this.activePlayer.secondaryWeapon;
        this.activePlayer.secondaryWeapon = {};
    } else {
        // Remet à l'état vide la case de départ du joueur
        this.chartBoard[y][x] = {};
    }
}



// ETAPE 3

Game.prototype.checkIfPlayerAdjacent = function () {

    const x = this.activePlayer.location.x;
    const y = this.activePlayer.location.y;

    if (this.activePlayer.location.x === 0) {
        if (this.chartBoard[y - 1][x] === this.waitingPlayer || this.chartBoard[y][x + 1] === this.waitingPlayer || this.chartBoard[y + 1][x] === this.waitingPlayer) {
            this.isFighting = true;
        }
    } else if (this.activePlayer.location.x === 9) {
        if (this.chartBoard[y][x - 1] === this.waitingPlayer || this.chartBoard[y - 1][x] === this.waitingPlayer || this.chartBoard[y + 1][x] === this.waitingPlayer) {
            this.isFighting = true;
        }
    } else if (this.activePlayer.location.y === 0) {
        if (this.chartBoard[y][x - 1] === this.waitingPlayer || this.chartBoard[y][x + 1] === this.waitingPlayer || this.chartBoard[y + 1][x] === this.waitingPlayer) {
            this.isFighting = true;
        }
    } else if (this.activePlayer.location.y === 9) {
        if (this.chartBoard[y][x - 1] === this.waitingPlayer || this.chartBoard[y - 1][x] === this.waitingPlayer || this.chartBoard[y][x + 1] === this.waitingPlayer) {
            this.isFighting = true;
        }
    } else {
        if (this.chartBoard[y][x - 1] === this.waitingPlayer || this.chartBoard[y - 1][x] === this.waitingPlayer || this.chartBoard[y][x + 1] === this.waitingPlayer || this.chartBoard[y + 1][x] === this.waitingPlayer) {
            this.isFighting = true;
        }
    }
};

Game.prototype.setCombatMovesValue = function (value) {
    this.combatMoves = value;
};

Game.prototype.setCombatStance = function () {
    
    if (this.waitingPlayer.order === "Attaque") {
        this.activePlayer.order = 'Posture';
        this.waitingPlayer.order = 'Posture';
    }
}

Game.prototype.fight = function () {
    // Appelée par attack() et defend() pour appliquer les résultats (perte PV ou bonus %)
    if (this.activePlayer.order === 'Attaque' && this.waitingPlayer.health >= 0) {
        if (this.waitingPlayer.order === 'Attaque' || this.waitingPlayer.order === 'Posture') {
            this.waitingPlayer.health -= this.activePlayer.weapon.damage;
            if (this.waitingPlayer.health < 0) {
                this.waitingPlayer.health = 0;
            }
        } else if (this.waitingPlayer.order === 'Défense') {
            this.waitingPlayer.health -= this.activePlayer.weapon.damage / 2
            if (this.waitingPlayer.health < 0) {
                this.waitingPlayer.health = 0;
            }
        }
    }
};

Game.prototype.attack = function () {
    // dégâts en fonction de l'arme
    if (this.combatMoves >= 1) {
        this.activePlayer.order = 'Attaque';
        this.combatMoves--;
        this.fight();
    }
};

Game.prototype.defend = function () {
    // renvoie un true, si true, joueur encaisse 50% de dégâts en moins
    if (this.combatMoves >= 1) {
        this.activePlayer.order = 'Défense';
        this.combatMoves--;
    }
}

Game.prototype.endGame = function () {
    // Si un joueur = 0PV, fin de partie.
    if (this.waitingPlayer.health <= 0) {
        
    }

    // Les valeurs affichées à l'écran du joueur perdant disparaissent, et celles du joueur gagnant clignote quelques secondes, avant que le DOM redémarre

    // Appeler une fonction de Board pour mettre à jour le DOM, afficher à nouveau le bouton Start et les règles du jeu, pour permettre de relancer une partie

}