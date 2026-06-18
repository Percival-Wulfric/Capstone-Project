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
    this.jumpAnimDone = true; //true = done, false = not done to make shour that idle does not stop jump animation from advancing
    this.color = color;
    this.isTaged = isTaged; // 0 → not taged, 1 → taged 
    this.baseSpeed = 8;
    this.boost = 1;
    this.gameOver = 1; // 1 → means game is not over, 0 → game is over 
    this.playerAction = 0; // 0 → Idle; 1 → Jumping; 2 → Runing
    this.playerActionSide = 0; // 0 → left; 1 → right; The player is runing left or right
    this.frame = 0; // the frame of the action the player is on so if the player is on runing and it is still on run action then change the frame by one to cycale the animation
    this.frameRate = 5; // frame rate for the animation
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
        if(this.playerAction !== 2 || this.playerActionSide !== 0){
          // if we change the animation set
          this.frame = 0; // start at the first frame
          this.playerAction = 2; // set player to runing
          this.playerActionSide = 0; // the player is moving left
        }

        if(frameCount % this.frameRate === 0){
          // since the above loop alrady determens the correct set to be in this loop just needs
          // to increase the frame

          let maxFrame = playerImgs[this.playerNumber][this.playerAction].length -1;
          if (this.frame >= maxFrame) {
            this.frame = 0; // rest frame to loop thrue the imgs
          }
          else {
            this.frame++; // othervise go to the next frame
          }
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
          this.pos.x = width - this.playerSize / 3 * 2;
          this.vel.x = 0;
        }


        // Player animation 
        if(this.playerAction !== 2 || this.playerActionSide !== 1){
          // if we change the animation set
          this.frame = 0; // start at the first frame
          this.playerAction = 2; // set player to runing
          this.playerActionSide = 1; // the player is moving left
        }

        if(frameCount % this.frameRate === 0){
          // since the above loop alrady determens the correct set to be in this loop just needs
          // to increase the frame
          let maxFrame = playerImgs[this.playerNumber][this.playerAction].length -1;
          if (this.frame >= maxFrame) {
            this.frame = 0; // rest frame to loop thrue the imgs
          }
          else {
            this.frame++; // othervise go to the next frame
          }
        }
      }

      if (keyIsDown(playerMovementKeys[this.playerNumber][3])) {
        // If the player has a anilitey to go down they can

      }

      if (keyIsDown(playerMovementKeys[this.playerNumber][2])) {
        if (this.numJumps > 0 && !this.isJumping) {
          this.vel.y = -this.jumpHeight;
          this.numJumps -= 1;
          this.frame = 0;
          this.playerAction = 1;
          this.jumpAnimDone = false; // jump anim is now playing
        }
      }

      if (!(keyIsDown(playerMovementKeys[this.playerNumber][0]) || keyIsDown(playerMovementKeys[this.playerNumber][1]) || keyIsDown(playerMovementKeys[this.playerNumber][2]) || keyIsDown(playerMovementKeys[this.playerNumber][3]))) {
        // Stop movemnet if the player is not hiting any keys
        this.vel.x = 0;

        // Player Animations
        if(this.jumpAnimDone){
          if(this.playerAction !== 0){
            // if we change the animation set
            this.frame = 0; // start at the first frame
            this.playerAction = 0; // set player to jump
          }
          let maxFrame = playerImgs[this.playerNumber][this.playerAction].length -1;
          if (frameCount% 15 === 0) {
            // since the above loop alrady determens the correct set to be in this loop just needs
            // to increase the frame
            if (this.frame >= maxFrame) {
              this.frame = 0; // rest frame to loop thrue the imgs
            }
            else {
              this.frame++; // othervise go to the next frame
            }
          }
        }
        
      }

      // jump animation
      if (!this.jumpAnimDone) {
        if (frameCount % this.frameRate === 0) {
          let maxFrame = playerImgs[this.playerNumber][1].length - 1;
          if (this.frame >= maxFrame) {
            this.jumpAnimDone = true; // finished all jump frames
          } else {
            this.frame++;
          }
        }
      }
      this.isJumping = keyIsDown(playerMovementKeys[this.playerNumber][2]);

    }

  }

  show() {
    // this function will display the character
    let img = playerImgs[this.playerNumber][this.playerAction][this.frame];
    //print(this.frame + ", " + this.playerAction);
    if(img === undefined){
      return; // will stop crases that are caused becous of img being wrong
    }
    img.resize(75, this.playerSize);

    push();
    if (this.playerActionSide === 0) {
      // facing left, flip horizontally 
      translate(this.pos.x + 75, this.pos.y); // 75 = resized img with
      scale(-1, 1);
      image(img, 0, 0);
    } 
    else {
      image(img, this.pos.x, this.pos.y);
    }
    pop();
    

    // go to the player imgs then in that go to the charcter 
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
    this.movement();// update state befor changing frames
    this.show();
    
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