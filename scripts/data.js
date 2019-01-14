$(function() {
    
    
// PLATEAU
const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

function generateTable(col, raw) {
    for(let i = 0; i <= col; i++) {
        for(let j = 0; j <= raw; j++) {
            ctx.beginPath();
            ctx.strokeRect(j * 80, i * 80, 80, 80);
            ctx.closePath();
        }
    }
}
generateTable(10,10);



// JOUEURS
function Player(name, sprite, life) {
    this.name = name;
    this.sprite = sprite;
    this.life = life;
}

let player1 = new Player("Joueur 1", "images/joueur1.png", 100);
let player2 = new Player("Joueur 2", "images/joueur2.png", 100);



// ARMES
function Weapon(name, sprite, damage) {
    this.name = name;
    this.sprite = sprite;
    this.damage = damage;
}

let dagger = new Weapon("Dague", "assets/dague.png", 5);
let sword = new Weapon("Epée", "assets/epee.png", 10);
let axe = new Weapon("Hache", "assets/hache.png", 15);
let flail = new Weapon("Fléau", "assets/fleau.png", 20);
    

});