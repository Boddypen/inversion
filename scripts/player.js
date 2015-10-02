var Player = function(initialX, initialY)
{
	this.pi = 3.141592653;
	this.runningDisplacement = 0;
	this.flyTime = 0;

	this.isDead = false;

	// Load the player images
	this.playerImage = new Image();
	// Right standing images
	this.rightStandingImages = [];
	for(var i = 0; i < 2; i++)
	{
		this.rightStandingImages[i] = new Image();
		this.rightStandingImages[i].src = "images/player/r_s_" + i + ".png";
	}
	// Left standing images
	this.leftStandingImages = [];
	for(var i = 0; i < 2; i++)
	{
		this.leftStandingImages[i] = new Image();
		this.leftStandingImages[i].src = "images/player/l_s_" + i + ".png";
	}
	// Right running images
	this.rightRunningImages = [];
	for(var i = 0; i < 4; i++)
	{
		this.rightRunningImages[i] = new Image();
		this.rightRunningImages[i].src = "images/player/r_r_" + i + ".png";
	}
	// Left running images
	this.leftRunningImages = [];
	for(var i = 0; i < 4; i++)
	{
		this.leftRunningImages[i] = new Image();
		this.leftRunningImages[i].src = "images/player/l_r_" + i + ".png";
	}
	// Right fall image
	this.rightFallingImage = new Image();
	this.rightFallingImage.src = "images/player/r_f.png";
	// Left fall image
	this.leftFallingImage = new Image();
	this.leftFallingImage.src = "images/player/l_f.png";
	
    // Sound
	this.shouldPlayStepSound = true;

	// Set the floating variables
	falling = false;
	this.direction = 1;
	this.canChangeGravity = true;
	
	// Set the initial X and Y position
	this.X = initialX;
	this.Y = initialY;
	this.newX = this.X;
	this.newY = this.Y;
	this.oldX = initialX;
	this.oldY = initialY;

	// Set the size of the player
	this.width = 96;
	this.height = 96;
	
	// Set the initial velocities of the player
	this.XV = 0;
	this.YV = 0;
	
	// Set the initial rotation
	this.rotation = 0;
}

// Function: Update the player's position, velocity, etc.
Player.prototype.update = function(XG, YG, left, right, previousLeft, previousRight, space)
{
	// Collision detection
	// Find out what tiles the player occupies
	var tx = Math.floor(this.X);
	var ty = Math.floor(this.Y);
	var nx = Math.floor(this.X) % world.tileWidth;
	var ny = Math.floor(this.Y) % world.tileHeight;
	var cell = world.levels[world.currentLevel][Math.floor(tx / world.tileWidth)][Math.floor(ty / world.tileHeight)];
	var cellRight = world.levels[world.currentLevel][Math.floor(tx / world.tileWidth) + 1][Math.floor(ty / world.tileHeight)];
	var cellDown = world.levels[world.currentLevel][Math.floor(tx / world.tileWidth)][Math.floor(ty / world.tileHeight) + 1];
	var cellDiag = world.levels[world.currentLevel][Math.floor(tx / world.tileWidth) + 1][Math.floor(ty / world.tileHeight) + 1];

    // Calculate direction, for collision purposes
	var wasLeft = false;
	var wasRight = false;
	var wasUp = false;
	var wasDown = false;
	if (this.XV < 0) wasLeft = true;
	if (this.XV > 0) wasRight = true;
	if (this.YV < 0) wasUp = true;
	if (this.YV > 0) wasDown = true;

    // Death Logic
	this.isDead = ((wasDown && (cellDown == 3 || cellDiag == 3))
        || (wasUp && (cell == 4 || cellRight == 4) && this.YV < -2)
        || (wasLeft && (cell == 5 || cellDown == 5))
        || (wasRight && (cellRight == 6 || cellDiag == 6)))

	if (this.isDead)
	{
	    world.fails++;

	    sound.deathSound.play();

	    if (Math.floor(Math.random() * 3) == 0)
	        sound.screamSound.play();

	    effects.splice(effects.length - 1, new Effect("images/spritesheets/explosion.png", this.X + (this.width / 2), this.Y + (this.height / 2), 0.0, 0.0, 1.0, 16, 16, 16, 0, 2, 0.0, 0.0));

	    return;
	}

	cell = cell > 0;
	cellRight = cellRight > 0;
	cellDown = cellDown > 0;
	cellDiag = cellDiag > 0;
	
	// Figure out the new position and velocity
	this.X += this.XV;
	this.Y += this.YV;

	this.newX = this.X;
	this.newY = this.Y;

	if (this.X < 0) this.X = 0;
	if (this.Y < 0) this.Y = 0;

	console.log("Top Left: " + cell + "\nTop Right: " + cellRight + "\nBottom Left: " + cellDown + "\nBottom Right: " + cellDiag + "\n" + wasUp + " " + wasDown + " " + wasLeft + " " + wasRight + "\n" + this.X + ", " + this.Y + " - " + this.XV + ", " + this.YV);
	//console.log(world.YG);

	if ((wasLeft && (this.XV > 0)) || (wasRight && (this.XV < 0)))
		this.XV = 0;

	if (!cell && !cellRight && !cellDown && !cellRight)
	    falling = true;
	else
	    falling = false;

	if (wasDown)
	{
		if((cellDown && !cell) || (cellDiag && !cellRight && nx))
		{
			if (cellDown || cellDiag)
				this.newY = this.tileToPixel(ty);
			this.Y = Math.floor(ty);
			this.YV = 0;

			//cell = cellDown;
			//cellRight = cellDiag;

			ny = 0;
		}
	}
	else if (wasUp)
	{
		if((cell && !cellDown) || (cellRight && !cellDiag && nx))
		{
			if (cell && cellRight)
				this.newY = this.tileToPixel(ty) + world.tileHeight;
			this.Y = Math.floor(ty + 1) - 1;
			this.YV = 0;

			cell = cellDown;
			cellRight = cellDiag;

			ny = 0;
		}
	}

	if (wasRight)
	{
		if ((cellRight && !cell) || (cellDiag && !cellDown && ny))
		{
			if (!(cell && cellRight) && (cellRight || cellDiag))
				this.newX = this.tileToPixel(tx) - 1;
			this.XV = 0;
		}
	}
	else if(wasLeft)
	{
		if((cell & !cellRight) || (cellDown && !cellDiag && ny))
		{
			if (!(cell && cellRight) && (cell || cellDown))
				this.newX = this.tileToPixel(tx) + world.tileWidth;
			this.XV = 0;
		}
	}

	this.X = this.newX;
	this.Y = this.newY;
	if (space && this.canChangeGravity)
	{
	    sound.shiftSound.play();
		world.reverseGravity();
		this.canChangeGravity = false;
	}
	else if (!space) this.canChangeGravity = true;

	// Movement
	if (left) if (falling) this.XV -= 0.5; else this.XV -= 1.0;
	if (right) if (falling) this.XV += 0.5; else this.XV += 1.0;

	// Increase the player's velocity by the gravity of the world
	this.XV += XG;
	if (YG > 0) if (!cellDown && !cellDiag) this.YV += YG;
	if (YG < 0) if (!cell && !cellRight) this.YV += YG;

	// Slow down the player a little bit each frame (wind resistance, terminal velocity, etc.)
	if (falling)
	{
		this.XV *= 0.98;
		this.YV *= 0.98;
	}
	else
	{
		this.XV *= 0.89;
		this.YV *= 0.89;
	}
	if (this.XV > -0.02 && this.XV < 0.02) this.XV = 0;
	if (this.YV > -0.02 && this.YV < 0.02) this.YV = 0;

	// Increment the running displacement by the player's movement speed
	if ((left || right))
		this.runningDisplacement += Math.abs(this.XV / 40);
	else
		this.runningDisplacement += 0.03;

	if (falling)
	    this.flyTime++;
	else
	{
	    if (this.flyTime > 0 && Math.abs(this.YV) > 2)
	        sound.fallSound.play();

	    this.flyTime = 0;
	}

    // Play the step sounds
	if ((this.runningDisplacement.toFixed(1) % 2 == 0) && (left || right) && !falling)
	{
        sound.playStepSound();
	}
}

