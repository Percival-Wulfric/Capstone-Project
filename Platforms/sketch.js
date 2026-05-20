// Platforms
// Muhammad Ismail
// 17-05-2026

// Globbles
let platformsLocation = []; 
let platform = []; // Image
let platformColor;
let platforms = []; // Final output -> [[x, y, width, height], [x, y, width, height], .....]
let pixelStart = 0;
let grid;

function preload(){
  // called BEFORE SETUP. Won't conclude.
  // Until all loads are complete.
  platform = loadImage("assets/platform-00.png");
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  platformColor = [1, 255, 255];
  detectPlatforms();
}

function draw() {
  background(220);
  image(platform,0,0);
  text(mouseX + ", " + mouseY, mouseX, mouseY);
}

function detectPlatforms() {
  // This function shoud "dinamicly" detect the platforms
  // Saving there information in platformsLocation

  image(platform, 0, 0);
  loadPixels();

  let red   = platformColor[0];
  let green = platformColor[1];
  let blue  = platformColor[2];

  // Geting all the x,y for the colored pixels
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      //Visite every pixel

      pixelStart = (y * width + x) * 4;
      

      let pixelRed   = pixels[pixelStart + 0];
      let pixelGreen = pixels[pixelStart + 1];
      let pixelBlue  = pixels[pixelStart + 2];

      if (pixelRed === red && pixelGreen === green && pixelBlue === blue) {
        platformsLocation.push([x, y]);
      }

    }
  }

  // Build a grid so we can check is there a pixel at x,y 
  grid = []; // Undifined -> false / not there
  for (let i = 0; i < platformsLocation.length; i++) {
    let x = platformsLocation[i][0];
    let y = platformsLocation[i][1];
    
    if (!grid[y]) grid[y] = [];
    // If this row -> y does not exist yat, create it

    grid[y][x] = true; // Platform is there
  }

  // Find rectangels
  
  for (let i = 0; i < platformsLocation.length; i++) {
    let x = platformsLocation[i][0];
    let y = platformsLocation[i][1];

    // a top laft cornar has no pixel to its left and non above
    let noLeft, noAbove;

    if(!grid[y][x - 1]) noLeft = true;
    else noLeft = false;
    
    if(!(grid[y - 1] && grid[y - 1][x])) noAbove = true;
    else noAbove = false;

    if (noLeft && noAbove) {
      // Calculating width and height from top corner

      let w = 0;
      while (grid[y][x + w]) {
        // while theres a pixel to the right count the steps
        w++;
      }

      let h = 0;
      while (grid[y + h] && grid[y + h][x]){
        // keep stepping DOWN!
        // while there is a pixel down count steps
        h++;
      }

      platforms.push([x, y, w, h]); //UPDATE PLATFORMS
    }
  }

  print(platforms);
}


























