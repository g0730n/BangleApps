const BLACK = 0;
const WHITE = 1;
const RED = 2;
const GREEN = 3;
const BLUE = 4;
const CYAN = 5;
const MAGENTA = 6;
const YELLOW = 7;

const RAT = 2;
const BLOB = 3;
const ORC = 4;
const WITCH = 5;
const DEVIL = 6;

const KEY = 0;
const KNIFE = 1;
const DERRINGER = 2;
const POISON = 3;
const BOMB = 4;
const POTION = 5;
const BLESS = 6;
const DOOR = 7;
const ALTAR1 = 8;
const ALTAR2 = 9;

const WALL = 1;

const DAWN = 0;
const DAY = 1;
const NIGHT = 2;

const E = 0;
const SE = 1;
const S = 2;
const SW = 3;
const W = 4;
const NW = 5;
const N = 6;
const NE = 7;

const SCREENWIDTH = 176;

const SPRITES =[
  atob("CAiDASSSSSSSSSSScTjiTidsTjhtjtttsScccQ=="), //rat
  atob("CAiDASSSSSSSSSSkSSUkiSgkESkkkUkAkikkkQ=="), //blob
  atob("CAiDAkiSUkQSCkiSUkQACiiSUUikUkSkSkSkSg=="), //orc
  atob("CAiDA2223W27a22gq20kq220m22yW20Si22SSw=="), //witch
  atob("CAiDATCSYTDIYSZJCTBIIYYBDCZJCSYTCSYTCQ=="), //devil
  atob("CAgDG22wwG22wY222DGG2wY222A22w2GG22w"), //knife
  atob("CAgDG22w22z2wbb2wAa22wCW22yW2222G22w"), //derringer
  atob("CAgDG22w2SS22yW22SS2yCCWyQSW2SS2G22w"), //poison
  atob("CAgDG22w2wG22A8mwHHGwA4G2AA22wG2G22w"), //bomb
  atob("CAgDG22w2kk220m22EE2wggm0EEm2gk2G22w"), //potion
  atob("CAgDDbbYbeebb33zeG+bbw3zeGGbbzzbDbbY"), //bless
  atob("CAgDDbbYbbbbbb2ze2zzebzzeb2zbbbbDbbY"), //key
  atob("CAiDAmA2AyASAUWSykiAUkmS0kiAUkmS0kS2Sg=="), //alter 1
  atob("CAiDAHs3sz+T+QWSyBz+eOGSxwD+QAGSwAS2SA==") //alter 2
];

const CONTMSG1 = "Tap to continue...";
const GAMETITLE = "The Cursed Maze";
const MSG_NEED = "You need the";
const MSG_USE = "You use the ";
const MSG_PLACE = "You place the ";
const MSG_BLESS = "blessing";
const MSG_KEY = "key";
const MSG_ATTACK = " attacks you!";
const MSG_ALTAR = "on the altar";
const MSG_DOOR = "and the door opens!";
const HITMSG1 = " hit for ";
const YOUMSG = "You";
const DIEDMSG = " died";
const USEMSG1 = " use ";
const RESTORE = " restores ";
const HPMSG = " HP";
const RCVMSG = " received ";
const LOSTMSG = " lost ";
const ITEMS = [ "Key", "Knife", "Derringer", "Poison", "Bomb", "Potion", "Blessing" ];
const DIRS = ['E','S','W','N'];

const ENEMY = ["Rat", "Blob", "Orc", "Witch", "Devil"];
const ENEMYID = Uint8Array([RAT,BLOB,ORC,WITCH,DEVIL]);
const ENEMYHP = Uint8Array([12,16,32,64,128]);

var player = {
  x: 2,
  y: 2,
  dir: W,
  angle: 3.1415,
  hp: 100,
  score: 0
}; //1.57 angle

//new more compact map array
const MAPCOLS = 20;
const MAPROWS = 10;

const X = 1; //WALL
const R = 2; //RAT
const Z = 3; //BLOB
const O = 4; //ORC
const C = 5; //WITCH
const B = 6; //DEVIL
const D = 7; //DOOR
const A = 8; //ALTAR


