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

const sprites =[
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

const enemy = [
  ["Rat", 12],
  ["Blob", 16],
  ["Orc", 32],
  ["Witch", 64],
  ["Devil", 100]
];

const colors = [
  0x000000,
  0xFFFFFF,
  0xFFF000,
  0x0F0F00,
  0x0000FF,
  0x000FFF,
  0xF0F0FF,
  0xFFFF00,
];

var player = {
  x: 2,
  y: 2,
  angle: 1.5,
  fov: Math.PI / 4,
  hp: 100,
};

var items = [
  "Key",
  "Knife",
  "Derringer",
  "Poison",
  "Bomb",
  "Potion",
  "Blessing"
];

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
 
var playerItems = new Uint8Array(7);

var wallHeight;
const rays = 11;
const screenWidth = 176;
const fontWidth = 6;
const sliceWidth = screenWidth / rays;
const angleStep = player.fov / rays;

var touched = 0;
var hasMoved = false;

var dirFace = 'E';
var dayTime;

var enemyDistance;
var curEnemy;
var inBattle = false;
var battleState = 0;
var endState = 0;
var gameWon = false;

var colorwheel = BLACK;

function clr(colorId, pos){
  let newColor = colors[colorId];
  if(pos) g.setColor(newColor);
  else g.setBgColor(newColor);
}

function colorWheel(start){
  if(colorwheel > YELLOW) colorwheel = start;
  clr(colorwheel, 1);
  colorwheel++;
}

function drawMiniMap(){
  let mapLoc = 103;
  clr(BLACK, 1);
  g.fillRect(mapLoc,0,screenWidth,40);
  let cols = map[0].length;
  let rows = map.length;
  clr(WHITE,1);
  for ( let y = 0; y < rows; y++){
    for (let x = 0; x < cols; x++){
      if(Math.floor(player.x) == x && Math.floor(player.y) == y){
        clr(GREEN, 1);
        g.fillRect(mapLoc+ x*4,y*4,mapLoc+x*4+4,y*4+4);
        clr(WHITE, 1);
      }
      if(map[y][x] == 1) g.fillRect(mapLoc+ x*4,y*4,mapLoc+x*4+4,y*4+4);
    }
  }
}

function castRay(rayAngle) {
  let x = player.x;
  let y = player.y;
  let dx = Math.cos(rayAngle);
  let dy = Math.sin(rayAngle);
  let tile;
  let i = 0;
  while (map[Math.floor(y)][Math.floor(x)] != 1 && map[Math.floor(y)][Math.floor(x)] < 7) {
    x += dx * 0.1;
    y += dy * 0.1;
    i++;
    if (i > 32) break;
    if(map[Math.floor(y)][Math.floor(x)] > 1){
      tile = map[Math.floor(y)][Math.floor(x)];
      enemyDistance = Math.sqrt(Math.pow(x - player.x ,2)+ Math.pow(y - player.y, 2));
    }
  }
  let distance = Math.sqrt(Math.pow(x - player.x ,2)+ Math.pow(y - player.y, 2));
  wallHeight = screenWidth / 2 / distance;
  if(wallHeight > screenWidth) wallHeight = screenWidth;
  return tile;
}

function drawWallSlice(i, wallHeight, sliceWidth, tile) {
  if(wallHeight < 20) clr(BLACK, 1);
  else if(wallHeight < 30) clr(BLUE, 1);
  else if(wallHeight < 40) clr(MAGENTA, 1);
  else clr(RED, 1); 
  if(tile == 7) clr(YELLOW, 1); 
  let yPosition = Math.floor(screenWidth / 2 - wallHeight / 2);
  g.fillRect(i * sliceWidth, yPosition, i* sliceWidth + sliceWidth, yPosition + wallHeight);
}

function drawMsgBlock(msg, msg2){
  let center = (Math.floor(screenWidth / 2 - msg.length / 2 * fontWidth)); 
  clr(BLACK, 1);
  g.fillRect(8,48,screenWidth-8,96);
  clr(WHITE, 1);
  g.drawString(msg,center, 64);
  if(msg2){
    center = (Math.floor(screenWidth / 2 - msg2.length / 2 * fontWidth)); 
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
          for(let y = 0; y < map.length; y++)
            for(let x = 0; x < map[0].length; x++)
              if(map[y][x] == ALTER1) map[y][x] = ALTER2;
          gameWon = true;
        }
      }
      g.drawImage(sprites[newSpriteId+4],spriteXpos, 100, {scale: sDistance});
  }
    else{
      g.drawImage(sprites[spriteId-2],spriteXpos, 100, {scale: sDistance});
      if(sDistance == 12){
        drawMsgBlock("The "+enemy[spriteId-2][0]+" attacks you!");
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
      for(let y = 0; y < map.length; y++)
        for(let x = 0; x < map[0].length; x++)
          if(map[y][x] == DOOR) map[y][x] = 0;
    }
  }
}

