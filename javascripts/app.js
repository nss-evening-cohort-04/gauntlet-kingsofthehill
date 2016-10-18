// handle all events here
$(document).ready(function() {
  var playerName = "";
  var playerType = "";
  var weaponName = "";
  var hero = "";
  var villain = "";
  var villainLife;
  var heroLife;
  var nRound;
  var roundBtn = $(".round");
  var livereport = $(".livereport");
  var fighthBtn = $(".card_fight");
 
  /*
    Show the initial view that accepts player name
   */
  $("#player-setup").show();
  $(".caption").hide();

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
        break;
    }

    if (moveAlong) {
      $(".card").hide();
      $("." + nextCard).show();
      // on page load...
      if(nextCard === "card--battleground"){
        // to pick random avatar for hero
        let heroImgs = ["bill.png", "boomhauer.png", "dale.png"];
        let randomNum1 = Math.round(Math.random() * (heroImgs.length - 1));
        let randomNum2 = Math.round(Math.random() * (heroImgs.length - 1));
        let randomImg1 = heroImgs[randomNum1];
        let randomImg2 = heroImgs[randomNum2];
        playerType = playerType.charAt(0).toUpperCase() + playerType.slice(1);
        if (playerType.toLowerCase() === "surprise me"){
          playerType = null;
        }
        weaponName = weaponName.charAt(0).toUpperCase() + weaponName.slice(1).toLowerCase();
        hero = new Gauntlet.Combatants.Human(playerName);
        hero.generateClass(playerType);
        hero.setWeapon(new coldWeapon[weaponName]());
        hero.setSpell(new Gauntlet.SpellBook.Sphere());
        $(".hero-profile").html(hero.toString()).after(`<div id="hero_img" class="avatar" style="height:385px"><img id="hero_static" src="img/boom_static.png"></div>`);
        // $(".hero-profile").html(hero.toString());
        heroLife = hero.health;

        villain = new Gauntlet.Combatants.Orc();
        villain.generateClass();
        villain.setWeapon(new coldWeapon.Broadsword());
        villain.setSpell(new Gauntlet.SpellBook.Sphere());
        $(".villain-profile").html(villain.toString()).after(`<div class="avatar"><img src="img/${randomImg2}"></div>`);
        villainLife = villain.health;

        setGame();
      }
    }
  });

  /*
    When the back button clicked, move back a view
   */
  $(".card__back").click(function(e) {
    hero = "";
    villain = "";
    $(".avatar").remove();
    var previousCard = $(this).attr("previous");
    $(".card").hide();
    $("." + previousCard).show();
  });

  // when mouse over, show detail
  $(".btn--blue").hover(
    function(){
      $(this).next().show();
    },
    function(){
      $(this).next().hide();
    }
  );
  
  // when role button clicked, store the button value
  $(".card__button").click(function(e){
    var $target = $(this);
    if ($("#class-select").css("display") === "block"){
      playerType = $($target).find(".btn__text").text();
    } else if ($("#weapon-select").css("display") === "block"){
      weaponName = $($target).find(".btn__text").text();
    }
  })

  // attack button action (hero vs villain)
  $(fighthBtn).click(function(){
    let btnText = $(this).find(".btn__text").text().toLowerCase();
    if(btnText === "Attack".toLowerCase()){
      fight();
    } else if(btnText === "play again".toLowerCase()){
      playAgain();
    }
    $(this).css("background-color", "green");
  });
  
  function fight(){

    $("#hero_static").hide();
    $("#hero_img").addClass("boom");
    hero.attack(villain);
    $(livereport).html(`Hero attacked villain<br>caused ${hero.totalDamage} damage`);
    moveProgressBar(villain.health, villainLife, "#villainWrap", "#villainProgress");
    if(villain.health <= 0){
      $(livereport).html(`<div class="livereport">Hero wins!</div>`);
      endGame();
      return;
    }

    setTimeout(function(){
      villain.attack(hero);
      $(livereport).html(`Villain attacked hero<br>caused ${villain.totalDamage} damage`);
      moveProgressBar(hero.health, heroLife, "#heroWrap", "#heroProgress");
      if (hero.health <= 0){
        $(livereport).html(`<div class="livereport">Hero lost!</div>`);
        endGame();
        return;
      }
      setTimeout(function(){
        $(roundBtn).html(`round ${++nRound}`);
        $(livereport).html("");
      }, 1000);
    }, 1000);

    setTimeout(function(){
      $("#hero_static").show();
      $("#hero_img").removeClass("boom");
    }, 1000);
  } // end of fight function

  function playAgain(){
    hero.health = heroLife;
    villain.health = villainLife;
    setGame();
    $(fighthBtn).find(".btn__text").text("Attack"); 
  } // end of playAgain function

  function endGame(){
    $(fighthBtn).css("background-color", "green").find(".btn__text").text("play again");
  } // end of endGame function

  function setGame(){
    nRound = 1;
    $(roundBtn).html(`round ${nRound}`);
    $(livereport).html("");
    moveProgressBar(villain.health, villainLife, "#villainWrap", "#villainProgress");
    moveProgressBar(hero.health, heroLife, "#heroWrap", "#heroProgress");
    $(fighthBtn).css("background-color", "green");
  } // endof of resetRoundBtn function


  // SIGNATURE PROGRESS
  function moveProgressBar(updatedLife, fullLife, wrap, progress) {
    var getPercent = updatedLife / fullLife;
    var getProgressWrapWidth = $(wrap).width();
    var progressTotal = Math.max(getPercent, 0) * getProgressWrapWidth;
    var animationLength = 0;
    // on page load, animate percentage bar to data percentage length
    // .stop() used to prevent animation queueing
    $(progress).stop().animate({
        left: progressTotal
    }, animationLength);
  } // end of moveProgressBar function
  // on browser resize progress bar
  $(window).resize(function() {
    moveProgressBar(hero.health, heroLife, "#heroWrap", "#heroProgress");
    moveProgressBar(villain.health, villainLife, "#villainWrap", "#villainProgress");
  });

}); // end of document ready function
