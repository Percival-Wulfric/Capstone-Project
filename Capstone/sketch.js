// Tag Game
// Muhammad & Ayeman
// May 4/26

// Globale
let players = [];
let map;
let tagTime = 60; //Time befor a tag acurs in frames
let time = 100 * 60; // The amount of time in frames that the game is played
let numPlayers = 1; // starts from 0
let playerTaged;
let platformImg = [];
let platformColor;
let platform = [];
let t; //time in seconds

// player imgs 2d arays for animation
let player1Imgs = [[], [], []]; // idel, jump, run
let player2Imgs = [[], [], []];
let player3Imgs = [[], [], []];
let player4Imgs = [[], [], []];
let playerImgs = [[], [], [], []]; // player 1, 2,3,4
let numJumpImgs = 16;
let numIdelImgs = 4;
let numRunImgs = 16;
let numMap = 1;

let playerMovementKeys = [[LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW], [65, 68, 87, 83], [74, 76, 73, 75], [70, 72, 84, 71]]; // player 1, 2, 3, 4
function preload(){
  // called BEFORE SETUP. Won't conclude.
  // Until all loads are complete.
  // for(let i = 1; i <= numPlayers; i++){
  //   playersImgs.push(loadImage("assets/Map-0/player"+ i + ".png"));
  // }
  map = loadImage("assets/Map-" + numMap +"/map.jpg");
  platformImg = loadImage("assets/Map-" + numMap +"/platforms.jpg");
  
  // player imgs
  for(let n = 0; n <= numPlayers; n++){ //loop thrue players
    playerImgs.push([]); // player array
    playerImgs[n].push([],[],[]); // individula aryas for animation sets
    for(let r = 1; r <= numJumpImgs; r++){
      playerImgs[n][1].push(loadImage("assets/Map-" + numMap +"/Player (" + n + ")/jump/jump ("+ r +").png"));
    }
    for(let l = 1; l <= numRunImgs; l++){
      playerImgs[n][2].push(loadImage("assets/Map-" + numMap +"/Player (" + n + ")/run/run ("+ l +").png"));
    }
    for(let i = 1; i <= numIdelImgs; i++){
      playerImgs[n][0].push(loadImage("assets/Map-" + numMap +"/Player (" + n + ")/idle/idle ("+ i +").png"));
    }
  }
}

function setup() {
  createCanvas(1912, 1076);
  pixelDensity(1);
  noStroke();
  for(let i = 0; i < numPlayers; i++){
    players.push(new Player(width/2, height/2, 0, i, [255,0,0],0));
  }
  let r = int(random(0,numPlayers));
  players[r].isTaged = 1;
  playerTaged = r;
  platformColor = [1, 255, 255];
  
  platform = detectPlatforms(platformColor, platformImg);
}

