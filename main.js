'use strict'

const test = require('tape');

//$(document).ready(function () {


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
        
        this.weapon = {
            name : Weapon.name,
            damage : Weapon.damage
        };
    }


    // OBJET PLATEAU
    function Board(width, height) {
        this.width = width;
        this.height = height;
        this.forbiddenPosition = [];

        this.resetBoard();
        this.generateGame();
    }

    Board.prototype.resetBoard = function () {
        this.chartBoard = [];

        // Création du plateau logique
        for (let i = 0; i < this.width; i++) {
            const row = [];
            this.chartBoard.push(row);
            for (let j = 0; j < this.height; j++) {
                const col = {};
                row.push(col);
            }
        }
    };


    Board.prototype.generateGame = function () {

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

        const dagger = new Weapon("Dague", 5);
        const sword = new Weapon("Epée", 10);
        const axe = new Weapon("Hache", 15);
        const flail = new Weapon("Fléau", 20);
        const weaponArray = [dagger, sword, axe, flail];

        const pieceToSetArray = [lava, lava1, lava2, lava3, lava4, lava5, lava6, lava7, lava8, lava9];

        //        let randomWeapon = this.getRamdomWeapons(weaponArray, pieceToSetArray);

        // GENERER INSTANCES
        const player1 = new Player("Joueur 1", 100);
        const player2 = new Player("Joueur 2", 100);
        const playerArray = [player1, player2];


        this.setObstaclesWeapons(pieceToSetArray);

        this.setPlayers(playerArray);
        console.log(this.chartBoard);
    };

    // CHOISIR ALEATOIREMENT 4 ARMES
    Board.prototype.getRandomWeapons = function (array, toArray) {
        const maxWeapons = 4;

        for (let i = 0; i <= maxWeapons; i++) {
            let randomWeapon = Math.floor(Math.random() * array.lenght);
            return toArray.push(array[i]);
        }
    };

    // GENERER UNE POSITION POUR UNE PIECE
    Board.prototype.generatePieceLocation = function (forbiddenPosition) {
        let location;
        do {
            location = this.generateRandomLocation();
        }
        while (this.isPositionInArray(location, forbiddenPosition));

        return location;
    };

    // GENERER UNE POSITION POUR UN JOUEUR
    Board.prototype.generatePlayerLocation = function (forbiddenPosition) {
        let location;
        do {
            location = this.generateRandomLocation();
        }
        while (this.isPositionInArray(location, forbiddenPosition) && !this.isLocationCorrectForPlayer(location));

        return location;
    };

    Board.prototype.generateRandomLocation = function () {
        return {
            x: Math.floor(Math.random() * this.width),
            y: Math.floor(Math.random() * this.height)
        };
    };

    // POSITIONNER UNE PIECE
    Board.prototype.setPiece = function (piece, location) {
        if (location.x >= this.width || location.y >= this.height) {
            throw new Error('Pièce hors limite');
        } else {
            this.chartBoard[location.y][location.x] = piece;
            this.forbiddenPosition.push(location);
        }
    };


    // PLACER OBSTACLES ET ARMES
    Board.prototype.setObstaclesWeapons = function (piecesToSetArray) {
        for (let piece of piecesToSetArray) {
            const location = this.generatePieceLocation(this.forbiddenPosition);
            this.setPiece(piece, location);
        }
    };

    // PLACER JOUEURS
    Board.prototype.setPlayers = function (playerArray) {
        for (let player of playerArray) {
            const location = this.generatePlayerLocation(this.forbiddenPosition);
            this.setPiece(player, location);
        }
    };

    Board.prototype.isLocationCorrectForPlayer = function (location) {
        const {
            x,
            y
        } = location;

        if (this.chartBoard[y][x + 1] instanceof Player ||
            this.chartBoard[y + 1][x] instanceof Player ||
            this.chartBoard[y - 1][x] instanceof Player ||
            this.chartBoard[y][x - 1] instanceof Player) {
            return false;
        }
        return true;
    };


    Board.prototype.isPositionInArray = function (position, array) {
        return array.some((elem) => {
            return (elem.x === position.x && elem.y === position.y);
        });
    };


    // CREER INSTANCE DE BOARD
    const board = new Board(10, 10);

//    const boardTest = new Board(10, 10);

//});

// TEST

test('generateRandomLocation - valeur entre 1 et 10 (array.length)', (assert) => {
    assert.plan(1);

    if (Object.keys[0] > 0 && Object.keys[0] >= 10 && Object.keys[1] > 0 && Object.keys[1] < 10) {
        const test = true;
        return true;
    }

    const result = Board.prototype.generateRandomLocation();

    assert.ok(test, 'La valeur est bien comprise entre 1 et 10');
});

//test('setPlayers - joueur placé correctement', (assert) => {
//    assert.plan(1);
    
    // Test 1 : la pièce Player1 est bien sur le plateau
    
    // Test 2/3/4/5 : La pièce Player1 n'a pas de voisin Player2 sur la case adjacente précisée
    
    // Test 6/7/8/9 : la pièce Player1 est bien positionnée sans erreur quand elle se situe en bordure du plateau
//});
//
//
//test('generatePieceLocation - nouvelle boucle randomLocation() tant que isPositionInArray() = true', (assert) => {
//    assert.plan(1);
//    
//    
//    
//});

//
//test('isPositionInArray - position dans tableau', (assert) => {
//    assert.plan(1)
//    const array = [{
//        x: 1,
//        y: 2
//    }]
//    const position = {
//        x: 1,
//        y: 2
//    }
//
//    const isInArray = isPositionInArray(position, array)
//
//    assert.ok(isInArray, 'La position devrait être dans le tableau')
//})
//
//test('isPositionInArray - position absente', (assert) => {
//    assert.plan(1)
//    const array = [{
//        x: 1,
//        y: 2
//    }]
//    const position = {
//        x: 1,
//        y: 3
//    }
//
//    const isInArray = isPositionInArray(position, array)
//
//    assert.notOk(isInArray, 'La position devrait être absente du tableau')
//})