const M = new Uint8Array([
X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,
X,0,0,0,X,0,X,Z,X,0,O,0,0,0,0,0,0,0,O,X,
X,0,0,0,X,R,X,0,0,0,X,X,X,0,X,0,0,0,0,X,
X,0,0,0,X,0,0,Z,0,0,0,O,X,O,X,C,0,0,O,X,
X,0,0,0,X,R,X,0,O,X,X,X,X,X,X,X,X,X,X,X,
X,X,0,X,X,0,X,X,X,X,Z,0,0,X,0,D,0,0,0,X,
X,0,0,0,R,0,0,0,X,X,0,X,0,X,R,X,0,0,0,X,
X,0,0,0,X,0,X,0,X,X,0,X,0,X,0,X,0,0,0,X,
X,0,A,0,X,O,X,0,0,0,0,X,0,O,0,X,0,B,0,X,
X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X
]);

//function for reading map cell
function readCell(r, c){
  return M[r*MAPCOLS+c];
}

//function for writing map cell
function writeCell(v, r, c){
  M[r*MAPCOLS+c] = v;
}

function changeMapSprite(sId, nId, yId, xId){
  if(readCell(yId,xId) == sId){
    writeCell(nId, yId, xId);
  }
}

 
var playerItems = new Uint8Array(7);

var curEnemy;
var enemyHp;
var battleState = 0;
var endState = 0;
var gameWon = false;

//Settings
var clouds = true;
var grass = true;
var minimap = true;
var compass = true;
var inventory = true;

function clr(colorId, pos){
  const colors = new Uint16Array([0x000000,0xFFFFFF,0xFFF000,0x0F0F00,0x0000FF,0x000FFF,0xF0F0FF,0xFFFF00]);
  if(pos) g.setColor(colors[colorId]);
  else g.setBgColor(colors[colorId]);
}

function drawMsgBlock(msg, msg2){
  const FONTWIDTH = 6;
  let center = (0 | (SCREENWIDTH / 2 - msg.length / 2 * FONTWIDTH)); 
  clr(BLACK, 1);
  g.fillRect(8,48,SCREENWIDTH-8,96);
  clr(WHITE, 1);
  g.drawString(msg,center, 56);
  if(msg2){
    center = (0 | (SCREENWIDTH / 2 - msg2.length / 2 * FONTWIDTH)); 
    g.drawString(msg2,center, 80);
  }
}

function drawSprite(spriteXpos, spriteId, sDistance) {
  var px = 0 | player.x;
  var py = 0 | player.y;
  var playerSprite = readCell(py, px);

  if (spriteId > DOOR) {
    if (!playerItems[BLESS]) {
      if (playerSprite === spriteId) {
        drawMsgBlock(MSG_NEED, MSG_BLESS);
        Bangle.buzz(100);
      }
    } else if (playerSprite === spriteId) {
      if (spriteId !== ALTAR2) {
        sDistance = 12;
        spriteId = ALTAR2;
        changeMapSprite(ALTAR1, ALTAR2, py, px);
        playerItems[BLESS] = 0;
        g.drawImage(SPRITES[ALTAR2 + 4], 48, 100, { scale: 12 });
      }
      drawMsgBlock(MSG_PLACE + MSG_BLESS, MSG_ALTAR);
      gameWon = true;
    }
    g.drawImage(SPRITES[spriteId + 4], spriteXpos, 100, { scale: sDistance });
    return;
  }

  if (spriteId < DOOR) {
    if (playerSprite === spriteId) {
      if (!battleState) {
        curEnemy = spriteId - 2;
        enemyHp = ENEMYHP[curEnemy];
        drawMsgBlock(ENEMY[curEnemy], MSG_ATTACK);
        battleState = 1;
      }
      g.drawImage(SPRITES[spriteId - 2], 48, 96, { scale: sDistance });
    } else {
      g.drawImage(SPRITES[spriteId - 2], spriteXpos, 100, { scale: sDistance });
    }
    return;
  }

  if (sDistance === 12) {
    if (!playerItems[KEY]) {
      drawMsgBlock(MSG_NEED, MSG_KEY);
      Bangle.buzz(100);
    } else {
      playerItems[KEY] = 0;
      for(let dy = py - 1; dy < py + 2; dy++)
        for(let dx = px -1; dx < px + 2; dx++)
          if(readCell(dy,dx) == DOOR){
            changeMapSprite(DOOR, 0, dy, dx);
            drawEverything();
            drawMsgBlock(MSG_USE + MSG_KEY, MSG_DOOR);
            Bangle.buzz(40);
            return;
          }
    }
  }
}


