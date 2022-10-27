const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 600;
const gravity = 0.4;
let gameFrames = 0;

//CLASSES

/////// SPRITE

class Sprite {
  constructor({ position, image }) {
    this.position = position;
    this.height = 1000;
    this.width = 600;
    this.image = new Image();
    this.image.src = image;
  }
  draw() {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.height,
      this.width
    );
  }

  update() {
    this.draw();
  }
}

/////// BACKGROUND

const background = new Sprite({
  position: { x: 0, y: 0 },
  image: "./assets/scene-pirateship.png",
});

/////// PLAYERS

class Players {
  constructor({
    position,
    speedy,
    offset,
    image,
    offsetX,
    offsetY,
    imageHeight,
    maxFrames,
    originX = 0,
  }) {
    this.position = position;
    this.speedy = speedy;
    this.height = 250;
    this.width = 100;
    this.image = new Image();
    this.image.src = image;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.originX = originX;
    this.health = 100;
    this.imageHeigth = imageHeight;
    this.maxFrames = maxFrames;
    this.frames = 0;

    // CREATE ATTACK

    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: this.width,
      height: this.height,
      offset: offset,
    };

    this.attackActivate = false;
    this.change = false;
  }
  draw() {
    // DRAW PLAYERS
    // (image, sx, sy, sLargeur, sHauteur, dx, dy, dLargeur, dHauteur);

    ctx.drawImage(
      this.image,
      this.originX + this.offsetX * this.frames,
      this.offsetY,
      this.offsetX,
      this.imageHeigth,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.frames %= this.maxFrames;
    this.draw();

    // POSITION ATTACKBOX

    this.attackBox.position.x = this.position.x - this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

    // MOUVEMENT & VITESSE PLAYERS

    this.position.x += this.speedy.x;
    this.position.y += this.speedy.y;

    if (this.position.y + this.height + this.speedy.y >= canvas.height) {
      this.speedy.y = 0;
    } else {
      this.speedy.y += gravity;
    }
  }

  attack() {
    this.attackActivate = true;
  }
}

/////// PLAYERONE

const playerOne = new Players({
  position: { x: 200, y: 0 },
  speedy: { x: 0, y: 0 },
  offset: { x: 0, y: 0 },
  offsetX: 43,
  offsetY: 0,
  imageHeight: 80,
  maxFrames: 3,
  image: "./assets/TestLuffy.png",
});

/////// PLAYERTWO

const playerTwo = new Players({
  position: { x: 800, y: 0 },
  speedy: { x: 0, y: 0 },
  offset: { x: 50, y: 0 },
  offsetX: 49,
  offsetY: 100,
  imageHeight: 78,
  maxFrames: 4,
  image: "./assets/TestZoro.png",
});

//////////////// TIMER //////////////

let time = 60;

function timer() {
  setTimeout(timer, 1000);
  if (time > 0) {
    time--;
    document.querySelector("#timer").innerHTML = time;

    // GAME OVER AND WIN IF TIME IS 0
  }
  if (time === 0) {
    if (playerOne.health === playerTwo.health) {
      document.querySelector("#modal3").style.display = "flex";
    }
    if (playerOne.health >= playerTwo.health) {
      document.querySelector("#modal").style.display = "flex";
    }
    if (playerTwo.health >= playerOne.health) {
      document.querySelector("#modal2").style.display = "flex";
    }
  }
}
timer();

//////////////// ANIMATE //////////////

function animate() {
  gameFrames = requestAnimationFrame(animate);
  if (gameFrames % 10 === 0) {
    playerOne.frames++;
    playerTwo.frames++;
  }

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  playerOne.update();
  playerTwo.update();

  // ATTACK PLAYERONE AGAIN PLAYERTWO

  if (
    playerOne.attackBox.position.x + playerOne.attackBox.width >=
      playerTwo.position.x &&
    playerOne.attackBox.position.x <= playerTwo.position.x + playerTwo.width &&
    playerOne.attackBox.position.y + playerOne.attackBox.height >=
      playerTwo.position.y &&
    playerOne.attackBox.position.y <= playerTwo.position.y + playerTwo.height &&
    playerOne.attackActivate
  ) {
    playerTwo.health -= 2;
    document.querySelector("#playerTwoHealth").style.width =
      playerTwo.health + "% ";
  }

  // ATTACK PLAYERTWO AGAIN PLAYERONE

  if (
    playerTwo.attackBox.position.x + playerTwo.attackBox.width >=
      playerOne.position.x &&
    playerTwo.attackBox.position.x <= playerOne.position.x + playerOne.width &&
    playerTwo.attackBox.position.y + playerTwo.attackBox.height >=
      playerOne.position.y &&
    playerTwo.attackBox.position.y <= playerOne.position.y + playerOne.height &&
    playerTwo.attackActivate
  ) {
    playerOne.health -= 2;
    document.querySelector("#playerOneHealth").style.width =
      playerOne.health + "% ";
  }

  // GAME OVER

  if (playerTwo.health === 0) {
    document.querySelector("#modal").style.display = "flex";
    time = 0;
  }
  if (playerOne.health === 0) {
    document.querySelector("#modal2").style.display = "flex";
    time = 0;
  }
}

