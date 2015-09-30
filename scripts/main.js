// Make the game canvas
var canvas = document.getElementById("GameCanvas");
var context = canvas.getContext("2d");

// Make sure texture scaling doesn't use anti-aliasing (make sure the graphics use pixels)
context.mozImageSmoothingEnabled = false;
context.imageSmoothingEnabled = false;

// Make the main game variables
var keyboard = new Keyboard();
var player = new Player(256, 256);
var world = new World(48, 48);

// Set up frame counting (FPS)
var frameCounter = 0;
var frames = 0;

// Camera variables
var cameraX = player.X;
var cameraY = player.Y;

// More camera variables
var displacementX = (canvas.width / 2) - (player.width / 2);
var displacementY = (canvas.height / 2) - (player.height / 2);

// Function: Clear the screen
function clear()
{
	// Set the colour
	context.fillStyle = "#87CEFA";
	
	// Fill the screen with that colour
	context.fillRect(0, 0, canvas.width, canvas.height);
}

// Function: Main game loop
function run()
{
	// Every time the game draws a frame, increase the FPS by 1
	frameCounter++;
	
	// Clear the screen
	clear();
	
	// Update Logic
	// Update the world
	world.update();
		
	// Update the player with the keyboard
	player.update(world.XG,
			world.YG,
			keyboard.isKeyDown(keyboard.KEY_LEFT),
			keyboard.isKeyDown(keyboard.KEY_RIGHT),
			keyboard.isKeyDown(keyboard.KEY_SPACE),
			world.levels[world.currentLevel]);
	
	// Drawing Logic
	// Move Camera
	cameraX += (player.X - cameraX) / 5;
	cameraY += (player.Y - cameraY) / 5;
		
	// Draw the world
	world.draw(displacementX, displacementY, cameraX, cameraY);
	
	// Draw the player
	player.draw(displacementX,
			displacementY,
			cameraX,
			cameraY,
			(player.X - cameraX) * 2,
			(player.Y - cameraY) * 2,
			keyboard.isKeyDown(keyboard.KEY_LEFT),
			keyboard.isKeyDown(keyboard.KEY_RIGHT));

	// Draw the FPS counter
	context.fillStyle = "#111";
	context.font = "12px Courier";
	context.fillText(frames + " FPS", 10, 15);
	
	// Make sure the next frame draws
	requestAnimationFrame(run);
}

// Frame Counter (FPS)
setInterval(function()
{
	frames = frameCounter;
	console.log(frameCounter + " fps");
	frameCounter = 0;
}, 1000);

// MAIN PROGRAM BELOW HERE

// Clear the screen
clear();

// Start running the game
requestAnimationFrame(run);