function getRand(min, max){
  return (0 | (Math.random() * max)) + min;
}

function drawClouds(cloudEnd){
  const NUMCLOUDS = getRand(1,6);
  const CLOUDMIN = 8;
  const CLOUDMAX = 48;
  let timeDay = getDayTime();
  let cloudWidth;
  let cloudHeight;
  let cloudX;
  let cloudY;
  if(timeDay == DAWN || timeDay == DAY) clr(WHITE, 1);
  else clr(BLUE, 1);
  for( let i = 0; i < NUMCLOUDS; i++){
    cloudWidth = getRand(CLOUDMIN, CLOUDMAX);
    cloudHeight = getRand(CLOUDMIN, CLOUDMIN);
    cloudX = getRand(1, SCREENWIDTH - cloudWidth);
    cloudY = getRand(1, cloudEnd - cloudHeight);
    g.fillRect(cloudX, cloudY, cloudX + cloudWidth, cloudY + cloudHeight);
  }
}

function drawGrass(){
  clr(GREEN, 1);
  for (let row = 88; row < SCREENWIDTH; row = row + 11){
    for (let col = 0; col < SCREENWIDTH; col = col + 16){
      if(Math.random() < 0.1){
        g.fillRect(col, row, col+2, row+4);
        g.fillRect(col+4, row+2, col+6, row+6);
      }
    }
  }
}

function drawSky(timeNow){
  const SKYEND = 80;
  if(timeNow == DAWN){
    clr(RED, 1);
    g.fillRect(0,0,SCREENWIDTH,SKYEND);
    clr(YELLOW, 1);
  }
  else if(timeNow == DAY){
    clr(CYAN, 1);
    g.fillRect(0,0,SCREENWIDTH,SKYEND);
    clr(YELLOW, 1);
  }
  else if(timeNow == NIGHT){
    clr(BLACK, 1);
    g.fillRect(0,0,SCREENWIDTH,SKYEND);
    clr(CYAN, 1);
  }
  if(compass && player.dir == S) g.fillCircle(87,18,24);
  if(clouds) drawClouds(SKYEND);
}

function drawGround(timeNow){
  if(timeNow == DAWN || timeNow == NIGHT)
    clr(BLACK, 1);
  else clr(WHITE, 1);
  g.fillRect(0,96,SCREENWIDTH,SCREENWIDTH);
  if(grass) drawGrass();
}

function drawMiniMap(hasMoved) {
  var _t = Date.now();
  if(hasMoved){
    const MAPXOFFSET = 8;//116;
    const MAPYOFFSET = 16;
    const CELLSIZE = 8; //3
    const curX = player.x | 0;
    const curY = player.y | 0;
    clr(BLACK, 1);
    g.fillRect(MAPXOFFSET, MAPYOFFSET, MAPXOFFSET + CELLSIZE * MAPCOLS - 1, MAPYOFFSET + CELLSIZE * MAPROWS - 1);
    const colorMap = {
      WALL: WHITE,
      DOOR: YELLOW
    };
    for (let y = 0; y < MAPROWS; y++) {
      let yPos = MAPYOFFSET + y * CELLSIZE;
      for (let x = 0; x < MAPCOLS; x++) {
        let xPos = MAPXOFFSET + x * CELLSIZE;
        let cellType = readCell(y, x);
        if (cellType || (x === curX && y === curY)) {
          let color = colorMap[cellType] || (cellType > WALL && cellType < DOOR ? RED : WHITE);
          if (x === curX && y === curY) color = GREEN;
          clr(color, 1);
          g.fillRect(xPos, yPos, xPos + CELLSIZE - 1, yPos + CELLSIZE - 1);
        }
      }
    }
  }
  print("minimap MS",Date.now()-_t);_t = Date.now();
}


