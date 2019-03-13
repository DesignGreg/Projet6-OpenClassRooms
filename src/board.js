/* AFFICHAGE */

'use strict'

const $ = require("jquery");

const Game = require('./game.js');
const Weapon = require('./weapon.js');
const Player = require('./player.js');
const Obstacle = require('./obstacle.js');

module.exports = Board;



// ETAPE 1


// CONTEXTE DU CANVAS
const ctx = $('#board').get(0).getContext('2d');

function Board(width, height) {
    this.width = width;
    this.height = height;
    // Lié à l'objet Game
    this.game = new Game(this.width, this.height);
    // Accès au plateau logique
    this.chartBoard = this.game.getChartBoard();
    // Accès aux cases disponibles pour le déplacement afin de les représenter sur le canvas
    this.availableSquares = this.game.getAvailableSquares();
    // Accès au joueur actif
    this.activePlayer = this.game.getActivePlayer();
    // Fonctions appelées au lancement du jeu
    this.scanBoardToSetImages();
    this.hideStartButton();
    this.hideRules();
    this.displayCanvas();
    this.moveInfoPlayers();
    this.initEventListener();
    // Premier tour, avant d'appuyer sur Entrée
    this.game.switchTurn();
    this.showActivePlayer(this.game.getActivePlayer());
    this.showAvailableMovement(this.game.getAvailableSquares(), this.game.getActivePlayer());
}

// (0) SCANNER LE PLATEAU LOGIQUE AFIN DE LOCALISER LES PIECES ET D'Y ASSOCIER LES IMAGES CORRESPONDANTES
Board.prototype.scanBoardToSetImages = function () {
    
    // Efface intégralement le canvas à chaque appel
    ctx.clearRect(0, 0, 640, 640);
    // Dessine la grille
    this.drawBoard();

    //    let joueurNum = 1;
    for (let i = 0; i < this.chartBoard.length; i++) {
        for (let j = 0; j < this.chartBoard[i].length; j++) {
            const piece = this.chartBoard[i][j];
            const location = {
                x: j,
                y: i
            };

            if (piece instanceof Weapon) {
                if (piece.name === "Lance") {
                    this.loadWeaponsPlayersImages(location, '../assets/spear.png');
                } else if (piece.name === "Epée") {
                    this.loadWeaponsPlayersImages(location, '../assets/sword.png');
                } else if (piece.name === "Sceptre") {
                    this.loadWeaponsPlayersImages(location, '../assets/scepter.png');
                } else if (piece.name === "Hache") {
                    this.loadWeaponsPlayersImages(location, '../assets/axe.png');
                }
            } else if (piece instanceof Obstacle) {
                this.loadObstaclesImages(location, '../assets/cloud64.jpg');
            } else if (piece instanceof Player) {
                if (piece.name === "Lucifer") {
                    this.loadWeaponsPlayersImages(location, '../assets/joueur1.png');
                } else {
                    this.loadWeaponsPlayersImages(location, '../assets/joueur2.png');
                }
            }
        }
    }
    this.showActivePlayer(this.game.getActivePlayer());
};

// (1) DESSINER LE PLATEAU
Board.prototype.drawBoard = function () {
    for (let i = 0; i < this.width; i++) {
        for (let j = 0; j < this.height; j++) {
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeRect(j * 64, i * 64, 64, 64);
            ctx.closePath();
        }
    }
};

// (1) PLACER LES IMAGES DES OBSTACLES
Board.prototype.loadObstaclesImages = function (location, path) {

    const drawX = location.x * 64;
    const drawY = location.y * 64;

    const image = new Image();
    image.onload = function () {
        ctx.drawImage(image, drawX, drawY);
    };
    image.src = path;

};

// (1) PLACER LES IMAGES DES ARMES ET JOUEURS
Board.prototype.loadWeaponsPlayersImages = function (location, path) {

    const drawX = [location.x] * 64;
    const drawY = [location.y] * 64;

    const image = new Image();
    image.onload = function () {
        // Pour centrer les images de 32*32
        ctx.drawImage(image, (drawX + (image.width / 2)), (drawY + (image.height / 2)));
    };
    image.src = path;

};

