// PLATEAU
const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
let board = [];
    
// CASE VIDE
function Square(x, y, w, h) {
    ctx.strokeStyle = 'black';
    ctx.strokeRect(x, y, w, h);
}
    
// GENERATE TABLE
function generateTable(col, raw) {
    for(let i = 0; i < col; i++) {
        let col = [];
        board.push(col);
        for(let j = 0; j < raw; j++) {
            ctx.beginPath();
            var square = new Square(j * 80, i * 80, 80, 80);
            col.push(square);
            ctx.closePath();   
        }      
    } 
    console.log(board);
}
generateTable(10,10);
    
// RANDOM ELEMENT OF 2D ARRAY
function randomArray(arr) {
    let random = Math.floor(Math.floor() * (arr.length));
    return arr[random][Math.floor(Math.random() * (arr[random].length))];
}
console.log(randomArray(board));


// OBSTACLE
function Obstacle(name, sprite) {
    this.name = name;
    this.sprite = sprite;
}
    
//let lava = new Obstacle("Lave", "assets/lave.png");


// JOUEURS
function Player(name, sprite, life) {
    this.name = name;
    this.sprite = sprite;
    this.life = life;
}

//let player1 = new Player("Joueur 1", "assets/joueur1.png", 100);
//let player2 = new Player("Joueur 2", "assets/joueur2.png", 100);


// SPAWN PLAYERS
function spawnPlayers(number, arr) {
    for(let i = 0; i < number; i++) {
        ctx.beginPath();
        randomArray(board); // Sélectionne des coordonnées dans le tableau
        // Slice pour retirer l'objet de ces coordonnées
        let spawn = // Place un objet Player sur ces coordonnées
        console.log(random);

        ctx.closePath();   
    }      

}
spawnPlayers(3);

// ARMES
function Weapon(name, sprite, damage) {
    this.name = name;
    this.sprite = sprite;
    this.damage = damage;
}

//let dagger = new Weapon("Dague", "assets/dague.png", 5);
//let sword = new Weapon("Epée", "assets/epee.png", 10);
//let axe = new Weapon("Hache", "assets/hache.png", 15);
//let flail = new Weapon("Fléau", "assets/fleau.png", 20);