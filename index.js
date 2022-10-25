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

////// BACKGROUND
const background = new Sprite({
  position: { x: 0, y: 0 },
  image: "../assets/scene-pirateship.png",
});

////// CREATE PLAYERS
class Players {
  constructor({ position, speedy, offset, image }) {
    this.position = position;
    this.speedy = speedy;
    this.height = 300;
    this.width = 250;
    this.health = 100;
    this.image = new Image();
    this.image.src = image;
    this.offsetX = 195;
    this.offsetY = 0;
    this.imageHeigth = 230;
    this.maxFrames = 3;
    this.frames = 0;

    // CREATE ATTACK
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 250,
      height: 300,
      offset: offset,
    };

    this.attackActivate = false;
    this.change = false;
  }
  draw() {
    // DRAW PLAYERS

    // ctx.drawImage(
    //   image,
    //   sx,
    //   sy,
    //   sLargeur,
    //   sHauteur,
    //   dx,
    //   dy,
    //   dLargeur,
    //   dHauteur
    // );
    ctx.drawImage(
      this.image,
      this.offsetX * this.frames,
      this.offsetY,
      this.offsetX,
      this.imageHeigth,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );

    // DRAW ATTACK BOX
    //   if (this.attackActivate) {
    //     ctx.fillRect(
    //       this.attackBox.position.x,
    //       this.attackBox.position.y,
    //       this.attackBox.height,
    //       this.attackBox.width
    //     );
    //   }
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
  // WHEN THIS FUNCTION IS CALL, ITS TRUE
  attack() {
    this.attackActivate = true;
  }
}

// PLAYERONE
const playerOne = new Players({
  position: { x: 0, y: 0 },
  speedy: { x: 0, y: 0 },
  offset: { x: 0, y: 0 },
  image: "./assets/Luffysprites.png",
});

// PLAYERTWO
const playerTwo = new Players({
  position: { x: 800, y: 0 },
  speedy: { x: 0, y: 0 },
  offset: { x: 50, y: 0 },
  image: "./assets/Zoro.png",
});

//////////////// ANIMATE //////////////
let time = 60;

function timer() {
  setTimeout(timer, 1000);
  if (time > 0) {
    time--;
    document.querySelector("#timer").innerHTML = time;
    console.log(time);
  }
}
timer();

//////////////// ANIMATE //////////////
function animate() {
  gameFrames = requestAnimationFrame(animate);
  if (gameFrames % 10 === 0) {
    playerOne.frames++;
  }
  // setInterval(() => {
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
    playerTwo.health -= 2;
    document.querySelector("#playerOneHealth").style.width =
      playerTwo.health + "% ";
  }

  // GAME OVER AND WIN

  if (playerOne.health === 0) {
    console.log("PLAYERONE LOST");
    console.log("PLAYERTWO WIN");
  }
  if (playerTwo.health === 0) {
    console.log("PLAYERTWO LOST");
    console.log("PLAYERONE WIN");
  }
  // }, 500);
}

animate();

// KEY

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      playerOne.speedy.x = 5;
      playerOne.maxFrames = 1;
      playerOne.offsetY = 250;
      playerOne.offsetX = 250;
      break;
    case "q":
      playerOne.speedy.x = -5;
      break;
    case "e":
      playerOne.speedy.y = -10;
      playerOne.maxFrames = 3;
      playerOne.offsetY = 600;

      break;
    case "k":
      playerTwo.speedy.x = -5;
      break;
    case "i":
      playerTwo.speedy.y = -10;
      break;
    case "m":
      playerTwo.speedy.x = 5;
      break;
    case " ":
      playerOne.attack();
      playerOne.maxFrames = 2;
      playerOne.offsetY = 900;
      playerOne.offsetX = 195;
      break;
    case "j":
      playerTwo.attack();
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      playerOne.speedy.x = 0;
      playerOne.maxFrames = 3;
      playerOne.offsetY = 0;
      playerOne.offsetX = 195;
      break;
    case "q":
      playerOne.speedy.x = 0;
      break;
    case "e":
      playerOne.speedy.y = 0;
      playerOne.maxFrames = 3;
      playerOne.offsetY = 0;
      break;
    case "k":
      playerTwo.speedy.x = 0;
      break;
    case "i":
      playerTwo.speedy.y = 0;
      break;
    case "m":
      playerTwo.speedy.x = 0;
      break;
    case " ":
      playerOne.attackActivate = false;
      playerOne.maxFrames = 3;
      playerOne.offsetY = 0;
      playerOne.offsetX = 195;
      break;
    case "j":
      playerTwo.attackActivate = false;
      break;
  }
});