animate();

/////// KEY

window.addEventListener("keydown", (event) => {
  console.log(event.key);
  switch (event.key) {
    // LUFFY

    case "d":
      playerOne.speedy.x = 4;
      playerOne.offsetX = 52;
      playerOne.offsetY = 0;
      playerOne.imageHeight = 80;
      playerOne.maxFrames = 8;
      playerOne.originX = 390;
      break;
    case "q":
      playerOne.speedy.x = -5;
      playerOne.offsetX = 53;
      playerOne.offsetY = 0;
      playerOne.imageHeight = 80;
      playerOne.maxFrames = 8;
      playerOne.originX = 385;
      break;
    case "e":
      playerOne.speedy.y = -10;
      playerOne.offsetX = 40;
      playerOne.offsetY = 1708;
      playerOne.imageHeight = 80;
      playerOne.maxFrames = 7;
      playerTwo.originX = 0;
      break;

    // ZORO

    case "ArrowLeft":
      playerTwo.speedy.x = -5;
      playerTwo.offsetX = 61;
      playerTwo.offsetY = 100;
      playerTwo.imageHeight = 78;
      playerTwo.maxFrames = 8;
      playerTwo.originX = 240;
      break;
    case "ArrowUp":
      playerTwo.speedy.y = -10;
      playerTwo.offsetX = 52;
      playerTwo.offsetY = 2910;
      playerTwo.imageHeight = 78;
      playerTwo.maxFrames = 7;
      playerTwo.originX = 405;
      break;
    case "ArrowRight":
      playerTwo.speedy.x = 5;
      playerTwo.offsetX = 61;
      playerTwo.offsetY = 100;
      playerTwo.imageHeight = 78;
      playerTwo.maxFrames = 8;
      playerTwo.originX = 240;
      break;

    //ATTACK

    case " ":
      playerOne.attack();
      playerOne.offsetX = 64;
      playerOne.offsetY = 76;
      playerOne.imageHeight = 80;
      playerOne.maxFrames = 3;
      playerOne.originX = 90;

      break;
    case "ArrowDown":
      playerTwo.attack();
      playerTwo.offsetX = 89;
      playerTwo.offsetY = 1050;
      playerTwo.imageHeight = 78;
      playerTwo.maxFrames = 5;
      playerTwo.originX = 440;

      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    // LUFFY

    case "d":
      playerOne.speedy.x = 0;
      playerOne.maxFrames = 3;
      playerOne.offsetY = 0;
      playerOne.offsetX = 43;
      playerOne.originX = 0;
      break;
    case "q":
      playerOne.speedy.x = 0;
      playerOne.maxFrames = 3;
      playerOne.offsetY = 0;
      playerOne.offsetX = 43;
      playerOne.originX = 0;
      break;
    case "e":
      playerOne.speedy.y = 0;
      playerOne.maxFrames = 3;
      playerOne.offsetY = 0;
      playerOne.offsetX = 43;
      playerOne.originX = 0;
      break;

    // ZORO

    case "ArrowLeft":
      playerTwo.speedy.x = 0;
      playerTwo.offsetX = 49;
      playerTwo.offsetY = 100;
      playerTwo.imageHeight = 78;
      playerTwo.maxFrames = 4;
      playerTwo.originX = 0;
      break;
    case "ArrowUp":
      playerTwo.speedy.y = 0;
      playerTwo.offsetX = 49;
      playerTwo.offsetY = 100;
      playerTwo.imageHeight = 78;
      playerTwo.maxFrames = 4;
      playerTwo.originX = 0;
      break;
    case "ArrowRight":
      playerTwo.speedy.x = 0;
      playerTwo.offsetX = 49;
      playerTwo.offsetY = 100;
      playerTwo.imageHeight = 78;
      playerTwo.maxFrames = 4;
      playerTwo.originX = 0;
      break;

    //ATTACK

    case " ":
      playerOne.attackActivate = false;
      playerOne.maxFrames = 3;
      playerOne.offsetY = 0;
      playerOne.offsetX = 43;
      playerOne.originX = 0;
      break;
    case "ArrowDown":
      playerTwo.attackActivate = false;
      playerTwo.offsetX = 49;
      playerTwo.offsetY = 100;
      playerTwo.imageHeight = 78;
      playerTwo.maxFrames = 4;
      playerTwo.originX = 0;
      break;
  }
});
