'use strict'

const test = require('tape')

// DRY
// DFRY
// DON'T FUCKING REPEAT YOURSELF
function generateBoard () {
  const Joueur1 = new Player()
  const Joueur2 = new Player()
  
  const pieceArray = [
    Joueur1,
    Joueur2,
  ]



  this.setPiece(Joueur1, )

}

function setPiece (Piece, x, y) {
  // if position non acceptable (hors des limites ou non)
  // sinon positionne piece
}

function init (pieceArray) {
  const forbiddenPosition = []
  pieceArray.forEach((piece) => {
    const position = this.generatePosition(forbiddenPosition)
    this.setPiece(piece, position.x, position.y)
    forbiddenPosition.push(position)
  })
}

function generatePosition (forbiddenPosition) {
  let position
  do {
    position = { 
      x: Math.floor(Math.random() * this.width),
      y: Math.floor(Math.random() * this.height)
    }
  }
  while (isPositionInArray(position, forbiddenPosition))

  return position
}

function isPositionInArray (position, array) {
  // return array.some((elem) => {
  //   return (elem.x === position.x && elem.y === position.y)
  // })

  let toReturn = false
  array.forEach((elem) => {
    if (elem.x === position.x && elem.y === position.y) {
      toReturn = false
    }
  })
  return toReturn
}


test('isPositionInArray - position dans tableau', (assert) => {
  assert.plan(1)
  const array = [ { x: 1, y: 2 }]
  const position = { x: 1, y: 2 }

  const isInArray = isPositionInArray(position, array)

  assert.ok(isInArray, 'La position devrait être dans le tableau')
})

test('isPositionInArray - position absente', (assert) => {
  assert.plan(1)
  const array = [ { x: 1, y: 2 }]
  const position = { x: 1, y: 3 }

  const isInArray = isPositionInArray(position, array)

  assert.notOk(isInArray, 'La position devrait être absente du tableau')
})