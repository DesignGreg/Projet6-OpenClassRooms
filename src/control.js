// Control importe Game, et les modifications dans Game remontent à Board

const $ = require("jquery");
const Game = require('./game.js');
const Weapon = require('./weapon.js');
const Player = require('./player.js');
const Obstacle = require('./obstacle.js');

//function endTurn() {
//$(document).on('keypress', function (e) {
//    if (e.which == 13) {
//        Game.prototype.switchTurn(game.getPlayer1(), game.getPlayer2());
//        e.stopPropagation();
//    }
//});
//}



//function movePlayer(activePlayer) {
//$(document).on('keypress', function (e) {
//    if (e.which == 37) {
//        Game.prototype.movePlayerLeft(activePlayer, location);
//        
//        //reprendre coordonnées player actif, x-1 (gauche)
//        // si 3 pression sur la touche, endMovement()
//    }
//    if (e.which == 38) {
//        Game.prototype.movePlayerUp(activePlayer, location);
//        //reprendre coordonnées player actif, y+1 (haut)
//        // si 3 pression sur la touche, endMovement()
//    }
//    if (e.which == 39) {
//        Game.prototype.movePlayerRight(activePlayer, location);
//        //reprendre coordonnées player actif, x+1 (droite)
//        // si 3 pression sur la touche, endMovement()
//    }
//    if (e.which == 40) {
//        Game.prototype.movePlayerDown(activePlayer, location);
//        //reprendre coordonnées player actif, y-1 (bas)
//        // si 3 pression sur la touche, endMovement()
//    }
//});
//}