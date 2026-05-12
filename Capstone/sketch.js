// Tag Game
// Ayeman & Muhammad
// May 4/26

// Globale
let player1, player2;
let map;
let players = [];
let tagTime = 60; //Time befor a tag acurs in frames
let time = 20 * 60; // The amount of time in frames that the game is played

function preload(){
  // called BEFORE SETUP. Won't conclude.
  // Until all loads are complete.
  let temp1 = loadImage("assets/Map-0/player1.png");
  let temp2 = loadImage("assets/Map-0/player2.png");
  map = loadImage("assets/Map-0/map.jpeg")  
  players.push(temp1, temp2);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  player1 = new player(width/3, height/2, 0, 1, [255,0,0],0);
  player2 = new player(width/2, height/2, 0, 2, [0,0,255],1);
}

function draw() {
  tagTime--;
  time --;
  if(tagTime < 0) tagTime = 0;
  if(!(time%60)){
    print(time/60);
  }
  background(220);
  image(map, 0,0);
  player1.action();
  player2.action();
  tag();
  if(time <= 0){
    endScreen();
  }
}

function startMenu(){
  // For the start menu
}

function pauseMenu(){
  // For the pause menu
}

function endScreen(){
  // The end screen for who won
  player1.gameEnd();
  player2.gameEnd();
}

function timer(){
  // This function is to make the timer
}

function powerUps(){
  // This function handles overups
}

function tag(){
  // The player tag logic
  let d = dist(player1.pos.x, player1.pos.y, player2.pos.x, player2.pos.y);
  if(!tagTime){
    if(d <= 40){
      // IF the time has pased betwen tags and they tuch then it shoud be taged
      if(player1.isTaged === 1){
        player2.isTaged = 1; player1.isTaged = 0;
      }
      else if(player2.isTaged === 1){
        player1.isTaged = 1; player2.isTaged = 0;
      }
      print("TAG");
      tagTime = 60;
    }
  }
  
  
}

function playerColisions(){
  // To handle any player collisions
}

function platforms(){
  // This function handless all platform related things
  // Player intractions with platform
  // platform hit boxes


}

class player{
  constructor(x,y,mood, playerNumber, color, isTaged){
    this.pos = createVector(x,y); //player position on screen
    this.vel = createVector(0,0); // current speed and direction
    this.grav = createVector(0,0.50); // downwords force
    this.mood = mood;
    this.playerNumber = playerNumber;
    this.jumpHeight = 10; // This value is the first value that worked
    this.playerSize = 100;
    this.isJumping = 1; // 0 = last frame jump presed, 1 = last frame jump was not preesed
    this.numJumps = 2; // number of jumps the charcter is alowed to perform
    this.color = color;
    this.isTaged = isTaged; // 0 → not taged, 1 → taged 
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
  
  show(){
    // this function will display the character
    
    image(players[this.playerNumber -1], this.pos.x, this.pos.y);

    if(this.isTaged){
      //if taged show the triangle above
      fill(255);
      rect(this.pos.x + 38, this.pos.y - 10,20);
    }
  }

  action(){
    this.show();
    this.movement();
  }

  gameEnd(){
    //Game ended state
    if(this.isTaged){
      print("NO I LOST")
    }
    else{
      print("HAHAH I WON, GG")
    }
  }
} 