module.exports = Player;

function Player(name, health, weapon) {
  this.name = name;
  this.health = health;

  this.weapon = weapon;
  this.location = {};
}

Player.prototype.setLocation = function (location) {
  this.location = location;
};