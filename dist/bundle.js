!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([function(e,t,n){"use strict";function o(e,t){this.width=e,this.height=t,this.chartBoard=[];for(var n=0;n<this.width;n++){const e=[];this.chartBoard.push(e);for(var o=0;o<this.height;o++){const t={};e.push(t)}}}n.r(t),n.d(t,"Board",function(){return o}),n.d(t,"board",function(){return r}),n.d(t,"ctx",function(){return a}),n.d(t,"drawBoard",function(){return drawBoard});let r=new o(10,10);console.log(r);const a=$("#board").get(0).getContext("2d");o.prototype.drawBoard=function(){for(var e=0;e<this.width;e++)for(var t=0;t<this.height;t++)a.beginPath(),a.strokeStyle="black",a.strokeRect(80*t,80*e,80,80),a.closePath()},r.drawBoard(),o.prototype.test=function(){console.log(this)}},function(e,t,n){$(document).ready(function(){n(0),n(2),n(3)})},function(e,t,n){"use strict";n.r(t);var o=n(0);function r(e,t){this.name=e,this.sprite=t}const a=new r("Lave","assets/lave.png"),s=new r("Lave1","assets/lave.png"),i=[a,s,new r("Lave2","assets/lave.png"),new r("Lave3","assets/lave.png"),new r("Lave4","assets/lave.png"),new r("Lave5","assets/lave.png"),new r("Lave6","assets/lave.png"),new r("Lave7","assets/lave.png"),new r("Lave8","assets/lave.png"),new r("Lave9","assets/lave.png")];function c(e,t,n){this.name=e,this.sprite=t,this.damage=n}const h=[new c("Dague","assets/dague.png",5),new c("Epée","assets/epee.png",10),new c("Hache","assets/hache.png",15),new c("Fléau","assets/fleau.png",20)];function d(e,t,n){this.name=e,this.sprite=t,this.life=n}const u=new d("Joueur 1","assets/joueur1.png",100),f=new d("Joueur 2","assets/joueur2.png",100);o.Board.prototype.setPiece=function(e){let t=Math.floor(Math.random()*o.board.width),n=Math.floor(Math.random()*o.board.height);if(t>=this.width||n>=this.height)throw new Error("Pièce hors limite");if(e instanceof r)this.chartBoard[n][t]instanceof r||(this.chartBoard[n][t]=e);else if(e instanceof c)this.chartBoard[n][t]instanceof r||this.chartBoard[n][t]instanceof c||(this.chartBoard[n][t]=e);else{if(!(e instanceof d))throw new Error("Pièce non valide");this.chartBoard[n][t]instanceof r||this.chartBoard[n][t]instanceof c||this.chartBoard[n][t]instanceof d||this.chartBoard[n][t+1]instanceof d||this.chartBoard[n][t-1]instanceof d||this.chartBoard[n+1][t]instanceof d||this.chartBoard[n-1][t]instanceof d||(console.log("good"),this.chartBoard[n][t]=e)}},o.Board.prototype.setObstacles=function(){for(let e of i){o.board.setPiece(e)}},o.board.setObstacles(),o.Board.prototype.setWeapons=function(){let e,t;for(let n=0;n<4;n++)e=Math.floor(Math.random()*h.length),t=o.board.setPiece(h[e])},o.board.setWeapons(),o.Board.prototype.setPlayers=function(){o.board.setPiece(u),o.board.setPiece(f)},o.board.setPlayers();o.board.setPiece(a),o.board.setPiece(s),o.board.setPiece(h[1])},function(e,t){}]);