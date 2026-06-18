// Tag Game
// Muhammad & Ayeman
// May 4/26

// Muhammad Ismail Global Variable
let players = [];
let map;
let tagTime = 60; //Time befor a tag acurs in frames
let time = 60 * 10; // The amount of time in frames that the game is played
let numPlayers = 1; // starts from 0
let playerTaged;
let platformImg = [];
let platformColor;
let platform = [];
let t; //time in seconds

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



  // Ayeman's Button Setup
  playButton = createButton('Play');
  playButton.size(150, 50);
  playButton.style('font-size', '30px');
  playButton.mousePressed(clickPlay); // Link to our new function

  settingsButton = createButton('Settings');
  settingsButton.size(150, 50);
  settingsButton.style('font-size', '30px');
  settingsButton.mousePressed(openSettings);


  continueButton = createButton('Continue');
  continueButton.size(150, 50);
  continueButton.style('font-size', '30px');
  continueButton.mousePressed(clickContinue); // Link to our new function

  endButton = createButton('End');
  endButton.size(150, 50);
  endButton.style('font-size', '30px');
  endButton.mousePressed(clickEnd); // Link to our new function

  backButton = createButton('← BACK');
  backButton.size(150, 50);
  backButton.style('font-size', '30px');
  backButton.mousePressed(backToMenu);



  // Ayeman's Time Selection Buttons
  time60 = createButton('60s');
  time60.mousePressed(selectTime);
  time60.size(150, 50);
  time60.style('font-size', '30px');
  time60.timeValue = 60;

  time90 = createButton('90s');
  time90.mousePressed(selectTime);
  time90.size(150, 50);
  time90.style('font-size', '30px');
  time90.timeValue = 90;

  time120 = createButton('120s');
  time120.mousePressed(selectTime);
  time120.size(150, 50);
  time120.style('font-size', '30px');
  time120.timeValue = 120;

  time180 = createButton('180s');
  time180.mousePressed(selectTime);
  time180.size(150, 50);
  time180.style('font-size', '30px');
  time180.timeValue = 180;
}

function draw() {
  // Pause game logic (80 is the keycode for 'P' refering to pause)
  if (gameState === 1 && keyIsDown(80)) {
    gameState = 2;
  }

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


  // Checks buttons every frame 
  hideOrShowButtons();
}

function backToMenu(){
  gameState = 0;
}

function selectTime() { // Ayeman's code
  // 'this' refers to the button that was just clicked
  time = this.timeValue * 60;
  gameState = 0; // Go back to the main menu
}

function clickPlay() { // Ayeman's code
  gameState = 1; // Switch to game
}

function clickContinue() { // Ayeman's code
  gameState = 1; // Switch back to game from pause
}

function clickEnd() { // Ayeman's code
  gameState = 0; // Go back to start menu
  // Optional: Reset game variables here if you want the game to start fresh
  time = 100 * 60;
  tagTime = 60;
}

function hideTimeButtons() { // Ayeman's code
  // Hides all the time buttons
  time60.hide();
  time90.hide();
  time120.hide();
  time180.hide();
}

function hideOrShowButtons() { // Ayeman's code
  // 1. Start Menu
  if (gameState === 0) {
    playButton.show();
    playButton.position(width / 2 - 75, height / 2 + 50);
    settingsButton.show();
    settingsButton.position(width / 2 - 75, height / 2 + 120);

    continueButton.hide();
    endButton.hide();
    backButton.hide();
    hideTimeButtons(); // Helper to hide time buttons
  }
  // 2. Playing Game
  else if (gameState === 1) {
    playButton.hide();
    settingsButton.hide();
    continueButton.hide();
    endButton.hide();
    backButton.hide();
    hideTimeButtons();
  }
  // 3. Pause Menu
  else if (gameState === 2) {
    playButton.hide();
    settingsButton.hide();
    continueButton.show();
    continueButton.position(width / 2 - 75, height / 2);
    endButton.show();
    endButton.position(width / 2 - 75, height / 2 + 50);
    hideTimeButtons();
  }
  // 4. End Screen
  else if (gameState === 3) {
    playButton.hide();
    settingsButton.hide();
    continueButton.hide();
    endButton.show();
    endButton.position(width / 2 - 75, height / 2 + 250);
    hideTimeButtons();
  }
  // 5. Settings Menu
  else if (gameState === 4) {
    playButton.hide();
    settingsButton.hide();
    continueButton.hide();
    endButton.hide();

    // Show time buttons
    backButton.show(); backButton.position(width / 2 + 720, height / 2 + 450);
    time60.show();  time60.position(width / 2 - 500, height / 2 - 135);
    time90.show();  time90.position(width / 2 - 200, height / 2 - 130);
    time120.show(); time120.position(width / 2 + 110, height / 2 - 130);
    time180.show(); time180.position(width / 2 + 410, height / 2 - 130);
  }
}