function drawInventory(){
  let x = SCREENWIDTH - 17;
  for(let i = 0; i < playerItems.length; i++){
    if(playerItems[i]){
      if(i == 0) g.drawImage(SPRITES[playerItems[i]+10], x, 0, {scale: 2});
      else g.drawImage(SPRITES[playerItems[i]+4], x, 0, {scale: 2});
      x -= 15;
    }
  }
}

function drawHP(){
  const NEWHP = (0 | player.hp/2);
  const XOFF = 16;
  const HEIGHT = 15;
  clr(RED, 1);
  g.fillRect(XOFF,2,50+XOFF,HEIGHT);
  clr(GREEN, 1);
  g.fillRect(XOFF,2,NEWHP+XOFF,HEIGHT);
}

function drawCompass(pMoved){
  const DIRS = ['E','S','W','N'];
  clr(BLACK,1);
  g.fillRect(0,0,16,16);
  if(pMoved) clr(WHITE, 1);
  else clr(RED, 1);
  if(player.dir == SE) g.drawString(DIRS[1]+DIRS[0],1,3);
  else if(player.dir == SW) g.drawString(DIRS[1]+DIRS[2],1,3);
  else if(player.dir == NW) g.drawString(DIRS[3]+DIRS[2],1,3);
  else if(player.dir == NE) g.drawString(DIRS[3]+DIRS[0],1,3);
  else g.drawString(DIRS[player.dir/2],1,3);
}


function drawOverlay(pMoved){
  var _t = Date.now();
  clr(BLACK,1);
  g.fillRect(0,0,SCREENWIDTH-1,16);
  drawCompass(pMoved);
  drawHP();
  
  drawInventory();
  print("Overlay MS",Date.now()-_t);_t = Date.now();
}

function castRay(rayAngle) {
  let x = player.x;
  let y = player.y;
  let dx = Math.cos(rayAngle);
  let dy = Math.sin(rayAngle);
  let tile = 0;
  let cell = readCell((0 | y), (0 | x));
  let i = 0;
  let spriteDistance;
  while (cell != WALL && cell < 10 && cell != DOOR) {
    cell = readCell((0 | y), (0 | x));
    x += dx * 0.1;
    y += dy * 0.1;
    i++;
    if (i > 48) break;
    if(!tile && cell > 1){
      tile = readCell((0 | y), (0 | x));
      spriteDistance = Math.sqrt(Math.pow(x - player.x ,2)+ Math.pow(y - player.y, 2));
    }
  }
  let distance = Math.sqrt(Math.pow(x - player.x ,2)+ Math.pow(y - player.y, 2));

  let wallHeight = SCREENWIDTH / 2 / distance;
  if(wallHeight > SCREENWIDTH) wallHeight = SCREENWIDTH - 16;
  return {
    t: tile,
    w: wallHeight,
    s: spriteDistance
  };
}

function drawWallSlice(i, wallHeight, sliceWidth, tile) { 
  if(wallHeight < 20) clr(BLACK, 1);
  else if(wallHeight < 30) clr(BLUE, 1);
  else if(wallHeight < 40) clr(MAGENTA, 1);
  else clr(GREEN, 1); 
  if(tile == 7) clr(YELLOW, 1);
  let yPosition = 0 | (SCREENWIDTH / 2 - wallHeight / 2);
  g.fillRect(i * sliceWidth, yPosition, i* sliceWidth + sliceWidth, yPosition + wallHeight);
}

function rayCast(){
  var _t = Date.now();
  const RAYS = SCREENWIDTH / 16;
  const SLICEWIDTH = SCREENWIDTH / RAYS;
  const FOV = Math.PI / 4;
  const ANGLESTEP = FOV / RAYS;
  
  let spriteDraw = 0;
  let spriteLoc = 0;
  let ret;
  for (let i = 0; i < RAYS; i++) {
    let rayAngle = player.angle - (FOV / 2) + i * ANGLESTEP;
    ret = castRay(rayAngle);
    if(ret.t > 1 && !spriteDraw){
      spriteDraw = ret.t;
      spriteLoc = i * SLICEWIDTH;
    }
    drawWallSlice(i,ret.w, SLICEWIDTH, ret.t);
  }
  if(spriteDraw){
    if(ret.s < 0.6) ret.s = 12;
    else if(ret.s < 1.1) ret.s = 8;
    else if(ret.s < 1.5) ret.s = 6;
    else if(ret.s < 2.1) ret.s = 3;
    else if(ret.s < 2.6) ret.s = 2;
    else if(ret.s < 4.4) ret.s = 1;
    else ret.s = 0;
    if(ret.s) drawSprite(spriteLoc, spriteDraw, ret.s);
  }
  print("rayCast MS",Date.now()-_t);_t = Date.now();
}

