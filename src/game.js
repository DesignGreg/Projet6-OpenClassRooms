/* LOGIQUE DU JEU */

'use strict'

const Obstacle = require('./obstacle.js');
const Player = require('./player.js');
const Weapon = require('./weapon.js');


module.exports = Game;



// ETAPE 1
/* 
Commencez par générer aléatoirement la carte du jeu. Chaque case peut être soit : Vide / Inaccessible (grisée)
Sur la carte, un nombre limité d’armes (4 maximum) sera placé aléatoirement et pourra être récolté par les joueurs qui passeraient dessus.
Vous inventerez au moins 4 types d’arme dans le jeu, avec des dégâts différents. L’arme par défaut qui équipe les joueurs doit infliger 10 points de dégâts. Chaque arme a un nom et un visuel associé.
Le placement des deux joueurs est lui aussi aléatoire sur la carte au chargement de la partie. Ils ne doivent pas se toucher (ils ne peuvent pas être côte à côte).
*/


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
    // Pour faciliter le repérage du joueur actif et passif
    this.activePlayer = this.player1;
    this.waitingPlayer = this.player2;
    // Pour empêcher retour arrière, les autres mouvements passant à false
    this.moveLeft = true;
    this.moveUp = true;
    this.moveRight = true;
    this.moveDown = true;
    // Bloque les mouvements quand passe à true et active les ordres de combat
    this.isFighting = false;
    // Permet de lancer l'écran de fin avec la touche entrée
    this.end = false;

    // Les emplacements déjà pris par d'autres éléments du jeu
    this.forbiddenPosition = [];

    this.chartBoard = this.resetBoard();
    this.generateGame();
}

