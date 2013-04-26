/*
Original code by http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/

Translated to spanish by Xavier Aznar at http://self_loving.blogspot.com/2013/01/como-crear-un-sencillo-juego-con.html

Modifications:
-Don't reset hero position by Drew Long http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/#comment-606684891
-Toroidal board by Ryan Kane http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/#comment-595012625

My additions:
+ Constants (improve legibility)
+ Monster runs from hero
+ Monster increases speed based on monstersCaught (so it gets difficult to catch new monsters)
+ Tombstones mark where monsters has been caught by the hero

*/

// Define constants
var TECLA_ARRIBA    = 38,
    TECLA_ABAJO     = 40,
    TECLA_DERECHA   = 39,
    TECLA_IZQUIERDA = 37,
    CANVAS_WIDTH    = 512,
    CANVAS_HEIGHT   = 480;
    
var monsterGraveyard = new Array();

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "images/hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
    monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Dead Monster image
var deadMonsterReady = false;
var deadMonsterImage = new Image();
deadMonsterImage.onload = function () {
    deadMonsterReady = true;
};
deadMonsterImage.src = "images/deadmonster.png";

// Game objects
var hero = {
    speed: 256 // movement in pixels per second
};
var monster = {
    speed : 5  // movement in pixels per second
};
var monstersCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var start = true;

var reset = function () {
    if (start){
        hero.x = canvas.width / 2;
        hero.y = canvas.height / 2;
        start = false;
    }
    // Throw the monster somewhere on the screen randomly
    monster.x = 32 + (Math.random() * (canvas.width - 64));
    monster.y = 32 + (Math.random() * (canvas.height - 64));
    monster.speed = (monster.speed > 100 ) ? ( monster.speed) : (monster.speed + monstersCaught);
};

// Update game objects
var update = function (modifier) {
    if (TECLA_ARRIBA in keysDown) { // Player holding up
        hero.y = (hero.y > 0) ? (hero.y - hero.speed * modifier) : canvas.height - 32;
        monster.y = ( monster.y >0 ) ? ( monster.y - monster.speed * modifier ) : canvas.height - 32;
    }

    if (TECLA_ABAJO in keysDown) { // Player holding down
        hero.y = (hero.y + hero.speed * modifier) % canvas.height;
        monster.y = ( monster.y + monster.speed * modifier) % canvas.height;
    }

    if (TECLA_IZQUIERDA in keysDown) { // Player holding left
        hero.x = (hero.x > 0) ? (hero.x - hero.speed * modifier) : canvas.width - 32;
        monster.x = (monster.x > 0) ? (monster.x - monster.speed * modifier) : canvas.width - 32;
    }

    if (TECLA_DERECHA in keysDown) { // Player holding right
        hero.x = (hero.x + hero.speed * modifier) % canvas.width;
        monster.x = (monster.x +  monster.speed * modifier) % canvas.width;
    }

    // Are they touching?
    if (
        hero.x <= (monster.x + 32)
        && monster.x <= (hero.x + 32)
        && hero.y <= (monster.y + 32)
        && monster.y <= (hero.y + 32)
    ) {
        ++monstersCaught;
        monsterGraveyard.push({"x": monster.x, "y": monster.y });
        reset();   
    }
};


// Draw everything
var render = function () {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }

    if (deadMonsterReady) {
        for (deadMonster in monsterGraveyard) {
            ctx.drawImage(deadMonsterImage, monsterGraveyard[deadMonster].x ,monsterGraveyard[deadMonster].y)
        }
    }
    
    if (heroReady) {
        ctx.drawImage(heroImage, hero.x, hero.y);
    }

    if (monsterReady) {
        ctx.drawImage(monsterImage, monster.x, monster.y);
    }


    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Goblins cazados: " + monstersCaught, 32, 32);
};

// The main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;

    update(delta / 1000);
    render();

    then = now;
};

// Let's play this game!
reset();
var then = Date.now();
setInterval(main, 1); // Execute as fast as possible
