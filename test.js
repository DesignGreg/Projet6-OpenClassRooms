const test = require('tape');
const engine = require('./main.js');


test('generateRandomLocation - valeur entre 1 et 10 (array.length)', (assert) => {
    assert.plan(6);
    
    const boardTest = new engine.Board(10, 10);
    

    const result = boardTest.generateRandomLocation();

    assert.ok(result.x, 'La valeur est bien comprise entre 1 et 10');
    assert.ok(result.y, 'La valeur est bien comprise entre 1 et 10');
    assert.ok(result.x >= 0, 'La valeur est bien comprise entre 1 et 10');
    assert.ok(result.x < 10, 'La valeur est bien comprise entre 1 et 10');
    assert.ok(result.y >= 0, 'La valeur est bien comprise entre 1 et 10');
    assert.ok(result.y < 10, 'La valeur est bien comprise entre 1 et 10');
});


//     Test 2/3/4/5 : La pièce Player1 n'a pas de voisin Player2 sur la case adjacente précisée
//
//     Test 6/7/8/9 : la pièce Player1 est bien positionnée sans erreur quand elle se situe en bordure du plateau


//test('generatePieceLocation - nouvelle boucle randomLocation() tant que isPositionInArray() = true', (assert) => {
//    assert.plan(1);
//    
//    
//    
//});
//
//
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