function draw() {
  timer();
  background(220);
  image(map, 0,0);
  for(let p in players){
    players[p].action();
  }

  if(time) tag();
  if(!(time%60)){
    t = time/60
    if(t<0) t = 0;
  }
  textSize(50); fill(0);
  text(t, width/2, 100);
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


class Player{
  constructor(x,y,mood, playerNumber, color, isTaged){
    this.pos = createVector(x,y); //player position on screen
    this.vel = createVector(0,0); // current speed and direction
    this.grav = createVector(0,0.30); // downwords force
    this.mood = mood;
    this.playerNumber = playerNumber;
    this.playerSize = 100; 
    this.jumpHeight = 10; // This value is the first value that worked
    this.isJumping = 1; // 0 = last frame jump presed, 1 = last frame jump was not preesed
    this.numJumps = 2; // number of jumps the charcter is alowed to perform
    this.color = color;
    this.isTaged = isTaged; // 0 → not taged, 1 → taged 
    this.baseSpeed = 8;
    this.boost = 1;
    this.gameOver = 1; // 1 → means game is not over, 0 → game is over 
    this.playerAction = 0; // 0 → Idle; 1 → Jumping; 2 → Runing
    this.playerActionSide = 0; // 0 → left; 1 → right; The player is runing left or right
    this.frame = 0; // the frame of the action the player is on so if the player is on runing and it is still on run action then change the frame by one to cycale the animation
  }

  movement(){
    // This function will handle all movement

    if(this.gameOver){
      // cant move if game is over
      this.vel.add(this.grav);
      this.pos.add(this.vel);

      if(keyIsDown(LEFT_ARROW)){
        
      }

  
      if(this.playerNumber === 0){
        if(keyIsDown(LEFT_ARROW)){
          if(this.isTaged){
            this.vel.x = -(this.baseSpeed + this.boost);
          } 
          else{
            this.vel.x = -this.baseSpeed;
          }

          if(this.pos.x < 0 - this.playerSize/3) {
            // Stops player from going off screen uses the player size to alow for the player
            // to hit the edge
            this.pos.x = 0 - this.playerSize/3;
            this.vel.x = 0;
          }

          // // player animation for left run
          // if(this.playerAction === 2 && this.playerActionSide === 0){
          //   // player is moving left and runing
          //   if(this.frame = 16){
          //     this.frame = 0; // rest frame to loop thrue the imgs
          //   }
          //   else this.frame++; // othervise go to the next frame
          // }
          // else {
          //   this.frame = 0; // start at the first frame
          //   this.playerAction = 2; // set player to runing
          //   this.playerActionSide = 0; // the player is moving left
          // }
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
    
    //image(playersImgs[this.playerNumber], this.pos.x, this.pos.y);
    //playersImgs[this.playerNumber].resize(this.playerSize, this.playerSize);
    if(this.isTaged){
      //if taged show the triangle above
      fill(0);
      rect(this.pos.x + (this.playerSize/2 - 10), this.pos.y - 10, this.playerSize/8);
    }


    // 
  }

  platformCollision() {
    for (let i = 0; i < platform.length; i++) {
      //Platform
      let pX = platform[i][0];
      let pY = platform[i][1];
      let pW = platform[i][2];
      let pH = platform[i][3];

      //Players edge
      let playerLeft   = this.pos.x;
      let playerRight  = this.pos.x + this.playerSize;
      let playerTop    = this.pos.y;
      let playerBottom = this.pos.y + this.playerSize;

      // Check if player is horizontally within the platform
      let overlapX = playerRight > pX && playerLeft < pX + pW;

      // Landing on top of platform
      if (overlapX && this.vel.y > 0) {
        if (playerBottom >= pY && playerBottom <= pY + pH) {
          this.pos.y = pY - this.playerSize; // sit on top
          this.vel.y = 0;
          this.numJumps = 2; // reset jumps
        }
      }

      // Hitting the BOTTOM of platform (player is jumping up)
      if (overlapX && this.vel.y < 0) {
        if (playerTop <= (pY + pH) && playerTop >= pY) {
          this.pos.y = pY + pH; // bump head down
          this.vel.y = 0;
        }
      }


      // Check if player is Virticaly within the platform
      
      let overlapY = playerBottom > pY + 5 && playerTop < pY + pH; //+5 temp fix for old sprites, the player has to be 5 px in the top in order for the 
      // colition to count 

      // Hitting LEFT side of platform -> player verticly aligned and also movig right
      if (overlapY && this.vel.x > 0) {
        if (playerRight >= pX && playerRight <= pX + pW) {
          this.pos.x = pX - this.playerSize; // set to left edge
          this.vel.x = 0;
        }
      }

      // Hitting RIGHT side of platform -> player verticly aligned and also movig left
      if (overlapY && this.vel.x < 0) {
        if (playerLeft <= pX + pW && playerLeft >= pX) {
          this.pos.x = pX + pW; // set to right edge
          this.vel.x = 0;
        }
      }

      
    }
  }

  action(){
    this.show();
    this.movement();
    this.platformCollision();
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