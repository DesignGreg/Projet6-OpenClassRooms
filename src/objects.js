import {
    Board,
    board,
    ctx,
    drawBoard
} from "./board.js";


// OBJET OBSTACLE
function Obstacle(name, sprite) {
    this.name = name;
    this.sprite = sprite;
}


// OBJET ARME
function Weapon(name, sprite, damage) {
    this.name = name;
    this.sprite = sprite;
    this.damage = damage;
}


// OBJET JOUEUR
function Player(name, sprite, life) {
    this.name = name;
    this.sprite = sprite;
    this.life = life;
}


// EXPORT
export {Obstacle, Weapon, Player};












// DESSINER PLAYERS SUR CANVAS
//    Board.prototype.spawnPlayers = function (piece, x, y) {
//        const img = this.sprite;
//        ctx.drawImage(img, x, y);
//    };
//    board.spawnPlayers(player1, 2, 3);