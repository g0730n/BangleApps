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
const KNIFE = 2;
const DERRINGER = 2;
const POISON = 3;
const BOMB = 4;
const POTION = 5;
const BLESS = 6;
const DOOR = 7;
const ALTER1 = 8;
const ALTER2 = 9;

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

const ENEMY = [
  ["Rat", 12],
  ["Blob", 16],
  ["Orc", 32],
  ["Witch", 64],
  ["Devil", 100]
];

var player = {
  x: 2,
  y: 2,
  angle: 1.5,
  hp: 100,
};

/*
var map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 8, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1],
  [1, 5, 1, 4, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 7, 1, 1, 1],
  [1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 3, 1, 0, 6, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];
*/


//new more compact map array
const MAPCOLS = 20;
const MAPROWS = 10;
const M = new Uint8Array(MAPCOLS*MAPROWS);

//function for reading map cell
function readCell(r, c){
  return M[r*MAPCOLS+c];
}

//function for writing map cell
function writeCell(v, r, c){
  M[r*MAPCOLS+c] = v;
}


//function for looping through entire map
function setupMapBorder(){
  for(let r = 0; r < MAPROWS; r++){
    let line = "";
    for(let c = 0; c < MAPCOLS; c++){
      if(r == 0 || r == MAPROWS -1 || c == 0 || c == MAPCOLS - 1)
        writeCell(1,r,c);
    }
  }
}

function goUp(x, y){
  while(y > 2){
    writeCell(1, y, x);
    y--;
  }
  return y;
}

function goDown(x, y){
  while(y < MAPROWS - 3){
    writeCell(1, y, x);
    y++;
  }
  return y;
}

function goRight(x, y){
  let start = x;
  while(x < start + 4 && x < MAPCOLS){
    writeCell(1, y, x);
    if(x == MAPCOLS - 2){
      y--;
      writeCell(6, y, x);
      writeCell(7, y, x-2);
      x++;
    }
    x++;
  }
  return x;
}

function getRandomTile(){
  return {
    x: Math.floor(Math.random() * MAPCOLS) + 1,
    y: Math.floor(Math.random() * MAPROWS) + 1
  };
}

function drawMaze(){
  let x = 4;
  let y = 1;
  y += 2;
  while(x < MAPCOLS - 1){
    y = goDown(x, y);
    x = goRight(x, y);
    y = goUp(x, y);
    x = goRight(x, y);
  }
  for(let i = 2; i < 9; i++){
    if(i != 6 && i != 7){
      let tile = getRandomTile();
      while(readCell(tile.y, tile.x))
        tile = getRandomTile();
      writeCell(i, tile.y, tile.x);
    }
  }
}

setupMapBorder();
drawMaze();

 
var playerItems = new Uint8Array(7);

var touched = 0;
var hasMoved = false;

var dirFace;
var dayTime;

var curEnemy;
var inBattle = false;
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

function drawMiniMap(){
  let mapLoc = 103;
  clr(BLACK, 1);
  g.fillRect(mapLoc,0,SCREENWIDTH,40);
  clr(WHITE,1);
  for ( let y = 0; y < MAPROWS; y++){
    for (let x = 0; x < MAPCOLS; x++){
      if(Math.floor(player.x) == x && Math.floor(player.y) == y){
        clr(GREEN, 1);
        g.fillRect(mapLoc+ x*4,y*4,mapLoc+x*4+4,y*4+4);
        clr(WHITE, 1);
      }
      if(readCell(y,x) == 1) g.fillRect(mapLoc+ x*4,y*4,mapLoc+x*4+4,y*4+4);
    }
  }
}

function castRay(rayAngle) {
  let x = player.x;
  let y = player.y;
  let dx = Math.cos(rayAngle);
  let dy = Math.sin(rayAngle);
  let tile = 0;
  let i = 0;
  let spriteDistance;
  while (readCell(Math.floor(y), Math.floor(x)) != 1 && readCell(Math.floor(y), Math.floor(x)) < 7) {
    x += dx * 0.1;
    y += dy * 0.1;
    i++;
    if (i > 32) break;
    if(readCell(Math.floor(y), Math.floor(x)) > 1 && !tile){
      tile = readCell(Math.floor(y), Math.floor(x));
      spriteDistance = Math.sqrt(Math.pow(x - player.x ,2)+ Math.pow(y - player.y, 2));
    }
  }
  let distance = Math.sqrt(Math.pow(x - player.x ,2)+ Math.pow(y - player.y, 2));
  let wallHeight = SCREENWIDTH / 2 / distance;
  if(wallHeight > SCREENWIDTH) wallHeight = SCREENWIDTH;
  if(!tile) tile = 0;
  if(!spriteDistance) spriteDistance = distance;
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
  else clr(RED, 1); 
  if(tile == 7) clr(YELLOW, 1); 
  let yPosition = Math.floor(SCREENWIDTH / 2 - wallHeight / 2);
  g.fillRect(i * sliceWidth, yPosition, i* sliceWidth + sliceWidth, yPosition + wallHeight);
}

