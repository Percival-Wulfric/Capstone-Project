// Platforms
// Muhammad Ismail
// 17-05-2026

// Globbles
let platformsLocation = [];
let platform = []
let platformColor;

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
  //image(platform,0,0);
}

function detectPlatforms() {
  // This function shoud "dinamicly" detect the platforms
  // Saving there information in platformsLocation

  image(platform, 0, 0);
  loadPixels();

  let red   = platformColor[0];
  let green = platformColor[1];
  let blue  = platformColor[2];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {

      let pixelStart = (y * width + x) * 4;

      let pixelRed   = pixels[pixelStart + 0];
      let pixelGreen = pixels[pixelStart + 1];
      let pixelBlue  = pixels[pixelStart + 2];

      if (pixelRed === red && pixelGreen === green && pixelBlue === blue) {
        platformsLocation.push([x, y]);
      }

    }
  }

}