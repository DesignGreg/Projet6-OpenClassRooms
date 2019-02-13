'use strict'

$(document).ready(function () {


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
    function Player(name, life, weapon) {
        this.name = name;
        this.life = life;

        this.weapon = weapon;
    }


    // OBJET BOARD - LOGIQUE
    function Game(width, height, display) {
        this.width = width;
        this.height = height;
        this.display = display;
        
        this.forbiddenPosition = [];
        this.chartBoard = this.resetBoard();
        this.generateGame();
    }
    
    // OBJET BOARD - AFFICHAGE
    function Board() {
        Game.call(this);
    }
    
    // CHAINE DE PROTOTYPES
    Game.prototype = Object.create(Board.prototype);
    Board.prototype.constructor = Board;
    


    $('#start').click(function () {


        // ETAPE 1
        /* AFFICHAGE */

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
        
        
        // INTERACTION AVEC LE DOM
        Board.prototype.addOnDom = function () {
            $('.canvas').css('visibility', 'visible');
            $('.canvas-side__left').css('visibility', 'visible');
            $('.canvas-side__right').css('visibility', 'visible');
            $('.canvas-side__left').addClass('animated slideInLeft');
            $('.canvas-side__right').addClass('animated slideInRight');
            $('#start').css('visibility', 'hidden');
        
            $( ".canvas-side__left" ).html("<h2 class='canvas-side--title'>" + player1.name + "</h2>");
        };
        
        
        
        

        // ETAPE 1
        /* LOGIQUE DU JEU */

        Game.prototype.resetBoard = function () {
            const chartBoard = [];

            // Création du plateau logique
            for (let i = 0; i < this.width; i++) {
                const row = [];
                chartBoard.push(row);
                for (let j = 0; j < this.height; j++) {
                    const col = {};
                    row.push(col);
                }
            }
            return chartBoard;
        };


        Game.prototype.generateGame = function () {

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
            const obstacleArray = [lava, lava1, lava2, lava3, lava4, lava5, lava6, lava7, lava8, lava9];

            const dagger = new Weapon("Dague", 5);
            const sword = new Weapon("Epée", 10);
            const axe = new Weapon("Hache", 15);
            const flail = new Weapon("Fléau", 20);
            const weaponArray = [dagger, sword, axe, flail];

            let randomWeapons = this.getRandomWeapons(4, weaponArray);

            let pieceToSetArray = obstacleArray.concat(randomWeapons);

            // GENERER INSTANCES
            const player1 = new Player("Joueur 1", 100, dagger);
            const player2 = new Player("Joueur 2", 100, dagger);
            const playerArray = [player1, player2];


            this.setObstaclesWeapons(pieceToSetArray);
            this.setPlayers(playerArray);

            // APPEL FONCTIONS AFFICHAGE
            Board.prototype.drawBoard();
            Board.prototype.addOnDom();

        };

        // CHOISIR ALEATOIREMENT 4 ARMES
        Game.prototype.getRandomWeapons = function (maxWeapons, array) {
            const randomWeaponsArray = [];

            for (let i = 0; i < maxWeapons; i++) {
                let randomWeapon = Math.floor(Math.random() * array.length);
                randomWeaponsArray.push(array[randomWeapon]);
            }
            return randomWeaponsArray;
        };

        // GENERER UNE POSITION POUR UNE PIECE
        Game.prototype.generatePieceLocation = function (forbiddenPosition) {
            let location;
            do {
                location = this.generateRandomLocation();
            }
            while (this.isPositionInArray(location, forbiddenPosition));

            return location;
        };

        // GENERER UNE POSITION POUR UN JOUEUR
        Game.prototype.generatePlayerLocation = function (forbiddenPosition) {
            let location;
            do {
                location = this.generateRandomLocation();
            }
            while (this.isPositionInArray(location, forbiddenPosition) || !this.isLocationCorrectForPlayer(location));

            return location;
        };

        Game.prototype.generateRandomLocation = function () {
            return {
                x: Math.floor(Math.random() * this.width),
                y: Math.floor(Math.random() * this.height)
            };
        };

        // POSITIONNER UNE PIECE
        Game.prototype.setPiece = function (piece, location) {
            if (location.x >= this.width || location.y >= this.height) {
                throw new Error('Pièce hors limite');
            } else {
                this.chartBoard[location.y][location.x] = piece;
                this.forbiddenPosition.push(location);
            }
        };


        // PLACER OBSTACLES ET ARMES
        Game.prototype.setObstaclesWeapons = function (piecesToSetArray) {
            for (let piece of piecesToSetArray) {
                const location = this.generatePieceLocation(this.forbiddenPosition);


                // Appel de l'image correspondante à l'obstacle ou arme
                if (piece instanceof Weapon && piece.name === "Dague") {
                    Board.prototype.loadWeaponsPlayersImages(location, './assets/dague.png');
                } else if (piece instanceof Weapon && piece.name === "Epée") {
                    Board.prototype.loadWeaponsPlayersImages(location, './assets/epee.png');
                } else if (piece instanceof Weapon && piece.name === "Hache") {
                    Board.prototype.loadWeaponsPlayersImages(location, './assets/hache.png');
                } else if (piece instanceof Weapon && piece.name === "Fléau") {
                    Board.prototype.loadWeaponsPlayersImages(location, './assets/fleau.png');
                } else {
                    Board.prototype.loadObstaclesImages(location, './assets/lave64.png');
                }


                this.setPiece(piece, location);
            }
        };

        // PLACER JOUEURS
        Game.prototype.setPlayers = function (playerArray) {
            for (let player of playerArray) {
                const location = this.generatePlayerLocation(this.forbiddenPosition);

                // Appel de l'image correspondante au joueur
                switch (player) {
                    case playerArray[0]:
                        Board.prototype.loadWeaponsPlayersImages(location, './assets/joueur1.png');
                        break;
                    case playerArray[1]:
                        Board.prototype.loadWeaponsPlayersImages(location, './assets/joueur2.png');
                        break;
                }

                this.setPiece(player, location);
            }
        };

        Game.prototype.isLocationCorrectForPlayer = function (location) {
            const {
                x,
                y
            } = location;
            
            if (location.y === 0) {
                if (this.chartBoard[y][x + 1] instanceof Player ||
                this.chartBoard[y + 1][x] instanceof Player ||
                this.chartBoard[y][x - 1] instanceof Player) {
                return false;
                }
            }else if (location.y === 9) {
                if (this.chartBoard[y][x + 1] instanceof Player ||
                this.chartBoard[y - 1][x] instanceof Player ||
                this.chartBoard[y][x - 1] instanceof Player) {
                return false;
                }
            }else if (location.x === 0) {
                if (this.chartBoard[y][x + 1] instanceof Player ||
                this.chartBoard[y + 1][x] instanceof Player ||
                this.chartBoard[y - 1][x] instanceof Player) {
                return false;
                }
            }else if (location.x === 9) {
                if (this.chartBoard[y + 1][x] instanceof Player ||
                this.chartBoard[y - 1][x] instanceof Player ||
                this.chartBoard[y][x - 1] instanceof Player) {
                return false;
                }
            }else {
                if (this.chartBoard[y][x + 1] instanceof Player ||
                this.chartBoard[y + 1][x] instanceof Player ||
                this.chartBoard[y - 1][x] instanceof Player ||
                this.chartBoard[y][x - 1] instanceof Player) {
                return false;
                }
            }
                return true;
        };


        Game.prototype.isPositionInArray = function (position, array) {
            return array.some((elem) => {
                return (elem.x === position.x && elem.y === position.y);
            });
        };


        // CREER INSTANCE DE BOARD
        const game = new Game(10, 10, Game);
        console.log(game); 

    });
    // FIN FONCTION START

    

    // ETAPE 2
    // AFFICHAGE





    // ETAPE 2
    // LOGIQUE DU JEU

    // Rajouter attribut this.turn = 1 à l'objet Board

    Game.prototype.switchTurn = function () {

        $(document).on('keypress', function (e) {
            if (e.which == 13 || Board.turn === 1) {
                // Changer de joueur, player1 false
                let activePlayer = 2;
                e.stopPropagation();
            }
            if (e.which == 13 || Board.turn === 2) {
                // Changer de joueur player1 true
                let activePlayer = 1;
                e.stopPropagation();
            }
            return activePlayer;
        });

    };

    Game.prototype.showMovement = function (activePlayer) {
        // checkAvailableSquares

        // highlightSquare


    };

    Game.prototype.checkAvailableSquares = function (activePlayer) {
        // 3 Ifs imbriqués (case +1, case +2, case +3) - 2 boucles (-3 à 3) x et y
        // Vérifier cases perpendiculaires au joueur actif
        // stoppe si obstacle ou joueur sur le chemin (par direction)
        // renvoie tableau coordonnées autorisées
    };

    Game.prototype.highlightSquare = function () {
        // surbrillance des cases disnibles
    };

    Game.prototype.movePlayer = function (activePlayer) { // autre classe, graphique
        $(document).on('keypress', function (e) {
            if (e.which == 37) {
                //reprendre coordonnées player actif, x-1 (gauche)
            }
            if (e.which == 38) {
                //reprendre coordonnées player actif, y+1 (haut)
            }
            if (e.which == 39) {
                //reprendre coordonnées player actif, x+1 (droite)
            }
            if (e.which == 40) {
                //reprendre coordonnées player actif, y-1 (bas)
            }
        });
    };

    Game.prototype.walkOnWeapon = function () {
        // Est-ce que objet player et weapon sur même case ?
    };

    Game.prototype.switchWeapon = function () {
        // walkOnWeapon
        // Changer l'arme du joueur (mise à jour de l'instance)

    };

});

