const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");
const btnUp = document.querySelector("#up");
const btnLeft = document.querySelector("#left");
const btnRight = document.querySelector("#right");
const btnDown = document.querySelector("#down");
const spanLives = document.querySelector("#lives");
const spanTime = document.querySelector("#time");
const spanRecord = document.querySelector("#record");
const pResult = document.querySelector("#result");

let canvasSize;
let elementSize;
let level = 0;
let lives = 3;

let timeStart;
let timeInterval;

const playerPosition = {
  x: undefined,
  y: undefined,
};
const giftPosition = {
  x: undefined,
  y: undefined,
};
let enemiesPosition = [];

window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);

function setCanvasSize() {
  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.6;
  } else {
    canvasSize = window.innerHeight * 0.6;
  }

  canvasSize = Number(canvasSize.toFixed(0));

  canvas.setAttribute("width", canvasSize);
  canvas.setAttribute("height", canvasSize);

  elementSize = canvasSize / 10;

  playerPosition.x = undefined;
  playerPosition.y = undefined;
  gameStart();
}
function gameStart() {
  game.font = elementSize + "px Arial";
  game.textAlign = "end";

  const map = maps[level];

  if (!map) {
    gameWin();
    return;
  }

  if (!timeStart) {
    timeStart = Date.now();
    timeInterval = setInterval(showTime, 100);
    showRecord();
  }

  const mapRows = map.trim().split("\n");
  const mapRowCol = mapRows.map((row) => row.trim().split(""));
  console.log({ map, mapRows });

  showLives();

  enemiesPosition = [];
  game.clearRect(0, 0, canvasSize, canvasSize);

  mapRowCol.forEach((row, rowI) => {
    row.forEach((col, colI) => {
      const emoji = emojis[col];
      const posX = elementSize * (colI + 1);
      const posY = elementSize * (rowI + 1);
      if (col == "O") {
        if (!playerPosition.x && !playerPosition.y) {
          playerPosition.x = posX;
          playerPosition.y = posY;
          console.log(playerPosition);
        }
      } else if (col == "I") {
        giftPosition.x = posX;
        giftPosition.y = posY;
      } else if (col == "X") {
        enemiesPosition.push({
          x: posX,
          y: posY,
        });
      }
      game.fillText(emoji, posX, posY);
    });
  });

  // for (let row = 1; row <= 10; row++) {
  //   for (let col = 1; col <= 10; col++) {
  //     game.fillText(emojis[mapRowCol[row - 1][col - 1]], elementSize * col, elementSize * row);
  //   }
  // }
  movePlayer();
}
function movePlayer() {
  const giftCollisionX =
    playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
  const giftCollisionY =
    playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
  const giftCollision = giftCollisionX && giftCollisionY;

  if (giftCollision) {
    levelWin();
  }

  const enemiesCollision = enemiesPosition.find((enemy) => {
    const enemiesCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
    const enemiesCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
    return enemiesCollisionX && enemiesCollisionY;
  });

  if (enemiesCollision) {
    levelFail();
  }

  game.fillText(emojis["PLAYER"], playerPosition.x, playerPosition.y);
}
function levelWin() {
  console.log("Subiste de nivel");
  level++;
  gameStart();
}
function gameWin() {
  console.log("¡Terminaste el juego!");
  clearInterval(timeInterval);

  const recordTime = localStorage.getItem("record_time");
  const playerTime = Date.now() - timeStart;

  if (recordTime) {
    if (recordTime >= playerTime) {
      localStorage.setItem("record_time", playerTime);
      pResult.innerHTML = "Nuevo Record, Felicitaciones :)";
    } else {
      pResult.innerHTML = "Lo siento no superaste el record :(";
    }
  } else {
    localStorage.setItem("record_time", playerTime);
    pResult.innerHTML = "Intenta marcar el mejor record :)";
  }
  console.log({ recordTime, playerTime });
}
function levelFail() {
  console.log("Chocaste con un enemigo");
  lives--;
  console.log(lives);
  if (lives <= 0) {
    level = 0;
    lives = 3;
    timeStart = undefined;
  }
  playerPosition.x = undefined;
  playerPosition.y = undefined;
  gameStart();
}
function showLives() {
  const heartsArray = Array(lives).fill(emojis["HEART"]);
  // console.log(heartsArray);
  spanLives.innerHTML = "";
  heartsArray.forEach((heart) => spanLives.append(heart));

  // spanLives.innerHTML = emojis["HEART"];
}
function showTime() {
  spanTime.innerHTML = Date.now() - timeStart;
}
function showRecord() {
  spanRecord.innerHTML = localStorage.getItem("record_time");
}
window.addEventListener("keydown", moveByKeys);
btnUp.addEventListener("click", moveUp);
btnLeft.addEventListener("click", moveLeft);
btnRight.addEventListener("click", moveRight);
btnDown.addEventListener("click", moveDown);

function moveByKeys(event) {
  if (event.key == "ArrowUp") moveUp();
  else if (event.key == "ArrowLeft") moveLeft();
  else if (event.key == "ArrowRight") moveRight();
  else if (event.key == "ArrowDown") moveDown();
}
function moveUp() {
  console.log("Me quiero mover hacia arriba");
  if (playerPosition.y - elementSize < elementSize) {
    console.log("Out");
  } else {
    playerPosition.y -= elementSize;
    gameStart();
  }
}
function moveLeft() {
  console.log("Me quiero mover hacia la izquierda");
  if (playerPosition.x - elementSize < elementSize) {
    console.log("Out left");
  } else {
    playerPosition.x -= elementSize;
    gameStart();
  }
}
function moveRight() {
  console.log("Me quiero mover hacia la derecha");
  if (playerPosition.x + elementSize > canvasSize) {
    console.log("Out right");
  } else {
    playerPosition.x += elementSize;
    gameStart();
  }
}
function moveDown() {
  console.log("Me quiero mover hacia abajo");
  if (playerPosition.y + elementSize > canvasSize) {
    console.log("Out down");
  } else {
    playerPosition.y += elementSize;
    gameStart();
  }
}
