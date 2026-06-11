// Tag Game
// Muhammad & Ayeman
// May 4/26

// Muhammad Ismail Global Variable
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

// Ayeman Islam Global Variable
let menu = [];
let pauseMenu = [];
let endGameMenu = [];
let gameState = [1,2,3];

let play, settings, continueGame, end;

let playButton;
let settingsButton;





// player imgs 2d arays for animation
let playerImgs = [[], [], [], []]; // player 1, 2,3,4 ; In each of those idel, jump, run
let numJumpImgs = 16;
let numIdelImgs = 4;
let numRunImgs = 16;
let numMap = 1;
let frameCount = 0;

let playerMovementKeys = []; // player 1, 2, 3, 4
function preload() {
  // called BEFORE SETUP. Won't conclude.
  // Until all loads are complete.

  map = loadImage("assets/Map-" + numMap + "/map.jpg");
  platformImg = loadImage("assets/Map-" + numMap + "/platforms.jpg");

  // player imgs
  for (let n = 0; n <= numPlayers; n++) { //loop thrue players
    playerImgs.push([]); // player array
    playerImgs[n].push([], [], []); // individula aryas for animation sets
    for (let r = 1; r <= numJumpImgs; r++) {
      playerImgs[n][1].push(loadImage("assets/Map-" + numMap + "/Player (" + n + ")/jump/jump (" + r + ").png"));
    }
    for (let l = 1; l <= numRunImgs; l++) {
      playerImgs[n][2].push(loadImage("assets/Map-" + numMap + "/Player (" + n + ")/run/run (" + l + ").png"));
    }
    for (let i = 1; i <= numIdelImgs; i++) {
      playerImgs[n][0].push(loadImage("assets/Map-" + numMap + "/Player (" + n + ")/idle/idle (" + i + ").png"));
    }
  }

  // Ayeman's Gamestate setup
  play = loadImage("assets/menu1/Play Button.png");
  settings = loadImage("assets/menu1/Settings Button.png");
  continueGame =  loadImage("assets/menu1/Continue Button.png");
  end = loadImage("assets/menu1/Quit Button.png");  

  menu.push(play, settings);
  pauseMenu.push(continueGame, settings, end);
  endGameMenu.push(end);
}

function setup() {
  createCanvas(1912, 1076);
  pixelDensity(1);
  noStroke();
  for (let i = 0; i <= numPlayers; i++) {
    players.push(new Player(width / 2, height / 2, i, [255, 0, 0], 0));
  }
  let r = int(random(0, numPlayers));
  players[r].isTaged = 1;
  playerTaged = r;
  platformColor = [1, 255, 255];

  platform = detectPlatforms(platformColor, platformImg);
  playerMovementKeys.push([LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW], [65, 68, 87, 83], [74, 76, 73, 75], [70, 72, 84, 71]);
  frameRate(60);
 


}

function draw() {
  timer();
  background(220);
  image(map, 0, 0);
  for (let p in players) {
    players[p].action();
  }

  if (time) tag();
  if (!(time % 60)) {
    t = time / 60
    if (t < 0) t = 0;
  }
  textSize(50); fill(0);
  text(t, width / 2, 100);
}

function startMenu() {
  // For the start menu
  // a page to the controls a option to chous witch charcter player 1 ,2 .. whant to be and how many players, buffs
  // no buffs. Timer options to chous what time you whoud like 60 s or 120.
  background(250);
  
  playButton = createButton('Play');
  playButton.position(400, 400);

  settingsButton = createButton('settings');
  settingsButton.position(400, 450);

  image(menu[0], 400, 400);
  image(menu[1], 400, 450);

}

function pauseGame() {
  // For the pause menu
  // alowes user to hit a button like p to open the pause menue, 
  // stops all movemnt and then you can change either resume end or restart, see the player movement keys

  background(250);
  continueButton = createButton('Continue');
  continueButton.position(400, 400);

  settingsButton.position(400, 450);

  image(pauseMenu[0], 400, 400);
  image(pauseMenu[1], 400, 450);
}

function endScreen() {
  // The end screen for who won
  // overlays who lost on a side and who one on a podioum
  for (let p in players) {
    players[p].gameEnd();
  }
}

function timer() {
  // This function is responsable for all time related code
  frameCount ++; // incrasing frame count for drawings
  tagTime--; //for taging 
  time--; // game time
  if (tagTime < 0) tagTime = 0; // reset tag time to reuse

  if (time <= 0) {
    // if the game time is over then the game is over
    endScreen();
  }

  else {
    if (!(time % 60)) {
      // prints the time every 1 sec so 60 frames
      print(time / 60);
    }

  }

}

function powerUps() {
  // This function handles overups

  
}

