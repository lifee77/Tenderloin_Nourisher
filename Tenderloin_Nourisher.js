// Define game variables
let canvasWidth = 640;
let canvasHeight = 480;

// Player variables
let player;
let playerX = 300;
let playerY = 100;
let speed = 4;
let fr = 30;

// Sprite dimensions
let spriteWidth = 64;
let spriteHeight = 64;

// Enemy variables
let enemy;
let enemyX = 300;
let enemyY = 300;

// Ghost variables
let ghost;
let ghostX = 500;
let ghostY = 200;

// Collider dimensions
let colliderWidth = 40;
let colliderHeight = 40;

// Enemy movement variables
let direction = 90; 
let enemyRadius = 300;

// Voice command variables
let classifier;
let label;
let confidence;
let voiceControls = true; 
let voiceSpeed = 30;
let keySpeed = 4;

// Score variable
let score = 0;

// Sound variables
let song;
let blast;

// Game scene variables
let gameScene = false; 
let sceneColor;
let sceneText;

// Preload function to load images, sounds and classifier
function preload() {
  // Load images
  playerImg = loadSpriteSheet("images/playerAni.png", spriteWidth, spriteHeight, 4);
  walkAnimation = loadAnimation(playerImg);
  enemyImg = loadImage("images/enemy.png");
  projectileImg = loadImage("images/projectile.png")
  ghostImg = loadImage("images/ghost.png")
  bgImg = loadImage("images/background.png");

  // Load classifier
  let options =  { probabilityThreshold: 0.95 }; 
  classifier = ml5.soundClassifier('SpeechCommands18w', options);

  // Load sounds
  song = loadSound("music/warm.mp3", loaded); 
  blast = loadSound ("music/blast.mp3");
}

// Setup function to initialize game
function setup() {
  // Create canvas and sprites
  createCanvas(canvasWidth, canvasHeight);
  player = createSprite(playerX, playerY);
  player.addAnimation('walk', walkAnimation);
  enemy = createSprite(enemyX, enemyY);
  enemy.addImage(enemyImg);
  ghost = createSprite(ghostX, ghostY);
  ghost.addImage(ghostImg);
  frameRate(fr);
  
  // Create groups for enemies and projectiles
  enemies = new Group();
  enemies.add(enemy);
  enemies.add(ghost);
  projectiles = new Group();

  // Set colliders for player, enemy and ghost
  player.setCollider ("rectangle", 0, 0, colliderWidth, colliderHeight);
  enemy.setCollider ("rectangle", 0, 0, colliderWidth, colliderHeight);
  ghost.setCollider ("rectangle", 0, 0, colliderWidth, colliderHeight);

  // Initialize voice controls
  if (voiceControls == true){
    classifier.classify(gotResults);
  }

  // Create enemies
  for (let i = 0; i < 8; i++) {
    let angle = random(360);
    let posX = canvasWidth/2 * angle;
    let posY = canvasHeight/2 * angle;
    createEnemy(posX, posY);
  } 
}

// Function to play the song
function loaded(){
  song.play();
  song.loop();
}

// Function to handle voice commands
function gotResults (error, results){
  // Handle error
  if (error){
    console.log(error)
  }

  // Handle voice commands
  speed = voiceSpeed;
  if (results[0].label == "right") {
    playerRight();
  }
  if (results[0].label == "left") {
    playerLeft();
  }
  if (results[0].label == "up") {
    playerUp();
  }  
  if (results[0].label == "down") {
    playerDown();
  }
  speed = keySpeed
  console.log(results[0].label);
  playerControls(results[0].label);
}

// Function to handle player controls
function playerControls() {
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { // D
    playerRight();
  }
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { // A
    playerLeft();
  }
  if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) { // S
    playerDown();
  }
  if (keyIsDown(UP_ARROW) || keyIsDown(87)) { // W
    playerUp();
  }
}

// Functions to handle player movement
function playerRight(){
  player.position.x += speed;
  if (player.position.x + spriteWidth/2 > canvasWidth) {
    player.position.x = canvasWidth - spriteWidth/2;
  }
}