// MODIFIER LE CONTENU GRAPHIQUE AUTOUR DU CANVAS APRES LANCEMENT DU JEU
Board.prototype.hideRules = function () {
    $('.intro').css('display', 'none');
    $('.intro-text').css('display', 'none');
};
Board.prototype.displayCanvas = function () {
    $('#board').css('display', 'block');
    $('#board').addClass('animated slideInUp');
};
Board.prototype.moveInfoPlayers = function () {
    $('.canvas-side--left').css('visibility', 'visible');
    $('.canvas-side--right').css('visibility', 'visible');
    $('.canvas-side--left').addClass('animated slideInLeft');
    $('.canvas-side--right').addClass('animated slideInRight');

    this.displayInfoPlayers(this.game.getPlayer1(), this.game.getPlayer2());
};
Board.prototype.displayInfoPlayers = function (player1, player2) {
    $(".canvas-side--left").html("<h2 class='canvas-side--title canvas-side--left__title'>" + player1.name + "<img class='canvas-side--left__image' src='../assets/joueur1.png'>" + "</h2><p class='canvas-side--health'>" + 'Santé' + ' (' + player1.health + ')' + "</p><p class='canvas-side--weapon'>" + player1.weapon.name + ' (' + player1.weapon.damage + ')' + "</p><p class='canvas-side--order'>" + player1.order + "</p><p class='canvas-side--text'>Entrée = Passer un tour</p><p class='canvas-side--text'>Touches fléchées = déplacement</p><p class='canvas-side--text'>A = attaquer</p><p class='canvas-side--text'>D = se défendre</p>");

    $(".canvas-side--right").html("<h2 class='canvas-side--title canvas-side--right__title'>" + player2.name + "<img class='canvas-side--right__image' src='../assets/joueur2.png'>" + "</h2><p class='canvas-side--health'>" + 'Santé' + ' (' + player2.health + ')' + "</p><p class='canvas-side--weapon'>" + player2.weapon.name + ' (' + player2.weapon.damage + ')' + "</p><p class='canvas-side--order'>" + player2.order + "</p><p class='canvas-side--text'>Entrée = Passer un tour</p><p class='canvas-side--text'>Touches fléchées = déplacement</p><p class='canvas-side--text'>A = attaquer</p><p class='canvas-side--text'>D = se défendre</p>");
};
Board.prototype.hideStartButton = function () {
    $('#start').css('visibility', 'hidden');
};
// A la fin de la partie
Board.prototype.showReloadButton = function () {
    $('#start').css('display', 'none');
    $('#reload').css('display', 'inline-block');
};



// ETAPE 2


// (0) MONTRER LES CASES DISPONIBLES POUR LE DEPLACEMENT
Board.prototype.showAvailableMovement = function (array, player) {

    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length; j++) {

            let x = array[i][0];
            let y = array[i][1];

            if (player == this.game.player1) {
                ctx.strokeStyle = 'darkred';
                ctx.beginPath();
                ctx.lineWidth = 2.5;
                ctx.strokeRect(x * 64, y * 64, 64, 64);
                ctx.closePath();
            } else {
                ctx.strokeStyle = 'navy';
                ctx.beginPath();
                ctx.lineWidth = 2.5;
                ctx.strokeRect(x * 64, y * 64, 64, 64);
                ctx.closePath();
            }


        }
    }
};

// (0) PASSER EN ROUGE LE NOM DU JOUEUR ACTIF
Board.prototype.showActivePlayer = function (player) {

    if (player == this.game.player1) {
        $('.canvas-side--left__title').css('color', 'red');
        $('.canvas-side--right__title').css('color', 'white');
    } else {
        $('.canvas-side--right__title').css('color', 'red');
        $('.canvas-side--left__title').css('color', 'white');
    }
};