function drawMsgBlock(msg, msg2){
  const FONTWIDTH = 6;
  let center = (Math.floor(SCREENWIDTH / 2 - msg.length / 2 * FONTWIDTH)); 
  clr(BLACK, 1);
  g.fillRect(8,48,SCREENWIDTH-8,96);
  clr(WHITE, 1);
  g.drawString(msg,center, 64);
  if(msg2){
    center = (Math.floor(SCREENWIDTH / 2 - msg2.length / 2 * FONTWIDTH)); 
    g.drawString(msg2,center, 80);
  }
}

function drawSprite(spriteXpos, spriteId, sDistance){
  if(spriteId < DOOR || spriteId > DOOR){
    if(spriteId > DOOR){
      let newSpriteId;
      if(!playerItems[BLESS]){
        if(sDistance == 12) drawMsgBlock("You need the blessing!");
        newSpriteId = ALTER1;
      }
      else{
        if(sDistance == 12){
          playerItems[BLESS]--;
          newSpriteId = ALTER2;
          drawEverything();
          drawMsgBlock("You have placed the blessing","on the altar!");
          for(let y = 0; y < MAPROWS; y++)
            for(let x = 0; x < MAPCOLS; x++)
              if(readCell(y,x) == ALTER1) writeCell(ALTER2, y, x);
          gameWon = true;
        }
      }
      g.drawImage(SPRITES[newSpriteId+4],spriteXpos, 100, {scale: sDistance});
  }
    else{
      g.drawImage(SPRITES[spriteId-2],spriteXpos, 100, {scale: sDistance});
      if(sDistance == 12){
        drawMsgBlock("The "+ENEMY[spriteId-2][0]+" attacks you!");
        inBattle = true;
        battleState = 1;
        curEnemy = spriteId;
      }
    }
  }
  else if(sDistance == 12){
    if(!playerItems[0]) drawMsgBlock("You need a key!");
    else{
      playerItems[0]--;
      drawEverything();
      drawMsgBlock("You use the key", "and the door opens!");
      for(let y = 0; y < MAPROWS; y++)
        for(let x = 0; x < MAPCOLS; x++)
          if(readCell(y, x) == DOOR) writeCell(0, y, x);
    }
  }
}

