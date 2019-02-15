/* AFFICHAGE */

'use strict'

const $ = require("jquery");
window.$ = $;

import {Obstacle, Weapon, Player, Game, Board,} from "./data.js";

// ETAPE 1

// CONTEXTE DU CANVAS
const ctx = $('#board').get(0).getContext('2d');

// DESSIN DU TABLEAU
Board.prototype.drawBoard = function () {
    for (var i = 0; i < board.width; i++) {
        for (var j = 0; j < board.height; j++) {
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.beginPath();
            ctx.strokeRect(j * 64, i * 64, 64, 64);
            ctx.closePath();
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


Board.prototype.addOnDom = function (player1, player2) {
    
    $('.canvas-text').css('display', 'none');
    
    $('#board').css('visibility', 'visible');
    $('#board').addClass('animated slideInUp');

    $('.canvas-side__left').css('visibility', 'visible');
    $('.canvas-side__right').css('visibility', 'visible');
    $('.canvas-side__left').addClass('animated slideInLeft');
    $('.canvas-side__right').addClass('animated slideInRight');

    $('#start').css('visibility', 'hidden');

    $(".canvas-side__left").html("<h2 class='canvas-side--title'>" + player1.name + "</h2><p class='canvas-side--health'>" + player1.health + "</p><p class='canvas-side--health'>" + player1.weapon.name + "</p>");

    $(".canvas-side__right").html("<h2 class='canvas-side--title'>" + player2.name + "</h2><p class='canvas-side--health'>" + player2.health + "</p><p class='canvas-side--health'>" + player2.weapon.name + "</p>");

};



// ETAPE 2

