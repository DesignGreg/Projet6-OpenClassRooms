module.exports = Player;

function Player(name, health, weapon) {
    this.name = name;
    this.health = health;

    this.weapon = weapon;
    // Pour stocker l'arme en trop qui sera replacer sur la case au prochain tour
    this.secondaryWeapon = {};
    this.attack = false;
    this.defend = false;
    this.order = 'Posture';
    this.location = {};
}

Player.prototype.setLocation = function (location) {
    this.location = location;
};