// (0) ENREGITRER LES EVENT LISTENERS
Board.prototype.initEventListener = function () {
    // Passage du tour avec la touche Entrée
    $(document).on('keypress', (e) => {
        // Quand les joueurs se déplacent
        if (e.which == 13 && this.game.isFighting === false && this.game.end === false) {
            this.game.incrementTurn();
            this.game.switchTurn();
            this.scanBoardToSetImages();
            this.showAvailableMovement(this.game.getAvailableSquares(), this.game.getActivePlayer());
            e.stopPropagation();
        // Quand les joueurs s'affrontent
        } else if (e.which == 13 && this.game.isFighting === true && this.game.end === false) {
            this.game.incrementTurn();
            this.game.switchTurn();
            this.displayInfoPlayers(this.game.getPlayer1(), this.game.getPlayer2());
            this.scanBoardToSetImages();
            e.stopPropagation();
        // Après la mort d'un joueur, passer à l'écran de fin
        } else if (e.which == 13 && this.game.isFighting === true && this.game.waitingPlayer.health <= 0 && this.game.end === true) {
            this.game.endGame();
            this.showEndGame(this.game.getPlayer1());
            e.stopPropagation();
        }
    });
    // Les mouvements des joueurs
    $(document).on('keydown', (e) => {
        // Gauche
        if (e.which == 37 && this.game.isFighting === false && this.game.end === false && this.game.moveLeft) {
            this.game.movePlayerLeft();
            this.scanBoardToSetImages();
            this.showAvailableMovement(this.game.getAvailableSquares(), this.game.getActivePlayer());
            this.displayInfoPlayers(this.game.getPlayer1(), this.game.getPlayer2());
            this.showActivePlayer(this.game.getActivePlayer());
            e.stopPropagation();
        }
        // Haut
        if (e.which == 38 && this.game.isFighting === false && this.game.end === false && this.game.moveUp) {
            this.game.movePlayerUp();
            this.scanBoardToSetImages();
            this.showAvailableMovement(this.game.getAvailableSquares(), this.game.getActivePlayer());
            this.displayInfoPlayers(this.game.getPlayer1(), this.game.getPlayer2());
            this.showActivePlayer(this.game.getActivePlayer());
            e.stopPropagation();
        }
        // Droite
        if (e.which == 39 && this.game.isFighting === false && this.game.end === false && this.game.moveRight) {
            this.game.movePlayerRight();
            this.scanBoardToSetImages();
            this.showAvailableMovement(this.game.getAvailableSquares(), this.game.getActivePlayer());
            this.displayInfoPlayers(this.game.getPlayer1(), this.game.getPlayer2());
            this.showActivePlayer(this.game.getActivePlayer());
            e.stopPropagation();
        }
        // Bas
        if (e.which == 40 && this.game.isFighting === false && this.game.end === false && this.game.moveDown) {
            this.game.movePlayerDown();
            this.scanBoardToSetImages();
            this.showAvailableMovement(this.game.getAvailableSquares(), this.game.getActivePlayer());
            this.displayInfoPlayers(this.game.getPlayer1(), this.game.getPlayer2());
            this.showActivePlayer(this.game.getActivePlayer());
            e.stopPropagation();
        }
    });
    // Attaquer avec A
    $(document).on('keydown', (e) => {
        // Attaque impossible en arrivnt adjacent à l'adversaire avec un mouvement de 3 cases, prise de risque
        if (e.which == 65 && this.game.moves >= 1 && this.game.isFighting === true && this.game.end === false) {
            this.game.attack();
            this.displayInfoPlayers(this.game.getPlayer1(), this.game.getPlayer2());
            this.showActivePlayer(this.game.getActivePlayer());
            e.stopPropagation();
        }
    });
    // Se défendre avec D
    $(document).on('keydown', (e) => {
        // Défense impossible en arrivnt adjacent à l'adversaire avec un mouvement de 3 cases, prise de risque
        if (e.which == 68 && this.game.moves >= 1 && this.game.isFighting === true && this.game.end === false) {
            this.game.defend();
            this.displayInfoPlayers(this.game.getPlayer1(), this.game.getPlayer2());
            this.showActivePlayer(this.game.getActivePlayer());
            e.stopPropagation();
        }
    });
    // Rafraichir le navigateur au clic sur bouton "Relancer le jeu"
    $(document).ready(() => {
        $('#reload').click(function () {
            location.reload();
        });
    });
};



// ETAPE 3

// (1) MODIFIER L'AFFICHAGE AUTOUR DU CANVAS, ECRAN DE FIN
Board.prototype.showEndGame = function (player1) {
    $('#board').removeClass('animated slideInUp');
    $('#board').addClass('animated rollOut');

    $('#board').on('animationend', function () {
        $(this).css('display', 'none');
    });

    if (player1.health <= 0) {
        $('.canvas-side--left').removeClass('animated slideInLeft');
        $('.canvas-side--left').addClass('animated zoomOutLeft');

        $('.canvas-side--left').on('animationend', function () {
            $(this).css('visibility', 'hidden');
        });

        this.showReloadButton();

        $('.end-game-Michael').addClass('animated rollIn');
        $('.end-game-Michael').css('display', 'block');

    } else {
        $('.canvas-side--right').removeClass('animated slideInRight');
        $('.canvas-side--right').addClass('animated zoomOutRight');

        $('.canvas-side--right').on('animationend', function () {
            $(this).css('visibility', 'hidden');
        });

        this.showReloadButton();

        $('.end-game-Lucifer').addClass('animated rollIn');
        $('.end-game-Lucifer').css('display', 'block');
    }
};


// Utile si redémarrer une partie sans Refresh

//Board.prototype.hideEndGame = function () {   
//    $('#board').removeClass('animated rollOut');
//    $('#board').on('animationend', function () {
//        $(this).css('display', 'block');
//    });
//    
//    $('.canvas-side--left').removeClass('animated zoomOutLeft');
//    $('.canvas-side--left').on('animationend', function () {
//            $(this).css('visibility', 'visible');
//        });
//    
//    $('.canvas-side--right').removeClass('animated zoomOutRight');
//    $('.canvas-side--right').on('animationend', function () {
//            $(this).css('visibility', 'visible');
//        });
//    
//    $('.end-game-Michael').css('display', 'none');
//    $('.end-game-Lucifer').css('display', 'none');
//};