function tag() {
  // The player tag logic

  // UPDATED CODE → Works with multaple players

  if (!tagTime) {
    // time btween tags has passed
    for (let p in players) {
      if (!(p === playerTaged)) {
        // compare distance of taged player to everyother player
        let d = dist(players[playerTaged].pos.x, players[playerTaged].pos.y, players[p].pos.x, players[p].pos.y);
        if (d <= 40) {
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


class Player {
  constructor(x, y, playerNumber, color, isTaged) {
    this.pos = createVector(x, y); //player position on screen
    this.vel = createVector(0, 0); // current speed and direction
    this.grav = createVector(0, 0.30); // downwords force
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
    this.frameRate = 30; // frame rate for the animation
  }

  movement() {
    // This function will handle all movement
    if (this.gameOver) {
      this.vel.add(this.grav);
      this.pos.add(this.vel);
      if (keyIsDown(playerMovementKeys[this.playerNumber][0])) {
        if (this.isTaged) {
          this.vel.x = -(this.baseSpeed + this.boost);
        }
        else {
          this.vel.x = -this.baseSpeed;
        }

        if (this.pos.x < 0 - this.playerSize / 3) {
          // Stops player from going off screen uses the player size to alow for the player
          // to hit the edge
          this.pos.x = 0 - this.playerSize / 3;
          this.vel.x = 0;
        }

        // player animation for left run
        if (this.playerAction === 2 && this.playerActionSide === 0 && frameCount%this.frameRate === 0) {
          // player is moving left and runing
          if (this.frame === 15) {
            this.frame = 0; // rest frame to loop thrue the imgs
          }
          else {
            this.frame++; // othervise go to the next frame
          }
        }
        else {
          this.frame = 0; // start at the first frame
          this.playerAction = 2; // set player to runing
          this.playerActionSide = 0; // the player is moving left
        }
      }

      if (keyIsDown(playerMovementKeys[this.playerNumber][1])) {
        if (this.isTaged) {
          this.vel.x = this.baseSpeed + this.boost;
        }
        else {
          this.vel.x = this.baseSpeed;
        }
        if (this.pos.x > width - (this.playerSize / 3) * 2) {
          // Stops player from going off screen uses the player size to alow for the player
          // to hit the edge
          this.pos.x = width -this.playerSize / 3 * 2;
          this.vel.x = 0;
        }

        if (this.playerAction === 2 && this.playerActionSide === 1 && frameCount%this.frameRate === 0) {
          // player is moving right and runing
          if (this.frame === 15) {
            this.frame = 0; // rest frame to loop thrue the imgs
          }
          else {
            this.frame++; // othervise go to the next frame
          }
        }
        else {
          this.frame = 0; // start at the first frame
          this.playerAction = 2; // set player to runing
          this.playerActionSide = 1; // the player is moving left
        }
      }

      if (keyIsDown(playerMovementKeys[this.playerNumber][3])) {
        // If the player has a anilitey to go down they can

      }

      if (keyIsDown(playerMovementKeys[this.playerNumber][2])) {
        if (this.numJumps > 0 && !this.isJumping) {
          this.vel.y = -this.jumpHeight;
          this.numJumps -= 1;

          if (this.playerAction === 1 && frameCount%this.frameRate === 0) {
            // player is jumping
            if (this.frame === 15) {
              this.frame = 0; // rest frame to loop thrue the imgs
            }
            else {
              this.frame++; // othervise go to the next frame
            }
          }
          else {
            this.frame = 0; // start at the first frame
            this.playerAction = 1; // set player to jump
          }
        }
      }

      if (!(keyIsDown(playerMovementKeys[this.playerNumber][0]) || keyIsDown(playerMovementKeys[this.playerNumber][1]) || keyIsDown(playerMovementKeys[this.playerNumber][2]) || keyIsDown(playerMovementKeys[this.playerNumber][3]))) {
        // Stop movemnet if the player is not hiting any keys
        this.vel.x = 0;

        if (this.playerAction === 0 && frameCount%this.frameRate === 0) {
          // player is idle
          if (this.frame === 3) {
            this.frame = 0; // rest frame to loop thrue the imgs
          }
          else {
            this.frame++; // othervise go to the next frame
          }
        }
        else {
          this.frame = 0; // start at the first frame
          this.playerAction = 0; // set player to jump
        }
        //if(this.playerNumber === 0) print("try this:",this.playerAction,this.frame);
      }
      this.isJumping = keyIsDown(UP_ARROW);
      
    }

  }

  show() {
    // this function will display the character
    //if(this.playerNumber === 0) print("try this:",this.playerAction,this.frame);
    let img = playerImgs[this.playerNumber][this.playerAction][this.frame];
    img.resize(75, this.playerSize);
    image(img, this.pos.x, this.pos.y); // go to the player imgs then in that go to the charcter 
    // and in that go to the img set of the current action then do the img on which fram of animation we shoud be one 

    if (this.isTaged) {
      //if taged show the triangle above
      fill(0);
      rect(this.pos.x + (this.playerSize / 2 - 10), this.pos.y - 10, this.playerSize / 8);
    }

  }

  platformCollision() {
    for (let i = 0; i < platform.length; i++) {
      //Platform
      let pX = platform[i][0];
      let pY = platform[i][1];
      let pW = platform[i][2];
      let pH = platform[i][3];

      //Players edge
      let playerLeft = this.pos.x;
      let playerRight = this.pos.x + this.playerSize;
      let playerTop = this.pos.y;
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

  action() {
    this.show();
    this.movement();
    this.platformCollision();
  }

  gameEnd() {
    //Game ended state
    if (this.gameOver) {
      if (this.isTaged) {
        print("NO I LOST")
      }
      else {
        print("HAHAH I WON, GG")
      }
      this.gameOver = 0;
    }
  }
} 