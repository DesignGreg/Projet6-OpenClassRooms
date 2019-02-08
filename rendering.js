

// Dessiner le board et les instances générés après la création

Board.prototype.drawBoard = function () {
    for (var i = 0; i < this.width; i++) {
        for (var j = 0; j < this.height; j++) {
            ctx.beginPath();
            ctx.strokeStyle = 'black';
            ctx.strokeRect(j * 64, i * 64, 64, 64);
            ctx.closePath();
        }
    }
};

// Déplacer les instances joueurs lors d'un mouvement