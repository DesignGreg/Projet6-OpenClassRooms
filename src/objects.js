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
// INIT OBJET OBSTACLE
const lava = new Obstacle("Lave", "assets/lave.png");
const lava1 = new Obstacle("Lave1", "assets/lave.png");
const lava2 = new Obstacle("Lave2", "assets/lave.png");
const lava3 = new Obstacle("Lave3", "assets/lave.png");
const lava4 = new Obstacle("Lave4", "assets/lave.png");
const lava5 = new Obstacle("Lave5", "assets/lave.png");
const lava6 = new Obstacle("Lave6", "assets/lave.png");
const lava7 = new Obstacle("Lave7", "assets/lave.png");
const lava8 = new Obstacle("Lave8", "assets/lave.png");
const lava9 = new Obstacle("Lave9", "assets/lave.png");
const lavaArray = [lava, lava1, lava2, lava3, lava4, lava5, lava6, lava7, lava8, lava9];



// OBJET ARME
function Weapon(name, sprite, damage) {
    this.name = name;
    this.sprite = sprite;
    this.damage = damage;
}
// INIT OBJET ARME
const dagger = new Weapon("Dague", "assets/dague.png", 5);
const sword = new Weapon("Epée", "assets/epee.png", 10);
const axe = new Weapon("Hache", "assets/hache.png", 15);
const flail = new Weapon("Fléau", "assets/fleau.png", 20);
const weaponArray = [dagger, sword, axe, flail];



// OBJET JOUEUR
function Player(name, sprite, life) {
    this.name = name;
    this.sprite = sprite;
    this.life = life;
}
// INIT OBJET JOUEUR
const player1 = new Player("Joueur 1", "assets/joueur1.png", 100);
const player2 = new Player("Joueur 2", "assets/joueur2.png", 100);
const playerArray = [player1, player2];



// EXPORT
export {Obstacle, lavaArray, Weapon, weaponArray, Player, playerArray};












// DESSINER PLAYERS SUR CANVAS
//    Board.prototype.spawnPlayers = function (piece, x, y) {
//        const img = this.sprite;
//        ctx.drawImage(img, x, y);
//    };
//    board.spawnPlayers(player1, 2, 3);