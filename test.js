const test = require('tape');
const engine = require('./main.js');


//test('generateRandomLocation - valeur entre 1 et 10 (array.length)', (assert) => {
//    assert.plan(6);
//    
//    const boardTest = new engine.Board(10, 10);
//    
//
//    const result = boardTest.generateRandomLocation();
//
//    assert.ok(result.x, 'La valeur est bien comprise entre 1 et 10');
//    assert.ok(result.y, 'La valeur est bien comprise entre 1 et 10');
//    assert.ok(result.x >= 0, 'La valeur est bien superieure ou egale a 0');
//    assert.ok(result.x < 10, 'La valeur est bien strictement inferieure a 10');
//    assert.ok(result.y >= 0, 'La valeur est bien superieure ou egale a 0');
//    assert.ok(result.y < 10, 'La valeur est bien strictement inferieure a 10');
//});


test('isLocationCorrectForPlayer - return bien true si autre joueur en y/x+1', (assert) => {
    assert.plan(1);
    
    const boardTest = new engine.Board(10,10);
    
    const location = {
        x: 2,
        y: 2
    };
    
    const occupiedLocation = {
        x: 3,
        y: 2
    };
    
    const player1 = boardTest.setPiece(engine.player1, occupiedLocation);
    const startAgain = boardTest.isLocationCorrectForPlayer(location);
    
    assert.ok(startAgain, 'Tant que l\'emplacement es pris, la boucle recommence');
});

test('isLocationCorrectForPlayer - return bien true si autre joueur en y+1/x', (assert) => {
   assert.plan(1);
   
   const boardTest = new engine.Board(10, 10);
   
   const location = {
       x: 2,
       y: 2
   };
   
//    boardTest.chartBoard = [2][3];
   
   
   const startAgain = boardTest.isLocationCorrectForPlayer(location);

   
   assert.ok(startAgain, 'Tant que l\'emplacement es pris, la boucle recommence');
});

test('isLocationCorrectForPlayer - return bien true si autre joueur en y-1/x', (assert) => {
   assert.plan(1);
   
   const boardTest = new engine.Board(10, 10);
   
   const location = {
       x: 2,
       y: 2
   };
   
//    boardTest.chartBoard = [2][3];
   
   
   const startAgain = boardTest.isLocationCorrectForPlayer(location);

   
   assert.ok(startAgain, 'Tant que l\'emplacement es pris, la boucle recommence');
});

test('isLocationCorrectForPlayer - return bien true si autre joueur en y/x-1', (assert) => {
   assert.plan(1);
   
   const boardTest = new engine.Board(10, 10);
   
   const location = {
       x: 2,
       y: 2
   };
   
//    boardTest.chartBoard = [2][3];
   
   
   const startAgain = boardTest.isLocationCorrectForPlayer(location);

   
   assert.ok(startAgain, 'Tant que l\'emplacement es pris, la boucle recommence');
});


    Test 6/7/8/9 : la pièce Player1 est bien positionnée sans erreur quand elle se situe en bordure du plateau


test('generatePieceLocation - nouvelle boucle randomLocation() tant que isPositionInArray() = true', (assert) => {
   assert.plan(1);
   
   const boardTest = new engine.Board(10, 10);
   
   const location = {
       x: 1,
       y: 2
   };
   const forbiddenPosition = [1,2];
   
   const isLooping = boardTest.generatePlayerLocation(forbiddenPosition);
   
   assert.ok(isLooping, 'Tant que l\'emplacement es pris, la boucle recommence');
});
 
    
test('isPositionInArray - position dans tableau', (assert) => {
   assert.plan(1);
   
   const array = [{
       x: 1,
       y: 2
   }];
   const position = {
       x: 1,
       y: 2
   };

   const isInArray = engine.Board.prototype.isPositionInArray(position, array);

   assert.ok(isInArray, 'La position devrait etre dans le tableau');
});

test('isPositionInArray - position absente', (assert) => {
   assert.plan(1);
   const array = [{
       x: 1,
       y: 2
   }];
   const position = {
       x: 1,
       y: 3
   };

   const isInArray = engine.Board.prototype.isPositionInArray(position, array);

   assert.notOk(isInArray, 'La position devrait etre absente du tableau');
});