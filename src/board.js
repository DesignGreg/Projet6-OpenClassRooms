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
    this.game = new Game(this.width, this.height);

    this.chartBoard = this.game.getChartBoard();

    this.availableSquares = this.game.getAvailableSquares();

    this.activePlayer = this.game.getActivePlayer();

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

    console.log(this.game.end);
}


// DESSIN DU TABLEAU
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

Board.prototype.scanBoardToSetImages = function () {
    ctx.clearRect(0, 0, 640, 640);
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
                //                Si utilisée, cherche player3, puis 4... 
                //                this.loadWeaponsPlayersImages(location, `../assets/joueur${joueurNum}.png`);
                //                joueurNum++;
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

Board.prototype.loadObstaclesImages = function (location, path) {

    const drawX = location.x * 64;
    const drawY = location.y * 64;

    const image = new Image();
    image.onload = function () {
        ctx.drawImage(image, drawX, drawY);
    };
    image.src = path;

};


Board.prototype.loadWeaponsPlayersImages = function (location, path) {

    const drawX = [location.x] * 64;
    const drawY = [location.y] * 64;

    const image = new Image();
    image.onload = function () {
        ctx.drawImage(image, (drawX + (image.width / 2)), (drawY + (image.height / 2)));
    };
    image.src = path;

};

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
    $(".canvas-side--left").html("<h2 class='canvas-side--title canvas-side--left__title'>" + player1.name + "<img class='canvas-side--left__image' src='../assets/joueur1.png'>" + "</h2><p class='canvas-side--health'>" + 'Santé' + ' (' + player1.health + ')' + "</p><p class='canvas-side--weapon'>" + player1.weapon.name + ' (' + player1.weapon.damage + ')' + "</p><p class='canvas-side--order'>" + player1.order + "</p>");

    $(".canvas-side--right").html("<h2 class='canvas-side--title canvas-side--right__title'>" + player2.name + "<img class='canvas-side--right__image' src='../assets/joueur2.png'>" + "</h2><p class='canvas-side--health'>" + 'Santé' + ' (' + player2.health + ')' + "</p><p class='canvas-side--weapon'>" + player2.weapon.name + ' (' + player2.weapon.damage + ')' + "</p><p class='canvas-side--order'>" + player2.order + "</p>");
};

Board.prototype.hideStartButton = function () {
    $('#start').css('visibility', 'hidden');
};

// A LA FIN DE LA PARTIE
Board.prototype.showReloadButton = function () {
    $('#start').css('display', 'none');
    $('#reload').css('display', 'inline-block');
};



// ETAPE 2


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
    console.log(this.chartBoard);
};

Board.prototype.showActivePlayer = function (player) {

    if (player == this.game.player1) {
        $('.canvas-side--left__title').css('color', 'red');
        $('.canvas-side--right__title').css('color', 'white');

    } else {
        $('.canvas-side--right__title').css('color', 'red');
        $('.canvas-side--left__title').css('color', 'white');
    }
};


Board.prototype.initEventListener = function () {

    $(document).on('keypress', (e) => {
        if (e.which == 13 && this.game.isFighting === false && this.game.end === false) {
            // Valider déplacement setPiece(), affichage déjà bon avec scanBoardToSetImages
            this.game.incrementTurn();
            this.game.switchTurn();
            this.scanBoardToSetImages();
            this.showAvailableMovement(this.game.getAvailableSquares(), this.game.getActivePlayer());
            e.stopPropagation();
        } else if (e.which == 13 && this.game.isFighting === true && this.game.end === false) {
            this.game.incrementTurn();
            this.game.switchTurn();
            this.scanBoardToSetImages();
            e.stopPropagation();
        } else if (e.which == 13 && this.game.isFighting === true && this.game.waitingPlayer.health <= 0 && this.game.end === true) {
            this.game.endGame();
            this.showEndGame(this.game.getPlayer1());
            e.stopPropagation();
        }
    });

    $(document).on('keydown', (e) => {
        if (e.which == 37 && this.game.isFighting === false && this.game.end === false) {
            this.game.movePlayerLeft();
            this.scanBoardToSetImages();
            this.showAvailableMovement(this.game.getAvailableSquares(), this.game.getActivePlayer());
            this.displayInfoPlayers(this.game.getPlayer1(), this.game.getPlayer2());
            this.showActivePlayer(this.game.getActivePlayer());
            e.stopPropagation();
        }
        if (e.which == 38 && this.game.isFighting === false && this.game.end === false) {
            this.game.movePlayerUp();
            this.scanBoardToSetImages();
            this.showAvailableMovement(this.game.getAvailableSquares(), this.game.getActivePlayer());
            this.displayInfoPlayers(this.game.getPlayer1(), this.game.getPlayer2());
            this.showActivePlayer(this.game.getActivePlayer());
            e.stopPropagation();
        }
        if (e.which == 39 && this.game.isFighting === false && this.game.end === false) {
            this.game.movePlayerRight();
            this.scanBoardToSetImages();
            this.showAvailableMovement(this.game.getAvailableSquares(), this.game.getActivePlayer());
            this.displayInfoPlayers(this.game.getPlayer1(), this.game.getPlayer2());
            this.showActivePlayer(this.game.getActivePlayer());
            e.stopPropagation();
        }
        if (e.which == 40 && this.game.isFighting === false && this.game.end === false) {
            this.game.movePlayerDown();
            this.scanBoardToSetImages();
            this.showAvailableMovement(this.game.getAvailableSquares(), this.game.getActivePlayer());
            this.displayInfoPlayers(this.game.getPlayer1(), this.game.getPlayer2());
            this.showActivePlayer(this.game.getActivePlayer());
            e.stopPropagation();
        }
    });



    // ETAPE 3

    $(document).on('keydown', (e) => {
        if (e.which == 65 && this.game.moves >= 1 && this.game.isFighting === true && this.game.end === false) {
            this.game.attack();
            this.displayInfoPlayers(this.game.getPlayer1(), this.game.getPlayer2());
            this.showActivePlayer(this.game.getActivePlayer());
            e.stopPropagation();
        }
    });

    $(document).on('keydown', (e) => {
        if (e.which == 68 && this.game.moves >= 1 && this.game.isFighting === true && this.game.end === false) {
            this.game.defend();
            this.displayInfoPlayers(this.game.getPlayer1(), this.game.getPlayer2());
            this.showActivePlayer(this.game.getActivePlayer());
            e.stopPropagation();
        }
    });

    $(document).ready(() => {
        $('#reload').click(function () {
            location.reload();
        });
    });
};

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

Board.prototype.reloadGame = function () {

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