Player.prototype.resetShouldPlayStepSound = function()
{
    this.shouldPlayStepSound = true;
}

// Function: Align a coordinate to the length of a tile
Player.prototype.tileToPixel = function(number)
{
	return Math.floor(number / world.tileWidth) * world.tileWidth;
}

// Function: Draw the player on the screen
Player.prototype.draw = function(displacementX, displacementY, cameraX, cameraY, cameraDisplacementX, cameraDisplacementY, left, right)
{
	// Set the colour
	context.fillStyle = "#FFF";
	
	if (right) this.direction = 1;
	if (left) this.direction = -1;

	if ((left || right) && world.YG < 0) this.direction *= -1;

	if(falling && this.flyTime > 3)
	{
		if(this.direction > 0) this.playerImage = this.rightFallingImage;
		else if(this.direction < 0) this.playerImage = this.leftFallingImage;
	}
	else
	{
		if(this.XV != 0 && (left || right))
		{
			if (this.runningDisplacement > this.leftRunningImages.length || this.runningDisplacement > this.rightRunningImages.length)
				this.runningDisplacement = 0;

			if(this.direction > 0) this.playerImage = this.rightRunningImages[Math.floor(this.runningDisplacement)];
			if(this.direction < 0) this.playerImage = this.leftRunningImages[Math.floor(this.runningDisplacement)];
		}
		else
		{
			if (this.runningDisplacement > this.leftStandingImages.length || this.runningDisplacement > this.rightStandingImages.length)
				this.runningDisplacement = 0;

			if(this.direction > 0) this.playerImage = this.rightStandingImages[Math.floor(this.runningDisplacement)];
			if(this.direction < 0) this.playerImage = this.leftStandingImages[Math.floor(this.runningDisplacement)];
		}
	}
	
	// Make the player upside-down if the gravity is the other way
	if (world.YG < 0)
	{
		context.save();
		context.translate(1600, 900);
		context.rotate(this.pi);

		cameraX += cameraDisplacementX;
		cameraY += cameraDisplacementY;
	}

    // Draw the player image where the player is located
	context.drawImage(this.playerImage,
			displacementX + (this.X) - cameraX,
			displacementY + (this.Y) - cameraY,
			this.width,
			this.height);

	context.restore();
}
