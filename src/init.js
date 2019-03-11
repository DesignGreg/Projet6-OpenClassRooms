const $ = require('jquery');
const Board = require('./board.js');

$(document).ready(() => {
  $('#start').click(function () {
    // CREER INSTANCE DE BOARD  
//    $.ajax({
//        url: "../src/board.js",
//        crossDomain: true,
//        dataType: 'script',
//        success: function(start) {
//            const board = new Board(10, 10);
//            console.log(board);},
//        async: false});
    const board = new Board(10, 10);
    console.log(board);
  });
});