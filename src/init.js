const $ = require('jquery');
const Board = require('./board.js');

$(document).ready(() => {
  $('#start').click(function () {
    // CREER INSTANCE DE BOARD
    const board = new Board(10, 10);
    console.log(board);
  });
});