//module.exports = {
//    Obstacle: Obstacle,
//    Weapon: Weapon,
//    Player: Player,
//    Board: Board
//};




// TEST

//test('generateRandomLocation - valeur entre 1 et 10 (array.length)', (assert) => {
//    assert.plan(6);
//    
//    const boardTest = new Board(10, 10);
//    
//
//    const result = boardTest.generateRandomLocation()
//
//    assert.ok(result.x, 'La valeur est bien comprise entre 1 et 10');
//    assert.ok(result.y, 'La valeur est bien comprise entre 1 et 10');
//    assert.ok(result.x >= 0, 'La valeur est bien comprise entre 1 et 10');
//    assert.ok(result.x < 10, 'La valeur est bien comprise entre 1 et 10');
//    assert.ok(result.y >= 0, 'La valeur est bien comprise entre 1 et 10');
//    assert.ok(result.y < 10, 'La valeur est bien comprise entre 1 et 10');
//});


//     Test 2/3/4/5 : La pièce Player1 n'a pas de voisin Player2 sur la case adjacente précisée

//     Test 6/7/8/9 : la pièce Player1 est bien positionnée sans erreur quand elle se situe en bordure du plateau
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
//    assert.plan(1);
//    
//    const array = [{
//        x: 1,
//        y: 2
//    }];
//    const position = {
//        x: 1,
//        y: 2
//    };
//
//    const isInArray = Board.prototype.isPositionInArray(position, array);
//
//    assert.ok(isInArray, 'La position devrait etre dans le tableau');
//});
//
//test('isPositionInArray - position absente', (assert) => {
//    assert.plan(1);
//    const array = [{
//        x: 1,
//        y: 2
//    }];
//    const position = {
//        x: 1,
//        y: 3
//    };
//
//    const isInArray = Board.prototype.isPositionInArray(position, array);
//
//    assert.notOk(isInArray, 'La position devrait etre absente du tableau');
//});