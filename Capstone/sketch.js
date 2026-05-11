// Tag Game
// Ayeman & Muhammad
// May 4/26

// Globale
let player1, player2;
let map = [];
let players = [];

function preload(){
  // called BEFORE SETUP. Won't conclude.
  // Until all loads are complete.
  let temp1 = loadImage("assets/Map-0/player1");
  let temp2 = loadImage("assets/Map-0/player2");  
  players.push(temp1, temp2);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  player1 = new player(width/3, height/2, 0, 1, [255,0,0]);
  player2 = new player(width/2, height/2, 0, 2, [0,0,255]);
}

function draw() {
  background(220);
  player1.action();
  player2.action();
}

function startMenu(){
  // For the start menu
}

function pauseMenu(){
  // For the pause menu
}

function endScreen(){
  // The end screen for who won
}

function timer(){
  // This function is to make the timer
}

function powerUps(){
  // This function handles overups
}

function tag(){
  // The player tag logic
}

function playerColistions(){
  // To handle any player collisions
}

function platforms(){
  // This function handless all platform related things
  // Player intractions with platform
  // platform hit boxes


}

class player{
  constructor(x,y,mood, playerNumber, color){
    this.pos = createVector(x,y); //player position on screen
    this.vel = createVector(0,0); // current speed and direction
    this.grav = createVector(0,0.50); // downwords force
    this.mood = mood;
    this.playerNumber = playerNumber;
    this.jumpHeight = 10; // This value is the first value that worked
    this.playerSize = 50;
    this.isJumping = 1; // 0 = last frame jump presed, 1 = last frame jump was not preesed
    this.numJumps = 2; // number of jumps the charcter is alowed to perform
    this.color = color;
  }

  movement(){
    // This function will handle all movement
    this.vel.add(this.grav);
    this.pos.add(this.vel);

    if(this.playerNumber === 1){
      if(keyIsDown(LEFT_ARROW)){
        this.vel.x = -6;
      }
      if(keyIsDown(RIGHT_ARROW)){
        this.vel.x = 6;
      }
      
      if(keyIsDown(DOWN_ARROW)){
        // If the player has a anilitey to go down they can

      }

      if(keyIsDown(UP_ARROW)){
        if(this.numJumps > 0 && !this.isJumping){
          this.vel.y = -this.jumpHeight;
          this.numJumps -= 1;
        }
      }

      if(!(keyIsDown(RIGHT_ARROW) || keyIsDown(LEFT_ARROW) || keyIsDown(UP_ARROW) || keyIsDown(DOWN_ARROW))){
        // Stop movemnet if the player is not hiting any keys
        this.vel.x = 0;
      }
      this.isJumping = keyIsDown(UP_ARROW);
      //print(this.isJumping);
    }

    if(this.playerNumber === 2){
      if(keyIsDown(65)){
        this.vel.x = -6;
      }
      if(keyIsDown(68)){
        this.vel.x = 6;
      }
      
      if(keyIsDown(83)){
        // If the player has a anilitey to go down they can

      }

      if(keyIsDown(87)){
        if(this.numJumps > 0 && !this.isJumping){
          this.vel.y = -this.jumpHeight;
          this.numJumps -= 1;
        }
      }

      if(!(keyIsDown(87) || keyIsDown(83) || keyIsDown(68) || keyIsDown(65))){
        // Stop movemnet if the player is not hiting any keys
        this.vel.x = 0;
      }
      this.isJumping = keyIsDown(87);
      //print(this.isJumping);
    }


    if((this.pos.y > height -this.playerSize) && this.vel.y > 0){ 
      // the and condition makes shure I am actuly falling to alow me to also jump
      this.pos.y = height -this.playerSize;
      this.vel.y = 0;
      this.numJumps = 2;
    }


    
  }

  jump(){
    if(keyIsDown(UP_ARROW)){
      // - is up because 0 to height
      this.y -= this.jumpHeight;
      if(this.y > height) this.y = height;
    }
  }

  gravity(){
    // This function gives the player gravity
    //acceleration down
    this.ySpeed += GRAVITY;
    this.y = this.y + this.ySpeed;

    if(this.y > height -this.playerSize) this.y = height -this.playerSize;
    
    //reduse slowly
    this.ySpeed = this.ySpeed * 0.997;
    
  }
    
  

  show(){
    // this function will display the character
    if(this.playerNumber === 1){
      
    }
    else if(this.playerNumber === 2){

    }
    rect(this.pos.x,this.pos.y, this.playerSize,this.playerSize);
  }

  action(){
    this.show();
    this.movement();
    //this.gravity();
  }
} 