function drawSky(){
  if(dayTime == "day"){
      clr(CYAN, 0);
      if(dirFace == 'S'){
        clr(YELLOW, 1);
        g.fillCircle(88,16,12);
      }
      clr(WHITE, 1);
  }
  else if(dayTime == "dawn"){
    clr(RED, 0);
    clr(WHITE, 1);
  }
  else{
    clr(BLACK, 0);
    if(dirFace == 'S'){
      clr(CYAN, 1);
      g.fillCircle(88,16,12);
    }
    clr(BLUE, 1);
    }
  }
  for (let row = 0; row < 64; row = row + 8){
    for (let col = 0; col < screenWidth; col = col + 8){
      if(Math.random() < 0.1){
        g.fillRect(col, row, col+16, row+8);
    }
  }
}

function drawGround(){
  clr(BLACK, 1);
  g.fillRect(0,96,screenWidth,screenWidth);
  clr(GREEN, 1);
  for (let row = 88; row < screenWidth; row = row + 8){
    for (let col = 0; col < screenWidth; col = col + 8){
      if(Math.random() < 0.1){
        g.fillRect(col, row, col+2, row+3);
      }
    }
  }
}

function drawInventory(){
  let x = 40;
  for(let i = 0; i < playerItems.length; i++){
    if(playerItems[i]){
      if(i == 0) g.drawImage(sprites[playerItems[i]+10], x, screenWidth - 18, {scale: 2});
      else g.drawImage(sprites[playerItems[i]+4], x, screenWidth - 18, {scale: 2});
      x += 18;
    }
  }
}


function drawOverlay(){
  drawMiniMap();
  clr(BLACK, 1);
  g.fillRect(0,0,15,13);
  clr(WHITE, 1);
  g.drawString(dirFace,0,1);
  drawInventory();
}

function drawEverything() {
  g.clear();
  drawSky();
  drawGround();
  let enemyDraw = 0;
  let enemyLoc = 0;
  for (let i = 0; i < rays; i++) {
    let rayAngle = player.angle - (player.fov / 2) + i * angleStep;
    let tile = castRay(rayAngle);
    if(tile > 1 && !enemyDraw){
      enemyDraw = tile;
      enemyLoc = i * sliceWidth;
    }
    drawWallSlice(i, wallHeight, sliceWidth, tile);
  }
  
  if(enemyDraw && !battleState){
    if(enemyDistance > 5) enemyDistance = 1;
    else if(enemyDistance > 2) enemyDistance = 3;
    else if(enemyDistance > 1) enemyDistance = 5;
    else if(enemyDistance > 0.8) enemyDistance = 8;
    else enemyDistance = 12;
    drawSprite(enemyLoc, enemyDraw, enemyDistance);
  }
  drawOverlay();
}

function wallCollisionCheck() {
  const floorX = Math.floor(player.x);
  const floorY = Math.floor(player.y);
  if (floorX < 0 || floorX >= map[0].length || floorY < 0 || floorY >= map.length) return true;
  return map[floorY][floorX] !== 0;
}

function setDayTime(){
  let nowTime = Date();
  curHour = nowTime.getHours();
  if((curHour > 5 && curHour < 8) || (curHour > 20 && curHour < 21)) dayTime = "dawn";
  else if(curHour > 7 && curHour < 21) dayTime = "day";
  else dayTime = "night";
  dirFace = 'E';
  if(player.angle > 5.6 && player.angle < 0.6){
    player.angle = 0.0;
    dirFace = 'E';
  }
  else if(player.angle > 0.5 && player.angle < 1.3){
    player.angle = 0.785;
    dirFace = 'SE';
  }
    else if(player.angle > 1.29 && player.angle < 1.9){
    dirFace = 'S';
    player.angle= 1.57;
  }
    else if(player.angle > 1.8 && player.angle < 2.7){
    dirFace = 'SW';
    player.angle = 2.335;
  }
    else if(player.angle > 2.6 && player.angle < 3.5){
    dirFace = 'W';
    player.angle = 3.14;
  }
    else if(player.angle > 3.6 && player.angle < 4.2){
    dirFace = 'NW';
    player.angle = 3.925;
  }
  else if(player.angle > 4.1 && player.angle < 5.1){
    dirFace = 'N';
    player.angle = 4.71;
  }
  else if(player.angle > 5.0 && player.angle < 5.7){
    dirFace = 'NE';
    player.angle = 5.495;
  }
}