function playerLeft(){
  player.position.x -= speed;
  if (player.position.x < 0 + spriteWidth/2) {
    player.position.x = 0 + spriteWidth/2;
  }
}

function playerUp(){
  player.position.y -= speed;
  if (player.position.y < 0 + spriteHeight/2) {
    player.position.y = 0 + spriteHeight/2;
  }
}

function playerDown(){
  player.position.y += speed;
  if (player.position.y + spriteHeight/2 > canvasHeight) {
    player.position.y = canvasHeight - spriteHeight/2;
  }
}

// Function to handle enemy movement
function enemyMovement(){
  direction +=2;
  enemy.setSpeed(3,direction);

  // Move the ghost towards the player
  if(player.position.x > ghost.position.x - enemyRadius &&
    player.position.x < ghost.position.x + enemyRadius &&
    player.position.y > ghost.position.y - enemyRadius &&
    player.position.y < ghost.position.y + enemyRadius){
     ghost.attractionPoint(0.2,player.position.x, player.position.y);
  } else{
    ghost.velocity.x = 0
    ghost.velocity.y = 0
  }
  ghost.maxSpeed = 2;
}

// Function to handle collisions
function collisions(){
  enemies.overlap(projectiles, destroyOther, blastMusic);
  player.collide(enemies, gameOver);
}

// Function to destroy enemy
function destroyOther(destroyed, projectile){
  destroyed.remove();
  projectiles.remove(projectile);
  score += 1
}

// Function to play blast sound
function blastMusic(){
  blast.play();
}

// Function to handle game over
function gameOver(){
  gameScene = true;
  sceneColor = "red";
  console.log("GAME OVER!!");
  console.log("Final Score: "+ score);
  sceneText = "GAME OVER!!" + "\n" + "Final Score: "+ score;
  song.stop()
}

// Function to handle mouse press
function mousePressed(){
  let projectile = createSprite(player.position.x, player.position.y);
  projectile.addImage(projectileImg);
  projectile.attractionPoint(10+speed, mouseX, mouseY);
  projectiles.add(projectile);
  projectile.setCollider ("rectangle", 0, 0, colliderWidth, colliderHeight);
}

// Function to create enemy
function createEnemy (x,y){
  let newEnemy = createSprite(x,y);
  let enemyImg = loadImage("images/monster.png");
  newEnemy.addImage(enemyImg);
  newEnemy.setSpeed(2.5, random(360));
  newEnemy.setCollider("rectangle", 0, 0, colliderHeight, colliderWidth);
  enemies.add(newEnemy); 
}

// Function to spawn enemy
function enemySpawn(){
  for (let i = 0; i < enemies.length; i++) {
    let spawn = enemies[i];
    if (spawn.position.x < - colliderWidth) {
        spawn.position.x = canvasWidth + colliderWidth; 
 }
    if (spawn.position.x > canvasWidth + colliderWidth) {
      spawn.position.x = - colliderWidth; 
 }
    if (spawn.position.y < - colliderWidth) { 
        spawn.position.y = canvasHeight + colliderHeight; 
 }
    if (spawn.position.y > canvasHeight + colliderHeight) { 
        spawn.position.y = - colliderHeight;
 } 
  } 
}

// Function to setup text
function textSetup(){
  fill("white");
  textAlign(CENTER);
  textSize(60);
  stroke("black");
  strokeWeight(1);
}

// Draw function to handle game logic
function draw() {
  if (gameScene == false){
    clear();
    background(bgImg);
    playerControls();
    drawSprites();
    collisions();
    enemyMovement();
    enemySpawn();
    if (score >= 10){
      gameScene = true;
      console.log("You win! Final score: "+ score);
      sceneColor = "green";
      sceneText = "You win!!" + "\n" + "Final Score: "+ score;
      song.stop()
    }
  }else{
    textSetup();
    background(sceneColor);
    text(sceneText, 0, 150, canvasWidth, canvasHeight); 
  }
}