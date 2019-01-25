import {
    Board,
    ctx,
    drawBoard
} from "./board.js";

import {
    Obstacle,
    Weapon,
    Player
} from "./objects.js";



// POSITIONNER UNE PIECE
Board.prototype.setPiece = function (piece) {

    let randomX = Math.floor(Math.random() * this.width);
    let randomY = Math.floor(Math.random() * this.height);

    let drawX = randomX * 64;
    let drawY = randomY * 64;


    if (randomX >= this.width || randomY >= this.height) {
        throw new Error('Pièce hors limite');
    }

    if (piece instanceof Obstacle) {

        if (!(this.chartBoard[randomY][randomX] instanceof Obstacle)) {
            this.chartBoard[randomY][randomX] = piece;
//            ctx.fillRect(drawX, drawY,64,64);
            let image = piece.sprite;
            ctx.drawImage(image, drawX, drawY);

        }

    } else if (piece instanceof Weapon) {

        if (!(this.chartBoard[randomY][randomX] instanceof Obstacle) && (!(this.chartBoard[randomY][randomX] instanceof Weapon))) {
            this.chartBoard[randomY][randomX] = piece;
//            ctx.fillRect(drawX, drawY,64,64);
            let image = piece.sprite;
            ctx.drawImage(image, drawX, drawY);

        }

    } else if (piece instanceof Player) {

        if (!(this.chartBoard[randomY][randomX] instanceof Obstacle) &&
            (!(this.chartBoard[randomY][randomX] instanceof Weapon) &&
                (!(this.chartBoard[randomY][randomX] instanceof Player) &&
                    ((!(this.chartBoard[randomY][randomX + 1] instanceof Player)) || (typeof this.chartBoard[randomY][randomX + 1] === undefined)) &&
                    ((!(this.chartBoard[randomY][randomX - 1] instanceof Player)) || (typeof this.chartBoard[randomY][randomX - 1] === undefined)) &&
                    ((!(this.chartBoard[randomY + 1][randomX] instanceof Player)) || (typeof this.chartBoard[randomY + 1][randomX] === undefined)) &&
                    ((!(this.chartBoard[randomY - 1][randomX] instanceof Player)) || (typeof this.chartBoard[randomY - 1][randomX] === undefined))))) {

            this.chartBoard[randomY][randomX] = piece;
//            ctx.fillRect(drawX, drawY,64,64);
            let image = piece.sprite;
            ctx.drawImage(image, drawX, drawY);
        }

    } else {
        throw new Error('Pièce non valide');
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
    let numWeapons = 4;
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


// INIT OBJET PLATEAU
function start(images) {
    let board = new Board(10, 10);
    console.log(board);

    // INIT OBJET OBSTACLE
    const lava = new Obstacle("Lave", images.lave);
    const lava1 = new Obstacle("Lave1", images.lave);
    const lava2 = new Obstacle("Lave2", images.lave);
    const lava3 = new Obstacle("Lave3", images.lave);
    const lava4 = new Obstacle("Lave4", images.lave);
    const lava5 = new Obstacle("Lave5", images.lave);
    const lava6 = new Obstacle("Lave6", images.lave);
    const lava7 = new Obstacle("Lave7", images.lave);
    const lava8 = new Obstacle("Lave8", images.lave);
    const lava9 = new Obstacle("Lave9", images.lave);
    const lavaArray = [lava, lava1, lava2, lava3, lava4, lava5, lava6, lava7, lava8, lava9];

    // INIT OBJET ARME
    const dagger = new Weapon("Dague", images.lave, 5);
    const sword = new Weapon("Epée", images.lave, 10);
    const axe = new Weapon("Hache", images.lave, 15);
    const flail = new Weapon("Fléau", images.lave, 20);
    const weaponArray = [dagger, sword, axe, flail];


    // INIT OBJET JOUEUR
    const player1 = new Player("Joueur 1", images.player1, 100);
    const player2 = new Player("Joueur 2", images.player2, 100);
    const playerArray = [player1, player2];

    board.drawBoard();
    board.setObstacles(lavaArray);
    board.setWeapons(weaponArray);
    board.setPlayers(playerArray);
}


// UPLOADER UNE SEULE IMAGE
function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            resolve(img);
        };
        img.onerror = reject;
        img.crossOrigin = 'anonymous';
        img.src = url;
    });
}

//loadImage(urlOfImage).then(function(img) {
//  // use the loaded img
//});


// UPLOADER PLUSIEURS IMAGES
function loadImages(images) {
    return new Promise((resolve) => {
        const loadedImages = {};
        // for each name/url pair in image make a promise to load the image
        // by calling loadImage
        const imagePromises = Object.entries(images).map((keyValue) => {
            const [name, url] = keyValue;
            // load the image and when it's finished loading add the name/image
            // pair to loadedImages
            return loadImage(url).then((img) => {
                loadedImages[name] = img;
            });
        });
        // wait for all the images to load then pass the name/image object
        Promise.all(imagePromises).then(() => {
            resolve(loadedImages);
        });
    });
}


// APPEL POUR UPLOADER IMAGES
const images = {
    lave: 'https://i.imgur.com/enx5Xc8.png',
    player1 : 'https://i.imgur.com/cTw2F.png',
    player2 : 'https://i.imgur.com/fI0sg1o.png'
    // player: 'foo/player.png',
    // enemy: 'foo/enemny.png',
};
loadImages(images).then(start);