function drawEverything(playerHasMoved) {
  if(playerHasMoved || battleState){
    let timeNow = getDayTime();
    g.clear();
    drawSky(timeNow);
    drawGround(timeNow);
    rayCast();
  }
  drawOverlay(playerHasMoved);
}

function getDayTime(){
  let dayTime;
  let nowTime = Date();
  let curHour = nowTime.getHours();
  if((curHour > 5 && curHour < 8) || (curHour > 20 && curHour < 21)) dayTime = DAWN;
  else if(curHour > 7 && curHour < 21) dayTime = DAY;
  else dayTime = NIGHT;
  return dayTime;
}

function doBattle(){
  var enemyName = ENEMY[curEnemy];
  var enemyId = ENEMYID[curEnemy];
  
  if(battleState == 1){
    let enemyRoll = getRand(0, (enemyId + enemyHp / 10 + 1));
    drawMsgBlock(enemyName, HITMSG1 + enemyRoll);
    player.hp -= enemyRoll;
    drawHP();
    if(player.hp < 1) drawMsgBlock(YOUMSG+DIEDMSG,YOUMSG+LOSTMSG);
    battleState++;
  }
  else if(battleState == 2){
    if(player.hp < 1) load();
    if(playerItems[POTION] && player.hp < 75){
      let addHp = POTION * BLESS;
      playerItems[POTION] = 0;
      drawEverything();
      drawMsgBlock(ITEMS[POTION] + RESTORE, addHp + HPMSG);
      player.hp += addHp;
    }
    else{
      if(playerItems[POISON] && enemyId > BLOB){
        let hit = POISON * BLESS;
        playerItems[POISON] = 0;
        drawEverything();
        drawMsgBlock(YOUMSG + USEMSG1 + ITEMS[POISON], YOUMSG + HITMSG1 + hit);
        enemyHp -= hit;
      }
      else if(playerItems[BOMB] && enemyId > ORC){
        let hit = BOMB * BLESS;
        playerItems[BOMB] = 0;
        drawEverything();
        drawMsgBlock(YOUMSG + USEMSG1 + ITEMS[BOMB], YOUMSG + HITMSG1 + hit);
        enemyHp -= hit;
      }
      else {
        let weapons = playerItems[KNIFE] * POISON + playerItems[DERRINGER] * BOMB + playerItems[BLESS] * BLESS;
        let playerRoll = getRand(weapons, player.hp / 10);
        enemyHp -= playerRoll;
        drawMsgBlock(YOUMSG, HITMSG1 + playerRoll);
      }
    }
    if(enemyHp < 1) battleState++; 
    else battleState--;
  }
  else if(battleState == 3){
    drawMsgBlock(enemyName, DIEDMSG);
    player.score += enemyId;
    changeMapSprite(enemyId, 0, (0 | player.y), (0 | player.x));
    battleState++;
  }
  else if(battleState == 4){
    let itemRoll = getRand(0, enemyId + 2);
    if(itemRoll > POTION) itemRoll = POTION;
    if(enemyId == WITCH){
      let msg;
      if(itemRoll && !playerItems[itemRoll]){
        msg2 = YOUMSG + RCVMSG + ITEMS[itemRoll];
        playerItems[itemRoll] = itemRoll;
      }
      else {
        msg = YOUMSG + LOSTMSG + ITEMS[itemRoll];
        playerItems[itemRoll] = 0;
        drawEverything();
      }
      playerItems[KEY]++;
      drawInventory();
      drawMsgBlock(YOUMSG + RCVMSG + ITEMS[KEY], msg);
    }
    else if(enemyId == DEVIL){
      let msg;
      playerItems[BLESS] = BLESS;
      if(itemRoll && !playerItems[itemRoll]){
        msg = YOUMSG + RCVMSG + ITEMS[itemRoll];
        playerItems[itemRoll] = itemRoll;
      }
      drawInventory();
      drawMsgBlock(YOUMSG + RCVMSG + ITEMS[BLESS], msg);
    }
    else if(itemRoll && !playerItems[itemRoll]){
      playerItems[itemRoll] = itemRoll;
      drawInventory();
      drawMsgBlock(YOUMSG + RCVMSG, ITEMS[itemRoll]);
    }
    
    enemyHp = 0;
    battleState = 0;
    curEnemy = 0;
  }
}

