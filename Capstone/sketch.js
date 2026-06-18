// Tag Game
// Muhammad & Ayeman
// May 4/26

// Muhammad Ismail Global Variable
let players = [];
let map;
let tagTime = 60; //Time befor a tag acurs in frames
let time = 60 * 10; // The amount of time in frames that the game is played
let numPlayers = 3; // starts from 0
let playerTaged;
let platformImg = [];
let platformColor;
let platform = [];
let t; //time in seconds
let playerMovementKeys = []; // player 1, 2, 3, 4
let musicOn = false; // false = off, true = on; I did not use 0 and 1 becous its getting anoying to look back at old code

// Ayeman Islam Global Variable
let gameState = 0;// 0 = start, 1 = game is started, 2 = pause menu, 3 = end/over

let play, settings, continueGame, end;

let playButton, settingsButton, backButton, continueButton, endButton;
let time60, time90, time120, time180; // Buttons for each time limit for tagging


// player imgs 2d arays for animation
let playerImgs = [[], [], [], []]; // player 1, 2,3,4 ; In each of those idel, jump, run
let numJumpImgs = 16;
let numIdelImgs = 4;
let numRunImgs = 16;
let numMap = 1;
let frameCount = 0;



function preload() {
  // called BEFORE SETUP. Won't conclude.
  // Until all loads are complete.

  map = loadImage("assets/Map-" + numMap + "/map.jpg");
  platformImg = loadImage("assets/Map-" + numMap + "/platforms.jpg");

  // loading music on and music off icons - Ayeman
  musicOnImg = loadImage("assets/music-icons/MusicOn.png");
  musicOffImg = loadImage("assets/music-icons/MusicOff.png");

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
}

function setup() {
  createCanvas(1912, 1076);
  pixelDensity(1); frameRate(60);
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
  buttonSetup();

}

function draw() {
  // Drawing the screen based on the gameState
  if (gameState === 0) {
    startMenu();
  }
  else if (gameState === 1) {
    timer();
    gameStarted();
    if (time > 0) tag();
    // displaying the timer
    if (!(time % 60)) {
      t = time / 60
      if (t < 0) t = 0;
    }
    fill(0);
    text(t, width / 2, 100);
  }
  else if (gameState === 2) pauseGame();
  else if (gameState === 3) endScreen();

  // Ensures if the music icons shows up if on or off
  musicHideShow();
  // Checks buttons every frame 
  hideOrShowButtons();
}
function keyPressed(){
  // Pause game logic (80 is the keycode for 'P' refering to pause) 
  if (keyIsDown(80)) {
    if (gameState === 1) {
      gameState = 2; //sets to pause menu
      pauseGame();
    }
    else {
      gameState = 1; //continues game
    }
  }
  if (keyIsDown(77)){ // if press M then pause and play music
    if(musicOn) musicOn = false;
    else musicOn = true;
    triggerMusicButton();
  }
}


function timer() {
  // This function is responsable for all time related code
  frameCount++; // incrasing frame count for drawings
  tagTime--; //for taging 
  time--; // game time
  if (tagTime < 0) tagTime = 0; // reset tag time to reuse

  if (time <= 0) {
    // if the game time is over then the game is over
    gameState = 3; //sets the game set to End screen
    endScreen();
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
    for (let p = 0; p < players.length; p++) {
      if (!(int(p) === playerTaged)) {
        // compare distance of taged player to everyother player
        let d = dist(players[playerTaged].pos.x, players[playerTaged].pos.y, players[p].pos.x, players[p].pos.y);
        if (d <= 40) {
          // IF the time has pased betwen tags and they tuch then it shoud be taged
          players[p].isTaged = 1;
          players[playerTaged].isTaged = 0;
          //print("TAG");
          tagTime = 60;
          playerTaged = int(p);
          break;
        }
      }
    }
  }
}