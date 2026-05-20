// Tag Game
// Muhammad & Ayeman
// May 4/26

// Globale
let players = [];
let map;
let playersImgs = [];
let tagTime = 60; //Time befor a tag acurs in frames
let time = 100 * 60; // The amount of time in frames that the game is played
let numPlayers = 4;
let playerTaged;
let platformImg = [];
let platformColor;
let platform = [];

function preload(){
  // called BEFORE SETUP. Won't conclude.
  // Until all loads are complete.
  for(let i = 1; i <= numPlayers; i++){
    playersImgs.push(loadImage("assets/Map-0/player"+ i + ".png"));
  }
  map = loadImage("assets/Map-0/map.jpeg");
  platformImg = loadImage("assets/Map-0/platform.png"); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  for(let i = 0; i < numPlayers; i++){
    players.push(new Player(width/2, height/2, 0, i, [255,0,0],0));
  }
  let r = int(random(0,numPlayers));
  players[r].isTaged = 1;
  playerTaged = r;
  platformColor = [0, 255, 255];
  platform = detectPlatforms(platformColor, platformImg);
}

function draw() {
  timer();
  background(220);
  image(map, 0,0);
  for(let p in players){
    players[p].action();
  }
  tag();
  textSize(50);
  fill(0);
  text(mouseX + ", "+ mouseY , mouseX, mouseY);
}

function startMenu(){
  // For the start menu
}

function pauseMenu(){
  // For the pause menu
}

function endScreen(){
  // The end screen for who won
  for(let p in players){
    players[p].gameEnd();
  }
}

function timer(){
  // This function is responsable for all time related code
  tagTime--; //for taging 
  time --; // game time
  if(tagTime < 0) tagTime = 0; // reset tag time to reuse

  if(time <= 0){
    // if the game time is over then the game is over
    endScreen();
  }

  else{
    if(!(time%60)){
      // prints the time every 1 sec so 60 frames
      print(time/60);
    }
  
  }
   
}

function powerUps(){
  // This function handles overups
}

