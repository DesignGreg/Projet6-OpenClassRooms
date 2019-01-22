    import {Board, board, ctx, drawBoard} from "./board.js";

    
    // OBJET OBSTACLE
    function Obstacle(name, sprite) {
        this.name = name;
        this.sprite = sprite;
    }
    // INIT OBJET OBSTACLE
    const lava = new Obstacle("Lave", "assets/lave.png");



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



    // OBJET JOUEUR
    function Player(name, sprite, life) {
        this.name = name;
        this.sprite = sprite;
        this.life = life;
    }
    // INIT OBJET JOUEUR
    const player1 = new Player("Joueur 1", "assets/joueur1.png", 100);
    const player2 = new Player("Joueur 2", "assets/joueur2.png", 100);



    


    // POSITIONNER UNE PIECE
    Board.prototype.setPiece = function (piece) {
        
        let randomX = Math.floor(Math.random() * board.width);
        let randomY = Math.floor(Math.random() * board.height);
        
        if (randomX >= this.width || randomY >= this.height) {
            throw new Error('Pièce hors limite');
        }
        
        this.chartBoard[randomY][randomX] = piece;
    };
    const piece1 = board.setPiece(player1);
    const piece2 = board.setPiece(player2);





    // DESSINER PLAYERS SUR CANVAS
//    Board.prototype.spawnPlayers = function (piece, x, y) {
//        const img = this.sprite;
//        ctx.drawImage(img, x, y);
//    };
//    board.spawnPlayers(player1, 2, 3);