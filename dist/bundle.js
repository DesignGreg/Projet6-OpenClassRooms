!function(t){var e={};function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=2)}([function(t,e,r){"use strict";r.r(e),r.d(e,"Obstacle",function(){return n}),r.d(e,"Weapon",function(){return o}),r.d(e,"Player",function(){return a});r(1);function n(t,e){this.name=t,this.sprite=e}function o(t,e,r){this.name=t,this.sprite=e,this.damage=r}function a(t,e,r){this.name=t,this.sprite=e,this.life=r}},function(t,e,r){"use strict";r.r(e),r.d(e,"Board",function(){return o}),r.d(e,"ctx",function(){return n}),r.d(e,"drawBoard",function(){return drawBoard});const n=$("#board").get(0).getContext("2d");function o(t,e){this.width=t,this.height=e,this.chartBoard=[];for(var r=0;r<this.width;r++){const t=[];this.chartBoard.push(t);for(var n=0;n<this.height;n++){const e={};t.push(e)}}}o.prototype.drawBoard=function(){for(var t=0;t<this.width;t++)for(var e=0;e<this.height;e++)n.beginPath(),n.strokeStyle="black",n.strokeRect(64*e,64*t,64,64),n.closePath()},o.prototype.test=function(){console.log(this)}},function(t,e,r){$(document).ready(function(){r(1),r(0),r(3),r(4)})},function(t,e,r){"use strict";r.r(e);var n=r(1),o=r(0);n.Board.prototype.setPiece=function(t){let e=Math.floor(Math.random()*this.width),r=Math.floor(Math.random()*this.height),a=64*e,i=64*r;if(e>=this.width||r>=this.height)throw new Error("Pièce hors limite");if(t instanceof o.Obstacle){if(!(this.chartBoard[r][e]instanceof o.Obstacle)){this.chartBoard[r][e]=t;let o=t.sprite;n.ctx.drawImage(o,a,i)}}else if(t instanceof o.Weapon){if(!(this.chartBoard[r][e]instanceof o.Obstacle||this.chartBoard[r][e]instanceof o.Weapon)){this.chartBoard[r][e]=t;let o=t.sprite;n.ctx.drawImage(o,a,i)}}else{if(!(t instanceof o.Player))throw new Error("Pièce non valide");if(!(this.chartBoard[r][e]instanceof o.Obstacle||this.chartBoard[r][e]instanceof o.Weapon||this.chartBoard[r][e]instanceof o.Player||this.chartBoard[r][e+1]instanceof o.Player&&void 0!==typeof this.chartBoard[r][e+1]||this.chartBoard[r][e-1]instanceof o.Player&&void 0!==typeof this.chartBoard[r][e-1]||this.chartBoard[r+1][e]instanceof o.Player&&void 0!==typeof this.chartBoard[r+1][e]||this.chartBoard[r-1][e]instanceof o.Player&&void 0!==typeof this.chartBoard[r-1][e])){this.chartBoard[r][e]=t;let o=t.sprite;n.ctx.drawImage(o,a,i)}}},n.Board.prototype.setObstacles=function(t){for(let e of t){this.setPiece(e)}},n.Board.prototype.setWeapons=function(t){let e,r;for(let n=0;n<4;n++)e=Math.floor(Math.random()*t.length),r=this.setPiece(t[e])},n.Board.prototype.setPlayers=function(t){for(let e of t){this.setPiece(e)}};(function(t){return new Promise(e=>{const r={},n=Object.entries(t).map(t=>{const[e,n]=t;return function(t){return new Promise((e,r)=>{const n=new Image;n.onload=(()=>{e(n)}),n.onerror=r,n.crossOrigin="anonymous",n.src=t})}(n).then(t=>{r[e]=t})});Promise.all(n).then(()=>{e(r)})})})({lave:"https://i.imgur.com/enx5Xc8.png",player1:"https://i.imgur.com/cTw2F.png",player2:"https://i.imgur.com/fI0sg1o.png"}).then(function(t){let e=new n.Board(10,10);console.log(e);const r=[new o.Obstacle("Lave",t.lave),new o.Obstacle("Lave1",t.lave),new o.Obstacle("Lave2",t.lave),new o.Obstacle("Lave3",t.lave),new o.Obstacle("Lave4",t.lave),new o.Obstacle("Lave5",t.lave),new o.Obstacle("Lave6",t.lave),new o.Obstacle("Lave7",t.lave),new o.Obstacle("Lave8",t.lave),new o.Obstacle("Lave9",t.lave)],a=[new o.Weapon("Dague",t.lave,5),new o.Weapon("Epée",t.lave,10),new o.Weapon("Hache",t.lave,15),new o.Weapon("Fléau",t.lave,20)],i=[new o.Player("Joueur 1",t.player1,100),new o.Player("Joueur 2",t.player2,100)];e.drawBoard(),e.setObstacles(r),e.setWeapons(a),e.setPlayers(i)})},function(t,e){}]);