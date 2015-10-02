// Make the game canvas
var canvas = document.getElementById("GameCanvas");
var context = canvas.getContext("2d");

// Make sure texture scaling doesn't use anti-aliasing (make sure the graphics use pixels)
context.mozImageSmoothingEnabled = false;
context.imageSmoothingEnabled = false;

var gameState = 0;

// Button stuff
var inversion = new Image();
inversion.src = "images/misc/inversion.png";

//unselected
var quit_us = document.createElement("img");
quit_us.src = "images/misc/quit.png";

var start_us = document.createElement("img");
start_us.src = "images/misc/start.png";

//draws images
function startMenuButtons()
{	
	context.drawImage(inversion, 540, 200, 508, 124);
    context.drawImage(start_us, 700, 340, 200, 50);
    context.drawImage(quit_us, 700, 400, 200, 50);
}

// Make the main game variables
var keyboard = new Keyboard();
var sound = new Sound();
var world = new World(48, 48);
var player = new Player(world.levelOrigins[world.currentLevel], world.levelOrigins[world.currentLevel + 1]);
var effects = [];

// Set up frame counting (FPS)
var frameCounter = 0;
var frames = 0;

// Camera variables
var cameraX = player.X;
var cameraY = player.Y;

var previousLeft = false;
var previousRight = false;

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

// Mouse
var mouse = new Mouse();

// Function: Main game loop
function run()
{
    // Every time the game draws a frame, increase the FPS by 1
    frameCounter++;
	
    // Clear the screen
    clear();
	
    if (gameState == 0)
    {
        // Menu
        /*
		example_button.update();
		example_button1.update();
		example_button.draw();
		example_button1.draw();
        */

		startMenuButtons();
    }
    else if (gameState == 1)
    {
        // Game

        if (!player.isDead)
        {
            // Update Logic
            // Update the world
            world.update();

            // Update the player with the keyboard
            player.update(world.XG,
                    world.YG,
                    keyboard.isKeyDown(keyboard.KEY_LEFT),
                    keyboard.isKeyDown(keyboard.KEY_RIGHT),
                    previousLeft, previousRight,
                    keyboard.isKeyDown(keyboard.KEY_SPACE));

            previousLeft = keyboard.isKeyDown(keyboard.KEY_LEFT);
            previousRight = keyboard.isKeyDown(keyboard.KEY_RIGHT);
        }
        else
        {
            window.setTimeout(respawn, 1000);
        }

        // Update effects
        for (var i = 0; i < effects.length; i++)
        {
            effects[i].update();
            if (effects[i].tileIndex / effects[i].tickTime > effects[i].tiles)
                effects.splice(i, 1);
        }

        // Drawing Logic
        // Move Camera
        cameraX += (player.X - cameraX) / 5;
        cameraY += (player.Y - cameraY) / 5;

        // Draw the world
        world.draw(displacementX, displacementY, cameraX, cameraY);

        // Draw effects
        for (var i = 0; i < effects.length; i++)
            effects[i].draw(displacementX, displacementY, cameraX, cameraY);

        if (!player.isDead)
        {
            // Draw the player
            player.draw(displacementX,
                    displacementY,
                    cameraX,
                    cameraY,
                    (player.X - cameraX) * 2,
                    (player.Y - cameraY) * 2,
                    keyboard.isKeyDown(keyboard.KEY_LEFT),
                    keyboard.isKeyDown(keyboard.KEY_RIGHT),
                    keyboard.isKeyDown(keyboard.KEY_SPACE));
        }

        // Draw the fail counter
        context.font = "55px Trebuchet MS";
        context.fillStyle = "#000";
        context.fillText(world.fails + " FAILS", 30, 850);
        context.fillStyle = "#FFF";
        context.fillText(world.fails + " FAILS", 35, 845)
    }
    else if (gameState == 2)
    {
        // Credits/You win
    }

    // Draw the FPS counter
	context.font = "12px Courier";
	context.fillStyle = "#FFF";
	context.fillText("Inversion - Alpha 0.5 - " + frames + " FPS - Alpaca Trousers", 10, 15);
	context.fillText("Cert II IDMT Project", 10, 30);
	context.fillText("Game State: " + gameState, 10, 45);

	// Make sure the next frame draws
	requestAnimationFrame(run);
}

function respawn()
{
    this.player = new Player(world.levelOrigins[2 * world.currentLevel], world.levelOrigins[(2 * world.currentLevel) + 1]);

    this.world.reset();
}

// Frame Counter (FPS)
setInterval(function()
{
	frames = frameCounter;
	//console.log(frameCounter + " fps");
	frameCounter = 0;
}, 1000);

// MAIN PROGRAM BELOW HERE

// Clear the screen
clear();

// Start running the game
requestAnimationFrame(run);