function wallCollisionCheck() {
  const FLOORX = (0 | player.x);
  const FLOORY = (0 | player.y);
  const CELL = readCell(FLOORY, FLOORX);
  if (FLOORX < 0 || FLOORX >= MAPCOLS || FLOORY < 0 || FLOORY >= MAPROWS) return true;
  return (CELL == WALL || CELL == DOOR);
}

function handleInput(pTouch) {
  let playerMoved = false;
  const speed = 0.5;
  const angularSpeed = 0.785375;
  const oldX = player.x;
  const oldY = player.y;
  if (pTouch == 1) {
    player.x += Math.cos(player.angle) * speed;
    player.y += Math.sin(player.angle) * speed;
    playerMoved = true;
  }
  else if (pTouch == 2) {
    player.x -= Math.cos(player.angle) * speed;
    player.y -= Math.sin(player.angle) * speed;
    playerMoved = true;
  }
  else if (pTouch == 3){
    player.angle -= angularSpeed;
    player.dir--;
    if(player.dir < 0) player.dir = 7;
    playerMoved = true;
  }
  else if (pTouch == 4){
    player.angle += angularSpeed;
    player.dir++;
    if(player.dir > 7) player.dir = 0;
    playerMoved = true;
  }
  if (player.angle < 0){
    player.angle += 2 * Math.PI;
  }
  if (player.angle >= 2 * Math.PI){
    player.angle -= 2 * Math.PI;
  }
  if (wallCollisionCheck()) {
    player.x = oldX;
    player.y = oldY;
    playerMoved = false;
  }
  return playerMoved;
}

function endGame(){
  const EMSG10 = "Congratulations on beating";
  const EMSG20 = "You are a valiant warrior.";
  const EMSG21 = "Your Score: ";
  const EMSG30 = "This game was created by:";
  const EMSG31 = "g0730n";
  const EMSG40 = "Licensed under the";
  const EMSG41 = "MIT License";
  const EMSG50 = "There may be a second";
  const EMSG51 = "level in the future.";
  const EMSG60 = "Have a great day!";
  
  
  if(endState == 0) drawEverything(); 
  else if(endState == 1) drawMsgBlock(EMSG10, GAMETITLE); 
  else if(endState == 2) drawMsgBlock(EMSG20, EMSG21+player.score); 
  else if(endState == 3) drawMsgBlock(EMSG30, EMSG31); 
  else if(endState == 4) drawMsgBlock(EMSG40, EMSG41); 
  else if(endState == 5) drawMsgBlock(EMSG50, EMSG51); 
  else if(endState == 6) drawMsgBlock(EMSG60); 
  else if(endState == 7) drawMsgBlock(CONTMSG1);
  else load();
  endState++;
}

function gameMove(touchArea) {
  if(!gameWon){
    if(battleState) doBattle();
    else drawEverything(handleInput(touchArea)); 
  }
  else endGame(); 
}

function intro(){
  Bangle.setLCDTimeout(0);
  g.setFont6x15();
  g.clear();
  drawEverything(true);
  drawMsgBlock(GAMETITLE,CONTMSG1);
}

Bangle.on('swipe', function(directionLR, directionUD) {
  drawMiniMap(true);
});

Bangle.on('touch', function(button, xy) {
  let touchArea = 0;
  if(xy.y < 40) touchArea = 1;
  else if(xy.y > 136) touchArea = 2;
  else if(xy.x < 40) touchArea = 3;
  else if(xy.x > 136) touchArea = 4;
  else touchArea = 5;
  gameMove(touchArea);
});

intro();