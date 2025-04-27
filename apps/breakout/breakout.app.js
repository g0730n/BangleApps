var bricks = [[],[],[],[],[]];

const SR = 176; //screen resolution
const XO = 0; //bricks x offset
const YO = 24; //bricks y offset
const BCOL = 6; //brick COLS
const BROW = 4; //brick ROWS
const BSPC = 3; //brick spacing

const BT = 24; //total bricks
const BW = 27; //brick width
const BH = 12; //brick height

var c1 = 1; //color R
var c2 = 1; //color G
var c3 = 1; //color B


const PW = 48; //paddle width
const PH = 8; //paddle height
const PC = SR / 2 - PW / 2; //paddle center
var px = PC; //paddle x
var npx = px; //paddle move to x location
var py = SR - PH - 2; //paddle y

const BR = 4; //ball radius
var bx = px + PW / 2; //ball x
var by = SR - BR * 2 - PH - BR; //ball y
var bss = -1.0; //speed
var bxs = bss; //ball x speed
var bys = bss; //ball y speed

var LxC = 0; //last x checked
var LyC = 0; // last y checked

var balls = 3; //staring balls
var score = 0; // player score

var gamePaused = true;
var gameOver = false;

g.setFont6x15(3);
Bangle.setLCDTimeout(0); // turn off the timeout
Bangle.setLCDPower(1); // keep screen on
Bangle.setLocked(false); // unlock screen if locked


function f2i(value) {
  return value | 0;
}

function randomColor() {
  c1 = Math.floor(Math.random() * 2);
  c2 = Math.floor(Math.random() * 2);
  c3 = Math.floor(Math.random() * 2);
  return c1 + c2 + c3;
}

function setupBricks() {
  let row = 0;
  let col = 0;

  for (let i = 0; i < BT; i++) {
    let color = randomColor();
    if (color == 3 || color == 0) {
      while (color == 3 || color == 0) {
        color = randomColor();
      }
    }
    bricks[row].push([c1, c2, c3, 1]);
    if (col > BCOL - 2) {
      col = 0;
      row++;
    } else {
      col++;
    }
  }
}

function drawBrick(row, col) {
  let x = col * (BW + BSPC) + XO;
  let y = row * (BH + BSPC) + YO;
  g.setColor(bricks[row][col][0], bricks[row][col][1], bricks[row][col][2]);
  g.fillRect(x, y, x + BW, y + BH);
}

function eraseBrick(row, col) {
  bricks[row][col][0] = 0;
  bricks[row][col][1] = 0;
  bricks[row][col][2] = 0;
  bricks[row][col][3] = 0;
}

function checkBrick(row, col) {
  return bricks[row][col][3];
}

function drawBricks() {
  let row = 0;
  let col = 0;
  for (let i = 0; i < BT; i++) {
    drawBrick(row, col);
    if (col > BCOL - 2) {
      col = 0;
      row++;
    } else {
      col++;
    }
  }
}

function erasePaddle() {
  g.setColor(0, 0, 0);
  g.fillRect(px, SR - PH - 2, px + PW, SR - 2 + PH);
}

function drawPaddle() {
  g.setColor(1, 1, 1);
  g.fillRect(px, py, px + PW, py + PH);
}

function resetBall() {
  erasePaddle();
  eraseBall();
  px = PC;
  bx = px + PW / 2; //ball x
  by = SR - BR * 2 - PH - BR; //ball y
  drawPaddle();
  drawBall();
}

function eraseBall() {
  g.setColor(0, 0, 0);
  g.drawCircle(f2i(bx), f2i(by), BR);
}

function drawBall() {
  g.setColor(1, 1, 1);
  g.drawCircle(f2i(bx), f2i(by), BR);
}

function checkBrickCollision(nbx, nby) {
  let colX = f2i((nbx - XO) / (BW + BSPC));
  let rowX = f2i((nby - YO) / (BH + BSPC));
  let collision = false;
  if (colX > BCOL - 1) {
    colX = BCOL - 1;
  }
  if (colX < 0) {
    colX = 0;
  }
  if (rowX > 3) {
    rowX = 3;
  } else if (rowX < 0) {
    rowX = 0;
  }

  if (LyC != rowX || LxC != colX) {
    LyC = rowX;
    LxC = colX;

    if (checkBrick(rowX, colX)) {
      Bangle.buzz(70,1);
      eraseBrick(rowX, colX);
      drawBrick(rowX, colX);
      collision = true;
      score++;
      if (score == BT) {
        g.setColor(1, 1, 1);
        g.drawString("You Win!", 20, 100);
        //bys = bss;
        //bxs *= 0.1;
        //resetBall();
        gameOver = true;
        gamePaused = true;
      }
    }
    if (collision) {
      bxs *= Math.random();
      bys *= -1.0;
    }
  }
}

function checkBallCollision() {
  let nbx = f2i(bx += bxs);
  let nby = f2i(by += bys);

  if (nbx <= 0) {
    bx = BR;
    bxs *= -1.0;
  } else if (nbx >= SR) {
    bx = SR - BR;
    bxs *= -1.0;
  }

  if (nby <= 0) {
    by = BR;
    bys *= -1.0;
  } else if (nby > YO && nby < 86) {
    checkBrickCollision(nbx, nby);
  } else if (nby > SR) {
    Bangle.buzz(40,1);
    gamePaused = true;
    balls--;
    if (balls < 1) {
      g.setColor(1, 1, 1);
      g.drawString("You Lose!", 20, 86);
g.drawString("score: "+score,20,124);
      gameOver = true;
    }
  } else if (nby + BR + 2 > py - 2 && nby + BR + 2 < py) {
    if (nbx >= px && nbx <= px + PW / 4) {
      by = py - BR * 2;
      bxs = bss;
      bys = bss;
    } else if (nbx >= px + PW / 4 && nbx <= px + PW / 2) {
      by = py - BR * 2;
      bxs *= -bss + 0.1;
      bys = bss;
    } else if (nbx >= px + PW / 2 && nbx <= px + PW) {
      by = py - BR * 2;
      bxs = -bss;
      bys = bss;
    }
  }
}

function moveBall() {
  if (!gamePaused) {
    eraseBall();
    checkBallCollision();
    drawBall();
  }
}

function setupGame() {
  balls = 3;
  score = 0;
  gamePaused = true;
  g.setBgColor(0, 0, 0);
  g.clear();
  setupBricks();
  drawBricks();
  drawPaddle();
  drawBall();
}

function checkButton(button, xy) {
  if (button) {
    if (gamePaused) {
      bys = bss;
      bxs *= 0.1;
      resetBall();
      gamePaused = false;
      npx = PC;
    } else if (gameOver) {
      gameOver = false;
      bricks = [[],[],[],[],[]];
      setupGame();
    } else {
      npx = xy.x;
    }
  }
}

function movePaddle() {
  if (px + PW / 2 != npx) {
    erasePaddle();
    if (px + PW / 2 > npx) {
      px -= 2;
    }
    if (px + PW / 2 < npx) {
      px += 2;
    }
    drawPaddle();
  }
}

function draw() {
  if (!gamePaused && !gameOver) {
    moveBall();
    movePaddle();
  }
}

setupGame();

Bangle.on('touch', function(button, xy) {
  checkButton(button, xy);
});

var secondInterval = setInterval(draw, 20);
