const { noise, map, createVector } = p5.prototype;

/*
 * Random & Perlin Walk
 */
let posX, posY;
let xOff = 0,
  yOff = 1000;

function randomWalk() {
  let r = Math.floor(Math.random() * 4);

  switch (r) {
    case 0:
      posX = posX + 0.1;
      break;
    case 1:
      posX = posX - 0.1;
      break;
    case 2:
      posY = posY + 0.1;
      break;
    case 3:
      posY = posY - 0.1;
      break;
  }

  cube.position.x = posX;
  cube.position.y = posY;
}

function perlinWalk() {
  posX = noise(xOff);
  posY = noise(yOff);
  posX = map(posX, 0, 1, -app.clientWidth * 0.01, app.clientWidth * 0.01);
  posY = map(posY, 0, 1, -app.clientHeight * 0.01, app.clientHeight * 0.01);
  cube.position.x = posX;
  cube.position.y = posY;
  cube.rotation.x = posY;
  cube.rotation.y = posX;
  xOff += 0.005;
  yOff += 0.005;
}
