var PLAYER_START_X = 200; 
var PLAYER_START_Y = 400;
var STEP_X =100; // moves 100px horizontally
var STEP_Y = 80; // moves 80px vertically 
var WIN_X = 200;
var WIN_Y = 80;
var NUMBER_OF_BUGS = 3;
var YOU_WIN = false;
var PLAYER_RIGHT_BOUND_X= 400;
var PLAYER_LEFT_BOUND_X= 0;
var PLAYER_UP_BOUND_Y = 80
var PLAYER_DOWN_BOUND_Y = 400;
var STAR_X = 200;
var STAR_Y = 80;



var DIFF_SPEEDS = [100,150,200]; // array containing different enemy speeds
var BUG_START_Y = [65,145,225]; // array containing starting Y value for the bugs for different rows

// returns a random number between 0 and a(exclusive) 
var randomNumber = function(a) {
    return Math.floor((Math.random() * a));
}

var Star = function() {
    this.sprite = 'images/Star.png';
    this.x = STAR_X;
    this.y = STAR_Y;
}

Star.prototype.render = function() {
    if(!YOU_WIN)
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Star.prototype.hide = function() {
    this.x = -500;
    this.y = -500;
}


// Enemies our player must avoid
var Enemy = function(x,y,speed) {
    // Variables applied to each of our instances go here
    this.sprite = 'images/enemy-bug.png'; // The image/sprite for our enemies
    this.x=x;
    this.y=y;
    this.speed=speed;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    if(this.x>=505){ // Check if x value is greater than the width of the canvas
        var randomRow = randomNumber(3);
        var randomSpeed = randomNumber(3);
        this.x=0; // Reset enemy to the left of the canvas
        this.y = BUG_START_Y[randomRow]; // Decides the Y value for the enemy randomly from BUGSTARTY array on update.
        this.speed = DIFF_SPEEDS[randomSpeed]; //Decides the speed of the enemy randomly from DIFFSPEEDS array on update.
    }
    this.x += this.speed *dt; // Multiply movement by the dt parameter will ensure that the game runs at the same speed for all computers.
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    if(!YOU_WIN)
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);  
}

// Writing the player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(x,y) {
    this.sprite = 'images/char-boy.png';
    this.x=x;
    this.y=y;
}

//Check for collisions and win state
Player.prototype.update = function(dt) {
   for(var i=0;i<NUMBER_OF_BUGS;i++){ //Loop through the bugs
    /* Detecting collison by checking if the player and enemies are within certain distance (50) of each other. 
    If collision is detected, then the game is reset and player gets back to its initial position */
        if (Math.abs(this.x - allEnemies[i].x)<50 && Math.abs(this.y - allEnemies[i].y)<50) { 
            this.x = PLAYER_START_X;
            this.y = PLAYER_START_Y;
        }
    }

    if (Math.abs(this.x - star.x)<50 && Math.abs(this.y - star.y)<50) { 
            star.hide();
        }


    /* Checking Win state [The player makes it to the center tile of the last stone blocks row(below water)]. 
    The timeout function waits for 1000 ms after player reaches win position and then resets the game */

    if(this.y == WIN_Y && this.x == WIN_X){  
        setTimeout(function(){ 
           YOU_WIN = true;
        },200);        
    }
}

//Draw the Player on the screen
Player.prototype.render = function() {
    if(!YOU_WIN)
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);    
}

//Handling player input and keeping the player within bounds. 
Player.prototype.handleInput = function(key) {  
    var changedposition; 
    switch(key) {
        case "up":
            changedposition = this.y-STEP_Y; // Moving up 80px
            if(changedposition>=PLAYER_UP_BOUND_Y){  //Check if player is within bounds up(Should be greater than or equal to 80). Player cannot move on water blocks
                this.y=changedposition;
            }    
            else{
                this.y=PLAYER_UP_BOUND_Y;
            }
            break;
        case "down": 
            changedposition = this.y + STEP_Y; // Moving down 80px
            if(changedposition<=PLAYER_DOWN_BOUND_Y){// Check if player is within bounds down(Should be less than or equal to 400). 
                this.y = changedposition;
            }
            else{
                this.y = PLAYER_DOWN_BOUND_Y;
            }
            break;
        case "left": 
            changedposition = this.x - STEP_X; // Moving left 100px
            if(changedposition>=PLAYER_LEFT_BOUND_X){ // Check if player is within bounds on the left side(Should be greater than or equal to 0).
                this.x=changedposition;
            }
            else{
                this.x = PLAYER_LEFT_BOUND_X;
            }
            break;
        case "right": 
            changedposition = this.x + STEP_X; // Moving right 100px
            if(changedposition<=PLAYER_RIGHT_BOUND_X){ // Check if player is within bounds on the right side(Should be less than or equal to 400).
                this.x=changedposition;
            }
            else{
                this.x = PLAYER_RIGHT_BOUND_X;
            }
            break;
        default: 
            return;
        
    }
        
    console.log(this.x, this.y);   
}


// Instantiating the objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [];
var star = new Star();
var player = new Player(PLAYER_START_X, PLAYER_START_Y);        

// Creating enemies and pushing them in allEnemies array
var createBugs = function() {
    for(var i=0;i<NUMBER_OF_BUGS;i++){
        var randomx = randomNumber(300);
        var randomRow = randomNumber(3);
        var randomSpeed = randomNumber(3);
        var enemy = new Enemy(randomx,BUG_START_Y[randomRow],DIFF_SPEEDS[randomSpeed]);
        allEnemies.push(enemy);
    }
}
   
createBugs();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
