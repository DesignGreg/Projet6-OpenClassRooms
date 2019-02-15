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
    function Player(name, health, weapon) {
        this.name = name;
        this.health = health;

        this.weapon = weapon;
    }


    // OBJET BOARD - LOGIQUE
    function Game(width, height, display) {
        this.width = width;
        this.height = height;
        this.display = display;

        this.turn = 1;

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

export {Obstacle, Weapon, Player, Game, Board};