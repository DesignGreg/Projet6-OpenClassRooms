// OBJET OBSTACLE
function Obstacle(name) {
    this.name = name;
}

// OBJET ARME
function Weapon(name, damage) {
    this.name = name;
    this.damage = damage;
}

// OBJET JOUEUR
function Player(name, life) {
    this.name = name;
    this.life = life;
}



// OBJET PLATEAU
function Board(width, height) {
    this.width = width;
    this.height = height;
    this.chartBoard = [];

    // Création du plateau logique
    for (var i = 0; i < this.width; i++) {
        const row = [];
        this.chartBoard.push(row);
        for (var j = 0; j < this.height; j++) {
            const col = {};
            row.push(col);
        }
    }
}



    // POSITIONNER UNE PIECE
Board.prototype.setPiece = function (piece) {
    
    
    const randomX = Math.floor(Math.random() * this.width);
    const randomY = Math.floor(Math.random() * this.height);
    
    if (randomX >= this.width || randomY >= this.height) {
        throw new Error('Pièce hors limite');
    } else {
        this.chartBoard[randomY][randomX] = piece;
    }
};



// PLACER OBSTACLES
Board.prototype.setObstacles = function (lavaArray) {
    for (let lava of lavaArray) {

        const obstacle = this.setPiece(lava);
    }
};



// PLACER ARMES
Board.prototype.setWeapons = function (weaponArray) {
    const numWeapons = 4;
    let randomWeapon;
    let spawnWeapon;

    for (let i = 0; i < numWeapons; i++) {
        randomWeapon = Math.floor(Math.random() * weaponArray.length);
        spawnWeapon = this.setPiece(weaponArray[randomWeapon]);
    }
};



// PLACER JOUEURS
Board.prototype.setPlayers = function (playerArray) {

    for (let player of playerArray) {

        const spawnPlayer = this.setPiece(player);
    }
};



// CREER INSTANCE DE BOARD
const board = new Board(10, 10);
Board.prototype.generateBoard = function () {

    console.log(board); 
    
    // GENERER INSTANCES
const lava = new Obstacle("Lave");
const lava1 = new Obstacle("Lave1");
const lava2 = new Obstacle("Lave2");
const lava3 = new Obstacle("Lave3");
const lava4 = new Obstacle("Lave4");
const lava5 = new Obstacle("Lave5");
const lava6 = new Obstacle("Lave6");
const lava7 = new Obstacle("Lave7");
const lava8 = new Obstacle("Lave8");
const lava9 = new Obstacle("Lave9");
const lavaArray = [lava, lava1, lava2, lava3, lava4, lava5, lava6, lava7, lava8, lava9];
    
    
    // GENERER INSTANCES
const dagger = new Weapon("Dague", 5);
const sword = new Weapon("Epée", 10);
const axe = new Weapon("Hache", 15);
const flail = new Weapon("Fléau", 20);
const weaponArray = [dagger, sword, axe, flail];
    
    
    // GENERER INSTANCES
const player1 = new Player("Joueur 1", 100);
const player2 = new Player("Joueur 2", 100);
const playerArray = [player1, player2];
    
    
    board.setObstacles(lavaArray);
    board.setWeapons(weaponArray);
    board.setPlayers(playerArray);
};
board.generateBoard();