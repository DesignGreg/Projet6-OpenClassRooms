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

function Board (width, height) {
    this.width = width;
    this.height = height;
    this.game = new Game(this.width, this.height);

    this.chartBoard = this.game.getChartBoard();

    this.scanBoardToSetImages();
    this.hideStartButton();
    this.hideRules();
    this.displayCanvas();
    this.displayInfoPlayers(this.game.getPlayer1(), this.game.getPlayer2());
    this.initEventListener();
}


// DESSIN DU TABLEAU
Board.prototype.drawBoard = function () {
    for (let i = 0; i < this.width; i++) {
        for (let j = 0; j < this.height; j++) {
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.beginPath();
            ctx.strokeRect(j * 64, i * 64, 64, 64);
            ctx.closePath();
        }
    }
};

Board.prototype.scanBoardToSetImages = function () {
    ctx.clearRect(0, 0, 640, 640);
    this.drawBoard();
    
    let joueurNum = 1;
    for (let i = 0; i < this.chartBoard.length; i++) {
        for (let j = 0; j < this.chartBoard[i].length; j++) {
            const piece = this.chartBoard[i][j];
            const location = {
                x: j,
                y: i
            };

            if (piece instanceof Weapon) {
                if (piece.name === "Dague") {
                    this.loadWeaponsPlayersImages(location, '../assets/dague.png');
                } else if (piece.name === "Epée") {
                    this.loadWeaponsPlayersImages(location, '../assets/epee.png');
                } else if (piece.name === "Hache") {
                    this.loadWeaponsPlayersImages(location, '../assets/hache.png');
                } else if (piece.name === "Fléau") {
                    this.loadWeaponsPlayersImages(location, '../assets/fleau.png');
                }
            } else if (piece instanceof Obstacle) {
                this.loadObstaclesImages(location, '../assets/lave64.png');
            } else if (piece instanceof Player) {
                this.loadWeaponsPlayersImages(location, `../assets/joueur${joueurNum}.png`);
                joueurNum++;
                
            }
        }
    }
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
    $('.canvas-text').css('display', 'none');
};

Board.prototype.displayCanvas = function () {
    $('#board').css('visibility', 'visible');
    $('#board').addClass('animated slideInUp');
};

Board.prototype.displayInfoPlayers = function (player1, player2) {
    $('.canvas-side__left').css('visibility', 'visible');
    $('.canvas-side__right').css('visibility', 'visible');
    $('.canvas-side__left').addClass('animated slideInLeft');
    $('.canvas-side__right').addClass('animated slideInRight');
    
    $(".canvas-side__left").html("<h2 class='canvas-side--title'>" + player1.name + "</h2><p class='canvas-side--health'>" + player1.health + "</p><p class='canvas-side--health'>" + player1.weapon.name + "</p>");

    $(".canvas-side__right").html("<h2 class='canvas-side--title'>" + player2.name + "</h2><p class='canvas-side--health'>" + player2.health + "</p><p class='canvas-side--health'>" + player2.weapon.name + "</p>");
};

Board.prototype.hideStartButton = function () {
    $('#start').css('visibility', 'hidden');
};

    // A LA FIN DE LA PARTIE
Board.prototype.showStartButton = function () {
    $('#start').css('visibility', 'visible');
};



    // ETAPE 2

Board.prototype.showMovement = function () {
    for (let i = 0; i < this.width; i++) {
        for (let j = 0; j < this.height; j++) {
            ctx.strokeStyle = 'red';
            ctx.beginPath();
            ctx.strokeRect(j * 64, i * 64, 64, 64);
            ctx.closePath();
        }
    }
};

// Canvas, cleartRect(), les images sont des pixels, pas de déplacement possible. Il faut effacer et redessiner.

Board.prototype.clearPreviousImage = function () {
    
};

Board.prototype.addMovedPlayerImage = function () {

};

Board.prototype.addNewWeaponImage = function () {
    
};

Board.prototype.initEventListener = function () {

    $(document).on('keypress', (e) => {
        if (e.which == 13) {
            this.game.switchTurn();
            this.showMovement();
            e.stopPropagation();
        }
    });
    
    $(document).on('keydown', (e) => {
        if (e.which == 37) {
            this.game.movePlayerLeft();
            this.scanBoardToSetImages();
            e.stopPropagation();
        }
        if (e.which == 38) {
            this.game.movePlayerUp();
            this.scanBoardToSetImages();
            e.stopPropagation();
        }
        if (e.which == 39) {
            this.game.movePlayerRight();
            this.scanBoardToSetImages();
            e.stopPropagation();
        }
        if (e.which == 40) {
            this.game.movePlayerDown();
            this.scanBoardToSetImages();
            e.stopPropagation();
        }
    });
    
    // ETAPE 3
    
    // Touche A pour attaquer
    
    // Touche D pour se défendre
};



