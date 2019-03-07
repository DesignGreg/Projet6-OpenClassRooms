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
    $('.canvas-text').css('display', 'none');
};

Board.prototype.displayCanvas = function () {
    $('#board').css('visibility', 'visible');
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
    $(".canvas-side--left").html("<h2 class='canvas-side--left__title'>" + player1.name + "<img class='canvas-side--left__image' src='../assets/joueur1.png'>" + "</h2><p class='canvas-side--health'>" + 'Santé' + ' (' + player1.health + ')' + "</p><p class='canvas-side--weapon'>" + player1.weapon.name + ' (' + player1.weapon.damage + ')' + "</p>");

    $(".canvas-side--right").html("<h2 class='canvas-side--right__title'>" + player2.name + "<img class='canvas-side--right__image' src='../assets/joueur2.png'>" + "</h2><p class='canvas-side--health'>" + 'Santé' + ' (' + player2.health + ')' + "</p><p class='canvas-side--weapon'>" + player2.weapon.name + ' (' + player2.weapon.damage + ')' + "</p>");
};

Board.prototype.hideStartButton = function () {
    $('#start').css('visibility', 'hidden');
};

    // A LA FIN DE LA PARTIE
Board.prototype.showStartButton = function () {
    $('#start').css('visibility', 'visible');
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
        if (e.which == 13) {
            // Valider déplacement setPiece(), affichage déjà bon avec scanBoardToSetImages
            this.game.incrementTurn();
            this.game.switchTurn();
            this.scanBoardToSetImages();
            this.showAvailableMovement(this.game.getAvailableSquares(), this.game.getActivePlayer());
            e.stopPropagation();
        }
    });
    
    $(document).on('keydown', (e) => {
        if (e.which == 37) {
            this.game.movePlayerLeft();
            this.scanBoardToSetImages();
            this.showAvailableMovement(this.game.getAvailableSquares(), this.game.getActivePlayer());
            this.displayInfoPlayers(this.game.getPlayer1(), this.game.getPlayer2());
            e.stopPropagation();
        }
        if (e.which == 38) {
            this.game.movePlayerUp();
            this.scanBoardToSetImages();
            this.showAvailableMovement(this.game.getAvailableSquares(), this.game.getActivePlayer());
            this.displayInfoPlayers(this.game.getPlayer1(), this.game.getPlayer2());
            e.stopPropagation();
        }
        if (e.which == 39) {
            this.game.movePlayerRight();
            this.scanBoardToSetImages();
            this.showAvailableMovement(this.game.getAvailableSquares(), this.game.getActivePlayer());
            this.displayInfoPlayers(this.game.getPlayer1(), this.game.getPlayer2());
            e.stopPropagation();
        }
        if (e.which == 40) {
            this.game.movePlayerDown();
            this.scanBoardToSetImages();
            this.showAvailableMovement(this.game.getAvailableSquares(), this.game.getActivePlayer());
            this.displayInfoPlayers(this.game.getPlayer1(), this.game.getPlayer2());
            e.stopPropagation();
        }
    });
    
    // ETAPE 3
    
    // Touche A pour attaquer
    
    // Touche D pour se défendre
};



