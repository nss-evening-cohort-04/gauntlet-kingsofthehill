/*
  Test code to generate a human player and an orc player
 */
// var warrior = new Gauntlet.Combatants.Human();
// warrior.setWeapon(new WarAxe());
// warrior.generateClass();  // This will be used for "Surprise me" option
// console.log(warrior.toString());

// var orc = new Gauntlet.Combatants.Orc();
// orc.generateClass();
// orc.setWeapon(new BroadSword());
// console.log(orc.toString());

/*
  Test code to generate a spell
 */
// var spell = new Gauntlet.SpellBook.Sphere();
// console.log("spell: ", spell.toString());


$(document).ready(function() {
  var playerName = "";
  var playerType = "";
  var weaponName = "";
  var hero = "";
  var villain = "";
  var villainLife;
  var heroLife;
  /*
    Show the initial view that accepts player name
   */
  $("#player-setup").show();

  /*
    When any button with card__link class is clicked,
    move on to the next view.
   */
  $(".card__link").click(function(e) {
    e.stopPropagation();
    var nextCard = $(this).attr("next");
    var moveAlong = false;

    switch (nextCard) {
      case "card--class":
        playerName = $("#player-name").val()
        moveAlong = (playerName !== "");
        break;
      case "card--weapon":
        moveAlong = (playerType !== "");
        break;
      case "card--battleground":
        moveAlong = (weaponName !== "");
        hero = new Gauntlet.Combatants.Human(playerName);
        hero.generateClass(playerType);  // This will be used for "Surprise me" option
        hero.setWeapon(new coldWeapon[weaponName]());
        hero.setSpell(new Gauntlet.SpellBook.Sphere());
        console.log(hero.toString(), hero.totalDamage, hero.strength);
        heroLife = hero.health;

        villain = new Gauntlet.Combatants.Orc();
        villain.generateClass();
        villain.setWeapon(new coldWeapon.BroadSword());
        console.log(villain.toString(),villain.totalDamage, villain.health);
        villainLife = villain.health;
        break;
    }

    if (moveAlong) {
      $(".card").hide();
      $("." + nextCard).show();
    }
  });

  /*
    When the back button clicked, move back a view
   */
  $(".card__back").click(function(e) {
    var previousCard = $(this).attr("previous");
    $(".card").hide();
    $("." + previousCard).show();
  });

  // when role button clicked, store the button value
  $(".card__button").click(function(e){
    var $target = $(this);
    if ($("#class-select").css("display") === "block"){
      playerType = ($($target).find(".btn__text").text()).toLowerCase();
      playerType = playerType.charAt(0).toUpperCase() + playerType.slice(1);
      if (playerType.toLowerCase() === "surprise me"){
        playerType = null;
      }
    } else if ($("#weapon-select").css("display") === "block"){
      weaponName = $($target).find(".btn__text").text();
    }
  })

  // attack button action (hero vs villain)
  $(".card_fight").click(function(e){
    // on page load...
    hero.attack(villain);
    console.log("villain", villain.health);
    // if(villain.health <= 0){
    //   alert("Hero wins!");
    //   return;
    // }
    villain.attack(hero);
    console.log("hero", hero.health);

    moveProgressBar(hero.health, heroLife, "#heroWrap", "#heroProgress");
    moveProgressBar(villain.health, villainLife, "#villainWrap", "#villainProgress");
    // on browser resize...
    $(window).resize(function() {
      moveProgressBar(villain.healthheroLife, "#heroWrap", "#heroProgress");
      moveProgressBar(villain.health, villainLife, "#villainWrap", "#villainProgress");
    });

    // SIGNATURE PROGRESS
    function moveProgressBar(updatedLife, fullLife, wrap, progress) {
      console.log("moveProgressBar");
        var getPercent = updatedLife / fullLife;
        var getProgressWrapWidth = $(wrap).width();
        var progressTotal = getPercent * getProgressWrapWidth;
        var animationLength = 500;
        
        // on page load, animate percentage bar to data percentage length
        // .stop() used to prevent animation queueing
        $(progress).stop().animate({
            left: progressTotal
        }, animationLength);
    }
    if(villain.health <= 0){
      alert("Hero wins!");
    return;
    }
    if (hero.health <= 0){
      alert("Hero lost!");
      return;
    }
  })
});