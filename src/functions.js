// GENERATE TABLE
function generateTable(col, raw) {
    for(let i = 0; i <= col; i++) {
        let col = [];
        board.push(col);
        for(let j = 0; j <= raw; j++) {
            ctx.beginPath();
            var square = new Square(j * 80, i * 80, 80, 80);
            col.push(square);
            ctx.closePath();   
        }      
    } 
    console.log(board);
}
generateTable(10,10);

// CREATE GAME
function createGame() {
    
}