function tag(){
  // The player tag logic

  // UPDATED CODE → Works with multaple players

  if(!tagTime){
    // time btween tags has passed
    for(let p in players){
      if(!(p === playerTaged)){
        // compare distance of taged player to everyother player
        let d = dist(players[playerTaged].pos.x, players[playerTaged].pos.y, players[p].pos.x, players[p].pos.y);
        if(d <= 40){
          // IF the time has pased betwen tags and they tuch then it shoud be taged
          players[p].isTaged = 1; 
          players[playerTaged].isTaged = 0;
          print("TAG");
          tagTime = 60;
          playerTaged = p;
          break;
        }
      }
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

class Player{
  constructor(x,y,mood, playerNumber, color, isTaged){
    this.pos = createVector(x,y); //player position on screen
    this.vel = createVector(0,0); // current speed and direction
    this.grav = createVector(0,0.50); // downwords force
    this.mood = mood;
    this.playerNumber = playerNumber;
    this.playerSize = 200; 
    this.jumpHeight = this.playerSize/14; // This value is the first value that worked
    this.isJumping = 1; // 0 = last frame jump presed, 1 = last frame jump was not preesed
    this.numJumps = 2; // number of jumps the charcter is alowed to perform
    this.color = color;
    this.isTaged = isTaged; // 0 → not taged, 1 → taged 
    this.baseSpeed = 8;
    this.boost = 1;
    this.gameOver = 1; // 1 → means game is not over, 0 → game is over 
  }

  movement(){
    // This function will handle all movement

    if(this.gameOver){
      // cant move if game is over
      this.vel.add(this.grav);
      this.pos.add(this.vel);
  
      if(this.playerNumber === 0){
        if(keyIsDown(LEFT_ARROW)){
          if(this.isTaged){
            this.vel.x = -(this.baseSpeed + this.boost);
          } 
          else{
            this.vel.x = -this.baseSpeed;
          }
          
          print(this.pos.x);

          if(this.pos.x < 0 - this.playerSize/3) {
            // Stops player from going off screen uses the player size to alow for the player
            // to hit the edge
            this.pos.x = 0 - this.playerSize/3;
            this.vel.x = 0;
            
          }
        }

        if(keyIsDown(RIGHT_ARROW)){
          if(this.isTaged) this.vel.x = this.baseSpeed + this.boost;
          else this.vel.x = this.baseSpeed;
          if(this.pos.x > width - (this.playerSize/3) * 2) {
            // Stops player from going off screen uses the player size to alow for the player
            // to hit the edge
            this.pos.x = width - (this.playerSize/3) * 2;
            this.vel.x = 0;
          }
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
        
      }
  
      if(this.playerNumber === 1){
        if(keyIsDown(65)){
          if(this.isTaged) this.vel.x = -(this.baseSpeed + this.boost);
          else this.vel.x = -this.baseSpeed;
          if(this.pos.x < 0 - this.playerSize/3) {
            // Stops player from going off screen uses the player size to alow for the player
            // to hit the edge
            this.pos.x = 0 - this.playerSize/3;
            this.vel.x = 0;
            
          }
        }
        if(keyIsDown(68)){
          if(this.isTaged) this.vel.x = this.baseSpeed + this.boost;
          else this.vel.x = this.baseSpeed;
          if(this.pos.x > width - (this.playerSize/3) * 2) {
            // Stops player from going off screen uses the player size to alow for the player
            // to hit the edge
            this.pos.x = width - (this.playerSize/3) * 2;
            this.vel.x = 0;
          }
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
        
      }
      
      if(this.playerNumber === 2){
        if(keyIsDown(74)){
          if(this.isTaged) this.vel.x = -(this.baseSpeed + this.boost);
          else this.vel.x = -this.baseSpeed;
          if(this.pos.x < 0 - this.playerSize/3) {
            // Stops player from going off screen uses the player size to alow for the player
            // to hit the edge
            this.pos.x = 0 - this.playerSize/3;
            this.vel.x = 0;
            
          }
        }
        if(keyIsDown(76)){
          if(this.isTaged) this.vel.x = this.baseSpeed + this.boost;
          else this.vel.x = this.baseSpeed;
          if(this.pos.x > width - (this.playerSize/3) * 2) {
            // Stops player from going off screen uses the player size to alow for the player
            // to hit the edge
            this.pos.x = width - (this.playerSize/3) * 2;
            this.vel.x = 0;
          }
        }
        
        if(keyIsDown(75)){
          // If the player has a anilitey to go down they can
  
        }
  
        if(keyIsDown(73)){
          if(this.numJumps > 0 && !this.isJumping){
            this.vel.y = -this.jumpHeight;
            this.numJumps -= 1;
          }
        }
  
        if(!(keyIsDown(74) || keyIsDown(76) || keyIsDown(73) || keyIsDown(75))){
          // Stop movemnet if the player is not hiting any keys
          this.vel.x = 0;
        }
        this.isJumping = keyIsDown(87);
      }

      if(this.playerNumber === 3){
        if(keyIsDown(70)){
          if(this.isTaged) this.vel.x = -(this.baseSpeed + this.boost);
          else this.vel.x = -this.baseSpeed;
          if(this.pos.x < 0 - this.playerSize/3) {
            // Stops player from going off screen uses the player size to alow for the player
            // to hit the edge
            this.pos.x = 0 - this.playerSize/3;
            this.vel.x = 0;
            
          }
        }
        if(keyIsDown(72)){
          if(this.isTaged) this.vel.x = this.baseSpeed + this.boost;
          else this.vel.x = this.baseSpeed;
          if(this.pos.x > width - (this.playerSize/3) * 2) {
            // Stops player from going off screen uses the player size to alow for the player
            // to hit the edge
            this.pos.x = width - (this.playerSize/3) * 2;
            this.vel.x = 0;
          }
        }
        
        if(keyIsDown(71)){
          // If the player has a an abilitey to go down they can
  
        }
  
        if(keyIsDown(84)){
          if(this.numJumps > 0 && !this.isJumping){
            this.vel.y = -this.jumpHeight;
            this.numJumps -= 1;
          }
        }
  
        if(!(keyIsDown(84) || keyIsDown(70) || keyIsDown(72) || keyIsDown(71))){
          // Stop movemnet if the player is not hiting any keys
          this.vel.x = 0;
        }
        this.isJumping = keyIsDown(87);
      }
  
      if((this.pos.y > height -this.playerSize) && this.vel.y > 0){ 
        // the and condition makes shure I am actuly falling to alow me to also jump
        this.pos.y = height -this.playerSize;
        this.vel.y = 0;
        this.numJumps = 2;
      }
    }
    
  }
  
  show(){
    // this function will display the character
    
    image(playersImgs[this.playerNumber], this.pos.x, this.pos.y);
    playersImgs[this.playerNumber].resize(this.playerSize, this.playerSize);
    if(this.isTaged){
      //if taged show the triangle above
      fill(255);
      rect(this.pos.x + (this.playerSize/2 - 10), this.pos.y - 10, this.playerSize/8);
    }
  }

  action(){
    this.show();
    this.movement();
  }

  gameEnd(){
    //Game ended state
    if(this.gameOver){
      if(this.isTaged){
        print("NO I LOST")
      }
      else{
        print("HAHAH I WON, GG")
      }
      this.gameOver = 0;
    }
  }
} 