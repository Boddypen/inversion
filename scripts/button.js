
//start menu buttons
var Button = function()
{
	this.x = 200;
	this.y = 50;
	
	this.image = document.createElement("img")
	this.image.src = "images/misc/start.png";
	
	this.onButtonPress = null;
}

Button.prototype.update = function()
{
	if (mouse.getMouseState())
	{
		var mouse_x = mouse.getX();
		var mouse_y = mouse.getY();
	}
	
	if (this.x < mouse_x && mouse_x < this.x + 200)
	{
		if(this.y < mouse_y && mouse_y < this.y + 50)
		{
			gameState = 1
			if (this.onButtonPress != null)
				this.onButtonPress();
		}
	}
}

Button.prototype.draw = function(cam_x, cam_y)
{
	context.drawImage(this.image, 200, 50);
	context.fillRect(this.x, this.y, 200, 50);
}
