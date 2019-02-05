const test = require('tape');

function multiply (a, b) {
    return a * b;
}

test('multiply - 2 et 2 font 4' , (assert) => {
    assert.plan(1);

    let result = 4;
    let mult = multiply(2,2);

    assert.deepEqual(result, mult);
});