// (0) GENERER LE PLATEAU LOGIQUE
Game.prototype.resetBoard = function () {
    const chartBoard = [];

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

// (0) GENERER LE JEU AU LANCEMENT
Game.prototype.generateGame = function () {

    // Création des instances
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

    // Les 4 armes générées aléatoirement par getRandomWeapons()
    let randomWeapons = this.getRandomWeapons(4, weaponArray);
    // les deux tableaux d'obstacles et d'armes fusionnés et utilisés par setObstaclesWeapons()
    let pieceToSetArray = obstacleArray.concat(randomWeapons);

    // GENERER INSTANCES
    // this afin d'y accéder partout
    this.player1 = new Player("Lucifer", 100, spear);
    this.player2 = new Player("Michael", 100, spear);
    const playerArray = [this.player1, this.player2];


    this.setObstaclesWeapons(pieceToSetArray);
    this.setPlayers(playerArray);
};

// (1) CHOISIR ALEATOIREMENT 4 ARMES
Game.prototype.getRandomWeapons = function (maxWeapons, array) {
    const randomWeaponsArray = [];

    for (let i = 0; i < maxWeapons; i++) {
        let randomWeapon = Math.floor(Math.random() * array.length);
        randomWeaponsArray.push(array[randomWeapon]);
    }
    return randomWeaponsArray;
};

// (2) GENERER UNE POSITION POUR UNE PIECE
Game.prototype.generatePieceLocation = function (forbiddenPosition) {
    let location;
    do {
        location = this.generateRandomLocation();
    }
    // tant que la location générée correspond à une forbiddenPosition
    while (this.isPositionInArray(location, forbiddenPosition));

    return location;
};

// (2) GENERER UNE POSITION POUR UN JOUEUR
Game.prototype.generatePlayerLocation = function (forbiddenPosition) {
    let location;
    do {
        location = this.generateRandomLocation();
    }
    while (this.isPositionInArray(location, forbiddenPosition) || !this.isLocationCorrectForPlayer(location));

    return location;
};

// (3) GENERER UN EMPLACEMENT ALEATOIRE
Game.prototype.generateRandomLocation = function () {
    return {
        x: Math.floor(Math.random() * this.width),
        y: Math.floor(Math.random() * this.height)
    };
};

// (2) POSITIONNER UNE PIECE, QUELLE QU'ELLE SOIT
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

// (1) PLACER OBSTACLES ET ARMES
Game.prototype.setObstaclesWeapons = function (piecesToSetArray) {
    for (let piece of piecesToSetArray) {
        const location = this.generatePieceLocation(this.forbiddenPosition);
        this.setPiece(piece, location);
    }
};

// (1) PLACER JOUEURS
Game.prototype.setPlayers = function (playerArray) {
    for (let player of playerArray) {
        const location = this.generatePlayerLocation(this.forbiddenPosition);
        this.setPiece(player, location);
    }
};

// (3) Vérifie qu'il n'y a pas l'autre joueur sur une case adjacente au moment du placement
Game.prototype.isLocationCorrectForPlayer = function (location) {
    const {
        x,
        y
    } = location;
    
    // Conditions pour gérer les bords
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

// (3) Vérifie si position est dans le tableau (forbiddenPosition)
Game.prototype.isPositionInArray = function (position, array) {
    return array.some((elem) => {
        return (elem.x === position.x && elem.y === position.y);
    });
};

// Getters pour accéder à certaines propriétés de l'objet Game
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



// ETAPE 2
/*
A chaque tour, un joueur peut se déplacer d’une à trois cases (horizontalement ou verticalement) avant de terminer son tour. Il ne peut évidemment pas passer à travers un obstacle.
Si un joueur passe sur une case contenant une arme, il laisse son arme actuelle sur place et la remplace par la nouvelle.
*/


// (4, appelée depuis Board, touche Entrée) PASER AU TOUR SUIVANT ET DETECTER QUI EST LE JOUEUR ACTIF
Game.prototype.switchTurn = function () {

    if (this.turnNumber % 2 === 0) {
        this.activePlayer = this.player1;
        this.waitingPlayer = this.player2;

        console.log(this.activePlayer);

        this.checkAvailableSquaresX();
        this.checkAvailableSquaresY();
        this.resetMovement();

    } else if (this.turnNumber % 2 === 1) {
        this.activePlayer = this.player2;
        this.waitingPlayer = this.player1;

        console.log(this.activePlayer);

        this.checkAvailableSquaresX();
        this.checkAvailableSquaresY();
        this.resetMovement();
    }
    
    this.setTurnMovesValue(3);
    this.setCombatMovesValue(1);
    this.setCombatStance();
    return this.activePlayer;
};

// (4, appelée depuis Board, touche Entrée) INCREMENTER LE TOUR DE JEU
Game.prototype.incrementTurn = function () {
    this.turnNumber++;
};

// (5) FIXER LA VALEUR DU NOMBRE DE MOUVEMENTS POSSIBLES PAR TOUR
Game.prototype.setTurnMovesValue = function (value) {
    this.moves = value;
};

// (5) REMETTRE SUR TRUE TOUS LES MOUVEMENTS AU DEBUT DE CHAQUE TOUR
Game.prototype.resetMovement = function () {
    this.moveLeft = true;
    this.moveUp = true;
    this.moveRight = true;
    this.moveDown = true;
};

// (5) VERIFIER LES CASES DISPONIBLES AU MOUVEMENT SUR L'AXE HORIZONTAL
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
            if (!(this.chartBoard[y][x] instanceof Player || this.chartBoard[y][x] instanceof Obstacle)) {
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
            if (!(this.chartBoard[y][x] instanceof Player || this.chartBoard[y][x] instanceof Obstacle)) {
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
    
    this.addPlayerLocationToArray(this.availableSquaresX);
    return this.availableSquaresX;
};

// (5) VERIFIER LES CASES DISPONIBLES AU MOUVEMENT SUR L'AXE VERTICAL
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
            if (!(this.chartBoard[y][x] instanceof Player || this.chartBoard[y][x] instanceof Obstacle)) {
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
            if (!(this.chartBoard[y][x] instanceof Player || this.chartBoard[y][x] instanceof Obstacle)) {
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
    this.addPlayerLocationToArray(this.availableSquaresY);
    this.concatAvailableSquaresArrays();
    return this.availableSquaresY;
};


// (6) PUSHER L'EMPLACEMENT DU JOUEUR ACTIF SI PAS DEJA DANS LE TABLEAU DE CASES DISPONIBLES
Game.prototype.addPlayerLocationToArray = function (array) {
    const locationPlayer = [];
    locationPlayer.push([this.activePlayer.location.x, this.activePlayer.location.y]);
    // Nécessaire au mouvement puisque vérification que le mouvement doit être sur une case autorisée, celle de départ incluse
    // Avoir la case de départ en doublon permet un trait légèrement plus gras à l'affichage, mettant en valeur la case où se situe le joueur
    if (!(array.some(a => a.toString() === locationPlayer.toString()))) {
        array.push([this.activePlayer.location.x, this.activePlayer.location.y]);
    };
};

// (6) FUSIONNER LES DEUX TABLEAUX DE CASES DISPONIBLES EN X ET Y. UTILISE POUR L'AFFICHAGE
Game.prototype.concatAvailableSquaresArrays = function () {
    this.availableSquares = this.availableSquaresX.concat(this.availableSquaresY);
    console.log(this.availableSquaresX);
    console.log(this.availableSquaresY);
};

// (8) COMPARER L'EMPLACEMENT DU JOUEUR AU TABLEAU DE CASES DISPONIBLES
Game.prototype.isCompareLocationPlayerToArray = function (array) {
    const locationPlayer = [];
    locationPlayer.push([this.activePlayer.location.x, this.activePlayer.location.y]);

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

// (7, appelée depuis Board, touche flèche de gauche) DEPLACER LE JOUEUR VERS LA GAUCHE
Game.prototype.movePlayerLeft = function () {

    const isPlayerOnAvailableSquares = this.isCompareLocationPlayerToArray(this.availableSquaresX);

    const x = this.activePlayer.location.x;
    const y = this.activePlayer.location.y;

    if (this.activePlayer.location.x > 0) {
        if (isPlayerOnAvailableSquares && this.moves > 0 && (!(this.chartBoard[y][x - 1] instanceof Obstacle)) && this.activePlayer.location.x !== 0 && this.chartBoard[y][x - 1] !== this.waitingPlayer) {
            this.setPreviousSquareAsWeaponOrEmpty();
            this.activePlayer.location.x -= 1;
            this.walkOnWeapon();
            this.chartBoard[y][x - 1] = this.activePlayer;
            this.checkIfPlayerAdjacent();
            this.moves--;
            this.moveUp = false;
            this.moveRight = false;
            this.moveDown = false;
        }
    } else {
        // Si le joueur est sur 0 et pour l'empêcher de sortir du plateau
        if (isPlayerOnAvailableSquares && this.moves > 0 && this.activePlayer.location.x !== 0) {
            this.setPreviousSquareAsWeaponOrEmpty();
            this.activePlayer.location.x -= 1;
            this.walkOnWeapon();
            this.chartBoard[y][x - 1] = this.activePlayer;
            this.checkIfPlayerAdjacent();
            this.moves--;
            this.moveUp = false;
            this.moveRight = false;
            this.moveDown = false;
        }
    }
};

// (7, appelée depuis Board, touche flèche du haut) DEPLACER LE JOUEUR VERS LE HAUT
Game.prototype.movePlayerUp = function () {

    const isPlayerOnAvailableSquares = this.isCompareLocationPlayerToArray(this.availableSquaresY);

    const x = this.activePlayer.location.x;
    const y = this.activePlayer.location.y;

    if (this.activePlayer.location.y > 0) {
        if (isPlayerOnAvailableSquares && this.moves > 0 && (!(this.chartBoard[y - 1][x] instanceof Obstacle)) && this.activePlayer.location.y !== 0 && this.chartBoard[y - 1][x] !== this.waitingPlayer) {
            this.setPreviousSquareAsWeaponOrEmpty();
            this.activePlayer.location.y -= 1;
            this.walkOnWeapon();
            this.chartBoard[y - 1][x] = this.activePlayer;
            this.checkIfPlayerAdjacent();
            this.moves--;
            this.moveLeft = false;
            this.moveRight = false;
            this.moveDown = false;
        }
    } else {
        if (isPlayerOnAvailableSquares && this.moves > 0 && this.activePlayer.location.y !== 0) {
            this.setPreviousSquareAsWeaponOrEmpty();
            this.activePlayer.location.y -= 1;
            this.walkOnWeapon();
            this.chartBoard[y - 1][x] = this.activePlayer;
            this.checkIfPlayerAdjacent();
            this.moves--;
            this.moveLeft = false;
            this.moveRight = false;
            this.moveDown = false;
        }
    }
};

// (7, appelée depuis Board, touche flèche de droite) DEPLACER LE JOUEUR VERS LA DROITE
Game.prototype.movePlayerRight = function () {

    const isPlayerOnAvailableSquares = this.isCompareLocationPlayerToArray(this.availableSquaresX);

    const x = this.activePlayer.location.x;
    const y = this.activePlayer.location.y;

    if (this.activePlayer.location.x < 9) {
        if (isPlayerOnAvailableSquares && this.moves > 0 && (!(this.chartBoard[y][x + 1] instanceof Obstacle)) && this.activePlayer.location.x !== 9 && this.chartBoard[y][x + 1] !== this.waitingPlayer) {
            this.setPreviousSquareAsWeaponOrEmpty();
            this.activePlayer.location.x += 1;
            this.walkOnWeapon();
            this.chartBoard[y][x + 1] = this.activePlayer;
            this.checkIfPlayerAdjacent();
            this.moves--;
            this.moveLeft = false;
            this.moveUp = false;
            this.moveDown = false;
        }
    } else {
        if (isPlayerOnAvailableSquares && this.moves > 0 && this.activePlayer.location.x !== 9) {
            this.setPreviousSquareAsWeaponOrEmpty();
            this.activePlayer.location.x += 1;
            this.walkOnWeapon();
            this.chartBoard[y][x + 1] = this.activePlayer;
            this.checkIfPlayerAdjacent();
            this.moves--;
            this.moveLeft = false;
            this.moveUp = false;
            this.moveDown = false;
        }
    }
};

// (7, appelée depuis Board, touche flèche du bas) DEPLACER LE JOUEUR VERS LE BAS
Game.prototype.movePlayerDown = function () {

    const isPlayerOnAvailableSquares = this.isCompareLocationPlayerToArray(this.availableSquaresY);

    const x = this.activePlayer.location.x;
    const y = this.activePlayer.location.y;

    if (this.activePlayer.location.y < 9) {
        if (isPlayerOnAvailableSquares && this.moves > 0 && (!(this.chartBoard[y + 1][x] instanceof Obstacle)) && this.activePlayer.location.y !== 9 && this.chartBoard[y + 1][x] !== this.waitingPlayer) {
            this.setPreviousSquareAsWeaponOrEmpty();
            this.activePlayer.location.y += 1;
            this.walkOnWeapon();
            this.chartBoard[y + 1][x] = this.activePlayer;
            this.checkIfPlayerAdjacent();
            this.moves--;
            this.moveLeft = false;
            this.moveUp = false;
            this.moveRight = false;
        }
    } else {
        if (isPlayerOnAvailableSquares && this.moves > 0 && this.activePlayer.location.y !== 9) {
            this.setPreviousSquareAsWeaponOrEmpty();
            this.activePlayer.location.y += 1;
            this.walkOnWeapon();
            this.chartBoard[y + 1][x] = this.activePlayer;
            this.checkIfPlayerAdjacent();
            this.moves--;
            this.moveLeft = false;
            this.moveUp = false;
            this.moveRight = false;
        }
    }
};

// (8) VERIFIER SI UNE ARME EST PRESENTE SUR LA CASE D'ARRIVEE DU JOUEUR
Game.prototype.walkOnWeapon = function () {

    const x = this.activePlayer.location.x;
    const y = this.activePlayer.location.y;

    if (this.chartBoard[y][x] instanceof Weapon) {
        // Intervertit l'arme actuelle du joueur avec celle qu'il vient de trouver
        this.activePlayer.secondaryWeapon = this.activePlayer.weapon;
        this.activePlayer.weapon = this.chartBoard[y][x];

    }
};

// (8) LACHER L'ARME SECONDAIRE S'IL Y EN A UNE, OU REMETTRE LA CASE DE DEPART COMME OBJET VIDE
Game.prototype.setPreviousSquareAsWeaponOrEmpty = function () {

    const x = this.activePlayer.location.x;
    const y = this.activePlayer.location.y;

    if (this.activePlayer.secondaryWeapon instanceof Weapon) {
        this.chartBoard[y][x] = this.activePlayer.secondaryWeapon;
        this.activePlayer.secondaryWeapon = {};
    } else {
        // Remet à l'état vide la case de départ du joueur
        this.chartBoard[y][x] = {};
    }
};



// ETAPE 3
/*
Si les joueurs se croisent sur des cases adjacentes (horizontalement ou verticalement), un combat à mort s’engage.
Lors d'un combat, le fonctionnement du jeu est le suivant :
Chacun attaque à son tour
Les dégâts infligés dépendent de l’arme possédée par le joueur
Le joueur peut choisir d’attaquer ou de se défendre contre le prochain coup
Lorsque le joueur se défend, il encaisse 50% de dégâts en moins qu’en temps normal
Dès que les points de vie d’un joueur (initialement à 100) tombent à 0 , celui-ci a perdu. Un message s’affiche et la partie est terminée.
*/

// (8) VERIFIER SI LE JOUEUR ADVERSE EST ADJACENT 
Game.prototype.checkIfPlayerAdjacent = function () {

    const x = this.activePlayer.location.x;
    const y = this.activePlayer.location.y;
    
    // Pour gérer les bords
    if (this.activePlayer.location.x === 0) {
        // Pour gérer les coins
        if (this.activePlayer.location.y === 0) {
            if (this.chartBoard[y][x + 1] === this.waitingPlayer || this.chartBoard[y + 1][x] === this.waitingPlayer) {
                this.isFighting = true;
            }
        // Pour gérer les coins
        } else if (this.activePlayer.location.y === 9) {
            if (this.chartBoard[y][x + 1] === this.waitingPlayer || this.chartBoard[y - 1][x] === this.waitingPlayer) {
                this.isFighting = true;
            }
        } else {
            if (this.chartBoard[y][x + 1] === this.waitingPlayer || this.chartBoard[y - 1][x] === this.waitingPlayer || this.chartBoard[y + 1][x] === this.waitingPlayer) {
                this.isFighting = true;
            }
        }
    } else if (this.activePlayer.location.x === 9) {
        if (this.activePlayer.location.y === 0) {
            if (this.chartBoard[y][x - 1] === this.waitingPlayer || this.chartBoard[y + 1][x] === this.waitingPlayer) {
                this.isFighting = true;
            }
        } else if (this.activePlayer.location.y === 9) {
             if (this.chartBoard[y][x - 1] === this.waitingPlayer || this.chartBoard[y - 1][x] === this.waitingPlayer) {
                this.isFighting = true;
            }      
        } else {
            if (this.chartBoard[y][x - 1] === this.waitingPlayer || this.chartBoard[y - 1][x] === this.waitingPlayer || this.chartBoard[y + 1][x] === this.waitingPlayer) {
                this.isFighting = true;
            }
        }
    } else if (this.activePlayer.location.y === 0) {
        if (this.activePlayer.location.x === 0) {
            if (this.chartBoard[y][x + 1] === this.waitingPlayer || this.chartBoard[y + 1][x] === this.waitingPlayer) {
                this.isFighting = true;
            }
        } else if (this.activePlayer.location.x === 9) {
           if (this.chartBoard[y][x - 1] === this.waitingPlayer || this.chartBoard[y + 1][x] === this.waitingPlayer) {
                this.isFighting = true;
            } 
        } else {
            if (this.chartBoard[y][x - 1] === this.waitingPlayer || this.chartBoard[y][x + 1] === this.waitingPlayer || this.chartBoard[y + 1][x] === this.waitingPlayer) {
                this.isFighting = true;
            }
        }
    } else if (this.activePlayer.location.y === 9) {
        if (this.activePlayer.location.x === 0) {
           if (this.chartBoard[y - 1][x] === this.waitingPlayer || this.chartBoard[y][x + 1] === this.waitingPlayer) {
                this.isFighting = true;
            } 
        } else if (this.activePlayer.location.x === 9) {
            if (this.chartBoard[y][x - 1] === this.waitingPlayer || this.chartBoard[y - 1][x] === this.waitingPlayer) {
                this.isFighting = true;
            } 
        } else {
            if (this.chartBoard[y][x - 1] === this.waitingPlayer || this.chartBoard[y - 1][x] === this.waitingPlayer || this.chartBoard[y][x + 1] === this.waitingPlayer) {
                this.isFighting = true;
            } 
        }
    } else if (this.activePlayer.location.x !== 0 && this.activePlayer.location.x !== 9 && this.activePlayer.location.y !== 0 && this.activePlayer.location.y !== 9) {
        if (this.chartBoard[y][x - 1] === this.waitingPlayer || this.chartBoard[y - 1][x] === this.waitingPlayer || this.chartBoard[y][x + 1] === this.waitingPlayer || this.chartBoard[y + 1][x] === this.waitingPlayer) {
            this.isFighting = true;
        }
    }
};

// (5) FIXER LE NOMBRE D'ACTIONS DE COMBAT PAR TOUR
Game.prototype.setCombatMovesValue = function (value) {
    this.combatMoves = value;
};

// (5) REMETTRE LA POSTURE DU JOUEUR ACTIF A POSTURE EN DEBUT DE TOUR
Game.prototype.setCombatStance = function () {
    this.activePlayer.order = 'Posture';
};

// (6, appelée depuis Board, touche A) ATTAQUER LE JOUEUR ADVERSE
Game.prototype.attack = function () {
    // dégâts en fonction de l'arme
    if (this.combatMoves >= 1) {
        this.activePlayer.order = 'Attaque';
        this.combatMoves--;
        this.fight();
    }
};

// (6, appelée depuis Board, touche D) PRENDRE UNE POSITION DE DEFENSE
Game.prototype.defend = function () {
    // renvoie un true, si true, joueur encaisse 50% de dégâts en moins
    if (this.combatMoves >= 1) {
        this.activePlayer.order = 'Défense';
        this.combatMoves--;
    }
};

// (7) GERER LA PHASE DE COMBAT SI LE JOUEUR ATTAQUE, ET EN FONCTION DE LA POSTURE ADVERSE
Game.prototype.fight = function () {
    // Appelée par attack() et defend() pour appliquer les résultats (perte PV ou bonus %)
    if (this.activePlayer.order === 'Attaque' && this.waitingPlayer.health >= 0) {
        if (this.waitingPlayer.order === 'Attaque' || this.waitingPlayer.order === 'Posture') {
            this.waitingPlayer.health -= this.activePlayer.weapon.damage;
            this.endGame();
            if (this.waitingPlayer.health < 0) {
                this.waitingPlayer.health = 0;
            }
        } else if (this.waitingPlayer.order === 'Défense') {
            this.waitingPlayer.health -= this.activePlayer.weapon.damage / 2
            this.endGame();
            if (this.waitingPlayer.health < 0) {
                this.waitingPlayer.health = 0;
            }
        }
    }
};

// (8) METTRE FIN AU JEU UNE FOIS UN JOUEUR VAINCU
Game.prototype.endGame = function () {
    // Si un joueur = 0PV, fin de partie.
    if (this.waitingPlayer.health <= 0) {
        this.end = true;
    }
};