function gameStarted() { // Ayeman's code
  // this function will run all things that the game tag needs so like player timer and what not
  textSize(50); fill(0);

  image(map, 0, 0);
  for (let p in players) {
    players[p].action();
  }
}

function startMenu() { // Ayeman's code
  // For the start menu
  // a page to the controls a option to chous witch charcter player 1 ,2 .. whant to be and how many players, buffs
  // no buffs. Timer options to chous what time you whoud like 60 s or 120.

  fill(200, 150, 150, 75);
  rect(0, 0, width, height); // creating background

  textAlign(CENTER, CENTER);
  fill(255);
  textFont('Helevetica');
  textSize(180);
  textStyle(ITALIC, BOLD);
  text("RUN 🏃‍♂️ IT", width / 2, height / 2 - 150);

}

function openSettings() {
  // for the settings menu
  // Allows the user to change the time limit 
  // And check on the controls for each player

  fill(50, 150, 185);
  rect(0, 0, width, height); // creating background

  fill(255);
  textStyle(ITALIC);
  textFont('Arial'); textAlign(CENTER, CENTER); textSize(45);
  text("SELECT TIME LIMIT", width / 2, height / 2 - 200);

  textAlign(CENTER, CENTER);
  fill(255);
  textFont('Helevetica'); textSize(180); textStyle(BOLD, ITALIC);
  text("SETTINGS MENU", width / 2, height / 2 - 350); // title screen
  gameState = 4; // switches to settings

  // Player Preview 
  for (let n = 0; n < 4; n++) {
  if (playerImgs[n] && playerImgs[n][0] && playerImgs[n][0][0]) {
    let idleImg = playerImgs[n][0][0];
    
    // 1. Grid Math
    let col = n % 2;        // 0, 1, 0, 1 (Switches between left and right)
    let row = floor(n / 2); // 0, 0, 1, 1 (Stays top row then moves to bottom)
    
    // 2. Calculate positions
    // Adjust these values to shift the whole grid around
    let startX = width / 2 + 250; 
    let startY = height / 2 + 45;
    
    let xPos = startX + (col * 300); // 300px spacing between columns
    let yPos = startY + (row * 300); // 300px spacing between rows
    
    // 3. Draw image and label
    image(idleImg, xPos, yPos, 100, 150);
    textSize(35);
    textAlign(CENTER, CENTER);
    text("PLAYER " + (n + 1), xPos + 50, yPos + 180);
  }
}

  //Controls Display
  fill(205,255,255);
  textAlign(CENTER, CENTER); textSize(35); textFont('Arial');
  text("PLAYER 1: ⬅️/➡️ to Move Left & Right, ⬆️ to Jump", width / 2 - 470, height / 2 + 100);
  text("PLAYER 2: A/D to Move Left & Right, W to Jump", width / 2 - 500, height / 2 + 200);
  text("PLAYER 3: J/L to Move Left & Right, I to Jump", width / 2 - 515, height / 2 + 300);
  text("PLAYER 4: F/H to Move Left & Right, T to Jump", width / 2 - 505, height / 2 + 400);

}

function pauseGame() {
  // For the pause menu
  // alowes user to hit a button like p to open the pause menue, 
  // stops all movemnt and then you can change either resume end or restart, see the player movement keys

  fill(200, 0, 150, 10);
  rect(0, 0, width, height); // creating background

  textAlign(CENTER, CENTER);
  fill(255);
  textSize(80);
  text("PAUSED", width / 2, height / 2 - 150); // title screen

}

function endScreen() {
  // The end screen for who won
  // overlays who lost on a side and who one on a podioum
  
  fill(50, 100, 150, 65);
  rect(0, 0, width, height); // creating background
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(150);
  text("GAME OVER", width / 2, height / 2 - 250); // title screen

  for (let i = 0; i < players.length; i++) {
    if (players[i].isTaged === 1) {
      
      // Display the loser in the center
      let loserImg = playerImgs[i][0][0];
      image(loserImg, width / 2 - 75, height / 2 - 90, 150, 225);
      

      // Display the loser's name
      textSize(35);
      fill(255, 50, 50);
      textFont('Arial')
      text("PLAYER " + (i + 1) + " LOST!", width / 2, height / 2 + 150);
      
      // Stop the game loop for everyone
      players[i].gameOver = 0;
    }
  }


  for (let p in players) {
    players[p].gameEnd();
  }
  gameState = 3; // game is over
  endButton.position(400, 400);


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