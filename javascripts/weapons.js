var Weapon = function() {
  this.name = "bare hands";
  this.damage = 1;
  this.hands = 2;

  this.toString = function() {
    return this.name;
  }
};

var coldWeapon = {};

coldWeapon.Dagger = function() {
  this.name = "dagger";
  this.damage = 4;
  this.hands = 1;
};
coldWeapon.Dagger.prototype = new Weapon();

coldWeapon.Broadsword = function() {
  this.name = "broad sword";
  this.damage = 14;
  this.hands = 2;
};
coldWeapon.Broadsword.prototype = new Weapon();

coldWeapon.Waraxe = function() {
  this.name = "war axe";
  this.damage = 18;
  this.hands = 2;
};
coldWeapon.Waraxe.prototype = new Weapon();