function doBattle(){
  if(battleState == 1){
    let enemyRoll = Math.floor(Math.random()*(curEnemy + enemy[curEnemy -2][1] / 10 + 1));
    drawMsgBlock("The "+enemy[curEnemy-2][0]+" hits you for "+enemyRoll+"!");
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
      drawMsgBlock("You drink "+items[5], " and gain "+addHp+" hp!");
      player.hp += addHp;
    }
    else{
      if(playerItems[3] && player.hp < 50){
        let hit = playerItems[3]*5;
        playerItems[3] = 0;
        drawEverything();
        drawMsgBlock("You use the "+items[3], " and hit for "+hit+"!");
        enemy[curEnemy-2][1] -= hit;
      }
      else if(playerItems[4] && player.hp < 50){
        let hit = playerItems[4]*6;
        playerItems[4] = 0;
        drawEverything();
        drawMsgBlock("You use the "+items[4], "and hit for "+hit+"!");
        enemy[curEnemy-2][1] -= hit;
      }
      else {
        let weapons = playerItems[1]*2 + playerItems[2]*3;
        let playerRoll = Math.floor(Math.random() * player.hp / 10) + weapons;
        enemy[curEnemy-2][1] -= playerRoll;
        drawMsgBlock("You hit the "+enemy[curEnemy-2][0], " for "+playerRoll+"!");
      }
    }
    if(enemy[curEnemy-2][1] < 1) battleState++; 
    else battleState--;
  }
  else if(battleState == 3){
    drawMsgBlock("You killed the "+enemy[curEnemy-2][0]+"!");
    for(let y = 0; y < map.length; y++)
      for(let x = 0; x < map[0].length; x++)
        if(map[y][x] == curEnemy)
          map[y][x] = 0;
    battleState++;
  }
  else if(battleState == 4){
    let itemRoll = Math.floor(Math.random() * curEnemy + 2);
    if(curEnemy == WITCH){
      let msg1 = "You got the Key!";
      let msg2;
      playerItems[0]++;
      if(itemRoll && !playerItems[itemRoll]){
        msg2 = "and a "+items[itemRoll]+"!";
        playerItems[itemRoll] = itemRoll;
      }
      else{
        msg2 = "and lost your "+items[itemRoll]+"!";
        playerItems[itemRoll] --;
      }
      drawEverything();
      drawMsgBlock(msg1, msg2);
    }
    else if(curEnemy == DEVIL){
      let msg1 = "You received the blessing!";
      let msg2;
      playerItems[BLESS] = BLESS;
      if(itemRoll && !playerItems[itemRoll]){
        msg2 = "and a "+items[itemRoll]+"!";
        playerItems[itemRoll] = itemRoll;
      }
      drawEverything();
      drawMsgBlock(msg1, msg2);
    }
    else if(itemRoll && !playerItems[itemRoll]){
      playerItems[itemRoll] = itemRoll;
      drawEverything();
      drawMsgBlock("You got a "+items[itemRoll]+"!");
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
    if (touched == 2) {
      player.x -= Math.cos(player.angle) * speed;
      player.y -= Math.sin(player.angle) * speed;
    }
    if (touched == 3) player.angle -= angularSpeed;
    if (touched == 4) player.angle += angularSpeed;
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
  setDayTime();
  drawSky();
  g.setFont6x15();
  g.clear();
  let row = 0;
  let col = 0;
  for(let i = 0; i < 131; i++){
    colorWheel(BLACK);
    g.fillRect(col*16, row*16,col*16+16,row*16+16);
    col++;
    if(col > 11){
      row++;
      col = 0;
    } 
  }
  drawMsgBlock("THE CURSED MAZE","Tap to Play...");
}

Bangle.setOptions({backlightTimeout: 30000});

Bangle.on('touch', function(button, xy) {
  if(xy.y < 50) touched = 1;
  if(xy.y > 128) touched = 2;
  if(xy.x < 50) touched = 3;
  if(xy.x > 128) touched = 4;
  gameMove();
});

intro();
