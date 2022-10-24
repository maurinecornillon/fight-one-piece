const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1180;
canvas.height = 526;
const gravity = 0.4;

///////
////// CREATE PLAYERS
class Players {
  constructor({ position, speedy, color = "red", offset }) {
    this.position = position;
    this.speedy = speedy;
    this.height = 150;
    this.width = 50;
    // CREATE ATTACK
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 100,
      height: 100,
      offset: offset,
    };
    this.color = color;
    this.attackActivate = false;
  }
  draw() {
    // DRAW PLAYERS
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

    // DRAW ATTACK BOX
    if (this.attackActivate) {
      ctx.fillStyle = this.color;
      ctx.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.height,
        this.attackBox.width
      );
    }
  }
  update() {
    this.draw();
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

const playerOne = new Players({
  position: { x: 10, y: 0 },
  speedy: { x: 0, y: 0 },
  offset: { x: 0, y: 0 },
});

const playerTwo = new Players({
  position: { x: 800, y: 0 },
  speedy: { x: 0, y: 0 },
  offset: { x: 50, y: 0 },
  color: "purple",
});

function animate() {
  window.requestAnimationFrame(animate);
  ctx.fillStyle = "green";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  playerOne.update();
  playerTwo.update();

  // ATTACK
  if (
    playerOne.attackBox.position.x + playerOne.attackBox.width >=
      playerTwo.position.x &&
    playerOne.attackBox.position.x <= playerTwo.position.x + playerTwo.width &&
    playerOne.attackBox.position.y + playerOne.attackBox.height >=
      playerTwo.position.y &&
    playerOne.attackBox.position.y <= playerTwo.position.y + playerTwo.height &&
    playerOne.attackActivate
  ) {
    console.log("touch");
  }
  if (
    playerTwo.attackBox.position.x + playerTwo.attackBox.width >=
      playerOne.position.x &&
    playerTwo.attackBox.position.x <= playerOne.position.x + playerOne.width &&
    playerTwo.attackBox.position.y + playerTwo.attackBox.height >=
      playerOne.position.y &&
    playerTwo.attackBox.position.y <= playerOne.position.y + playerOne.height &&
    playerTwo.attackActivate
  ) {
    console.log("playerTwo touch");
  }
}

animate();

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      if (playerOne.position.x <= canvas.width - 140) playerOne.speedy.x = 5;
      break;
    case "q":
      if (playerOne.position.x >= 30) playerOne.speedy.x = -5;

      break;
    case "e":
      playerOne.speedy.y = -10;
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
      break;
    case "q":
      playerOne.speedy.x = 0;
      break;
    case "e":
      playerOne.speedy.y = 0;
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
      break;
    case "j":
      playerTwo.attackActivate = false;
      break;
  }
});
