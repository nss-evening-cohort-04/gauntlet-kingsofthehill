/*
  TODO: Modularize this code with IIFE or Browserify
 */
var Gauntlet = Gauntlet || {};
Gauntlet.Combatants = {};

/*
  Define the base object for any player of Gauntlet,
  whether a human player or a monster.
 */
Gauntlet.Combatants.Player = function(name) {
  this.species = null;
  this.class = null;
  this.weapon = null;
  this.spell = null;

  this.playerName = name || "unknown adventurer";
  this.health = Math.floor(Math.random() * 40 + 50);
  this.limbs = ["head", "neck", "arm", "leg", "torso"];
  this.skinColor = "gray";
  this.skinColors = [this.skinColor];
  this.strength = 90;
  this.intelligence = 90;
  this.totalDamage = 1;

  this.toString = function() {
    var output = [this.playerName,
      ": a ",
      this.skinColor,
      " skinned ",
      this.species,
      " ",
      this.class,
      " with ",
      this.health,
      " health. ",
      (this.class.magical) ? ("Able to cast " + this.spell.toString()) : (" Wielding a " + this.weapon.toString()),
      "!"
    ].join("");
    return output;
  };
};

Gauntlet.Combatants.Player.prototype.setWeapon = function(newWeapon) {
  this.weapon = newWeapon;
  this.totalDamage = Math.round(this.weapon.damage * (1 + this.strength / 200));
}

Gauntlet.Combatants.Player.prototype.setSpell = function(newSpell) {
  if (this.class.magical === true){
    this.spell = newSpell;
    this.totalDamage += this.spell.damage;
  }
}

Gauntlet.Combatants.Player.prototype.attack = function(target) {
  target.health -= this.totalDamage;
}

Gauntlet.Combatants.Player.prototype.generateClass = function(playerType) {
  // Get a random index from the allowed classes array
  var random = Math.round(Math.random() * (this.allowedClasses.length - 1));

  // Get the string at the index
  var randomClass = this.allowedClasses[random];

  // Composes the corresponding player class into the player object
  this.class = new Gauntlet.GuildHall[playerType || randomClass]();

  // Add the health bonus
  this.health += this.class.healthBonus;

  // Add the strength bonus
  this.strength += this.class.strengthBonus;
  return this.class;
};

/*
  Define the base properties for a human in a 
  constructor function.
 */
Gauntlet.Combatants.Human = function(name) {
  Gauntlet.Combatants.Player.call(this, name);
  var randomSkin;

  this.species = "Human";
  this.intelligence = this.intelligence + 20;

  this.skinColors.push("brown", "red", "white", "disease");
  randomSkin = Math.round(Math.random() * (this.skinColors.length-1));
  this.skinColor = this.skinColors[randomSkin];

  this.allowedClasses = ["Warrior", "Berserker", "Valkyrie", "Monk"];
};

Gauntlet.Combatants.Human.prototype = new Gauntlet.Combatants.Player();


/*
  Define the base properties for a monster in a 
  constructor function.
 */
Gauntlet.Combatants.Monster = function() {
  this.health = this.health - 30;
  this.intelligence = this.intelligence -20;
  this.strength = this.strength + 30;
};

Gauntlet.Combatants.Monster.prototype = new Gauntlet.Combatants.Player();

