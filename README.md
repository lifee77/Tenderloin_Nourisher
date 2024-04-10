# Tenderloin_Nourisher
It is a Top Down Shooter game made with Javascript.

# Tenderloin_Nourisher.js Documentation

## Overview
This JavaScript file contains the code for a game where a player can control a character to avoid enemies and score points. The game uses voice commands for character movement and also supports keyboard controls. The game ends when the player collides with an enemy or when the score reaches 10.

## Variables
The game uses a variety of variables to control the game state, player and enemy positions, sprite dimensions, voice commands, score, and more.

## Functions

### `preload()`
This function loads images, sounds, and the classifier for voice commands.

### `setup()`
This function initializes the game, creates the canvas and sprites, sets colliders for the player and enemies, initializes voice controls, and creates enemies.

### `loaded()`
This function plays the background music in a loop.

### `gotResults(error, results)`
This function handles voice commands. It moves the player according to the voice command received.

### `playerControls()`
This function handles player controls. It moves the player according to the key pressed.

### `playerRight()`, `playerLeft()`, `playerUp()`, `playerDown()`
These functions handle player movement in the respective directions.

### `enemyMovement()`
This function handles enemy movement. It sets the speed and direction of the enemy and moves the ghost towards the player.

### `collisions()`
This function handles collisions between the player, enemies, and projectiles.

### `destroyOther(destroyed, projectile)`
This function destroys an enemy when it collides with a projectile.

### `blastMusic()`
This function plays a blast sound.

### `gameOver()`
This function handles the game over state. It stops the game and the background music.

### `mousePressed()`
This function creates a projectile when the mouse is pressed.

### `createEnemy(x, y)`
This function creates an enemy at the given coordinates.

### `enemySpawn()`
This function handles the spawning of enemies.

### `textSetup()`
This function sets up the text properties.

### `draw()`
This function handles the game logic. It clears the screen, draws the background, handles player controls, draws sprites, handles collisions, enemy movement, and enemy spawning. It also handles the game win state.

## Controls
The game can be controlled using voice commands or keyboard keys. The voice commands are "right", "left", "up", and "down". The corresponding keyboard keys are the arrow keys or the keys 'D', 'A', 'S', and 'W'.