function drawClouds(){
  for (let row = 0; row < 64; row = row + 16){
    for (let col = 0; col < SCREENWIDTH; col = col + 16){
      if(Math.random() < 0.1) g.fillRect(col, row, col+16, row+8);
    }
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

function drawSky(){
  if(dayTime == DAY){
      clr(CYAN, 0);
      if(compass && dirFace == S){
        clr(YELLOW, 1);
        g.fillCircle(88,16,12);
      }
      clr(WHITE, 1);
  }
  else if(dayTime == DAWN){
    clr(RED, 0);
    clr(WHITE, 1);
  }
  else{
    clr(BLACK, 0);
    if(compass && dirFace == S){
      clr(CYAN, 1);
      g.fillCircle(88,16,12);
    }
    clr(BLUE, 1);
  }
  if(clouds) drawClouds();
}

function drawGround(){
  clr(BLACK, 1);
  g.fillRect(0,96,SCREENWIDTH,SCREENWIDTH);
  if(grass) drawGrass();
}

function drawInventory(){
  let x = 40;
  for(let i = 0; i < playerItems.length; i++){
    if(playerItems[i]){
      if(i == 0) g.drawImage(SPRITES[playerItems[i]+10], x, SCREENWIDTH - 18, {scale: 2});
      else g.drawImage(SPRITES[playerItems[i]+4], x, SCREENWIDTH - 18, {scale: 2});
      x += 18;
    }
  }
}


function drawOverlay(){
  if(minimap) drawMiniMap();
  if(compass){
    const DIRS = ['E','S','W','N'];
    clr(BLACK, 1);
    g.fillRect(0,0,15,13);
    clr(WHITE, 1);
    if(dirFace == SE) g.drawString(DIRS[1]+DIRS[0],0,1);
    else if(dirFace == SW) g.drawString(DIRS[1]+DIRS[2],0,1);
    else if(dirFace == NW) g.drawString(DIRS[3]+DIRS[2],0,1);
    else if(dirFace == NE) g.drawString(DIRS[3]+DIRS[0],0,1);
    else g.drawString(DIRS[dirFace/2],0,1);
  }
  if(inventory) drawInventory();
}

function drawEverything() {
  g.clear();
  drawSky();
  drawGround();
  const RAYS = 11;
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
    if(ret.s > 6) ret.s = 1;
    else if(ret.s > 3) ret.s = 2;
    else if(ret.s > 1) ret.s = 5;
    else if(ret.s > 0.8) ret.s = 8;
    else if(ret.s > 0.0) ret.s = 12;
    else ret.s = 1;
    drawSprite(spriteLoc, spriteDraw, ret.s);
  }
  drawOverlay();
}

function wallCollisionCheck() {
  const floorX = Math.floor(player.x);
  const floorY = Math.floor(player.y);
  if (floorX < 0 || floorX >= MAPCOLS || floorY < 0 || floorY >= MAPROWS) return true;
  return readCell(floorY, floorX) !== 0;
}

function setDayTime(){
  let nowTime = Date();
  curHour = nowTime.getHours();
  if((curHour > 5 && curHour < 8) || (curHour > 20 && curHour < 21)) dayTime = DAWN;
  else if(curHour > 7 && curHour < 21) dayTime = DAY;
  else dayTime = NIGHT;
  
  if(compass){
    dirFace = E;
    if(player.angle > 5.6 && player.angle < 0.6){
      player.angle = 0.0;
      dirFace = E;
    }
    else if(player.angle > 0.5 && player.angle < 1.3){
      player.angle = 0.785;
      dirFace = SE;
    }
      else if(player.angle > 1.29 && player.angle < 1.9){
      dirFace = S;
      player.angle= 1.57;
    }
      else if(player.angle > 1.8 && player.angle < 2.7){
      dirFace = SW;
      player.angle = 2.335;
    }
      else if(player.angle > 2.6 && player.angle < 3.5){
      dirFace = W;
      player.angle = 3.14;
    }
      else if(player.angle > 3.6 && player.angle < 4.2){
      dirFace = NW;
      player.angle = 3.925;
    }
    else if(player.angle > 4.1 && player.angle < 5.1){
      dirFace = N;
      player.angle = 4.71;
    }
    else if(player.angle > 5.0 && player.angle < 5.7){
      dirFace = NE;
      player.angle = 5.495;
    }
  }
}

function doBattle(){
  const ITEMS = [ "Key", "Knife", "Derringer", "Poison", "Bomb", "Potion", "Blessing" ];
  if(battleState == 1){
    let enemyRoll = Math.floor(Math.random()*(curEnemy + ENEMY[curEnemy -2][1] / 10 + 1));
    drawMsgBlock("The "+ENEMY[curEnemy-2][0]+" hits you for "+enemyRoll+"!");
    player.hp -= enemyRoll;
    if(player.hp < 1) drawMsgBlock("You were killed!");
    battleState++;
  }
  else if(battleState == 2){
    if(player.hp < 1) load();
    if(playerItems[5] && player.hp < 75){
      let addHp = playerItems[5] * 5;
      playerItems[5] = 0;
      drawEverything();
      drawMsgBlock("You drink "+ITEMS[5], " and gain "+addHp+" hp!");
      player.hp += addHp;
    }
    else{
      if(playerItems[3] && player.hp < 50){
        let hit = playerItems[3]*5;
        playerItems[3] = 0;
        drawEverything();
        drawMsgBlock("You use the "+ITEMS[3], " and hit for "+hit+"!");
        ENEMY[curEnemy-2][1] -= hit;
      }
      else if(playerItems[4] && player.hp < 50){
        let hit = playerItems[4]*6;
        playerItems[4] = 0;
        drawEverything();
        drawMsgBlock("You use the "+ITEMS[4], "and hit for "+hit+"!");
        ENEMY[curEnemy-2][1] -= hit;
      }
      else {
        let weapons = playerItems[1]*2 + playerItems[2]*3;
        let playerRoll = Math.floor(Math.random() * player.hp / 10) + weapons;
        ENEMY[curEnemy-2][1] -= playerRoll;
        drawMsgBlock("You hit for "+playerRoll);
      }
    }
    if(ENEMY[curEnemy-2][1] < 1) battleState++; 
    else battleState--;
  }
  else if(battleState == 3){
    drawMsgBlock("You killed the "+ENEMY[curEnemy-2][0]);
    for(let y = 0; y < MAPROWS; y++)
      for(let x = 0; x < MAPCOLS; x++)
        if(readCell(y,x) == curEnemy)
          writeCell(0,y,x);
    battleState++;
  }
  else if(battleState == 4){
    let itemRoll = Math.floor(Math.random() * curEnemy + 2);
    if(curEnemy == WITCH){
      const KEYMSG = "You got the Key!";
      let msg2;
      playerItems[0]++;
      if(itemRoll && !playerItems[itemRoll]){
        if(itemRoll == BLESS) itemRoll--;
        msg2 = "and a "+ITEMS[itemRoll]+"!";
        playerItems[itemRoll] = itemRoll;
      }
      else{
        msg2 = "and lost your "+ITEMS[itemRoll]+"!";
        playerItems[itemRoll] --;
      }
      drawEverything();
      drawMsgBlock(KEYMSG, msg2);
    }
    else if(curEnemy == DEVIL){
      const bMsg2 = "You received the blessing!";
      let msg;
      playerItems[BLESS] = BLESS;
      if(itemRoll && !playerItems[itemRoll]){
        msg = "and a "+ITEMS[itemRoll]+"!";
        playerItems[itemRoll] = itemRoll;
      }
      drawEverything();
      drawMsgBlock(bMsg2, msg);
    }
    else if(itemRoll && !playerItems[itemRoll]){
      playerItems[itemRoll] = itemRoll;
      drawEverything();
      drawMsgBlock("You got a "+ITEMS[itemRoll]+"!");
    }
    battleState++;
  }
  else{
    drawMsgBlock("Tap to continue...");
    inBattle = false;
    battleState = 0;
    curEnemy = 0;
  }
}

function handleInput() {
  if(!inBattle){
    const speed = 0.5;
    const angularSpeed = 0.785;
    const oldX = player.x;
    const oldY = player.y;
    hasMoved = true;
    if (touched == 1) {
      player.x += Math.cos(player.angle) * speed;
      player.y += Math.sin(player.angle) * speed;
    }
    else if (touched == 2) {
      player.x -= Math.cos(player.angle) * speed;
      player.y -= Math.sin(player.angle) * speed;
    }
    else if (touched == 3) player.angle -= angularSpeed;
    else if (touched == 4) player.angle += angularSpeed;
    if (player.angle < 0) player.angle += 2 * Math.PI;
    if (player.angle >= 2 * Math.PI) player.angle -= 2 * Math.PI;
    if (wallCollisionCheck()) {
      player.x = oldX;
      player.y = oldY;
      hasMoved = false;
    }
  }
  else{
    doBattle();
    hasMoved = false;
  }
  touched = 0;
}

function endGame(){
  if(endState == 0) drawEverything(); 
  else if(endState == 1) drawMsgBlock("Congratulations on beating", "THE CURSED MAZE!"); 
  else if(endState == 2) drawMsgBlock("You are a valiant warrior."); 
  else if(endState == 3) drawMsgBlock("This game was created by:", "g0730n"); 
  else if(endState == 4) drawMsgBlock("Licensed under the", "MIT License"); 
  else if(endState == 5) drawMsgBlock("There may be a second", "level in the future."); 
  else if(endState == 6) drawMsgBlock("Have a great day!"); 
  else if(endState == 7) drawMsgBlock("Tap to Exit...");
  else load();
  endState++;
}

function gameMove() {
  if(!gameWon){
    setDayTime();
    handleInput();
    if(!inBattle && hasMoved) drawEverything(); 
  }
  else endGame(); 
}

function intro(){
  g.setFont6x15();
  g.clear();
  setDayTime();
  drawEverything();
  drawMsgBlock("THE CURSED MAZE","Tap to Play...");
}

Bangle.setLCDTimeout(0);

Bangle.on('touch', function(button, xy) {
  if(xy.y < 40) touched = 1;
  if(xy.y > 136) touched = 2;
  if(xy.x < 40) touched = 3;
  if(xy.x > 136) touched = 4;
  gameMove();
});

intro();