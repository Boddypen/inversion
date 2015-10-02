var Effect = function(imageSource, initialX, initialY, initialXVelocity, initialYVelocity, friction, tileWidth, tileHeight, tiles, initialTileIndex, tickTime, gravityX, gravityY)
{
    this.image = new Image();
    this.image.src = imageSource;

    this.X = initialX;
    this.Y = initialY;

    this.friction = friction;

    this.XV = initialXVelocity;
    this.YV = initialYVelocity;

    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;

    this.tiles = tiles;

    this.tileIndex = initialTileIndex;

    this.XG = gravityX;
    this.YG = gravityY;

    this.tickTime = tickTime;
}

Effect.prototype.update = function()
{
    this.XV += this.XG;
    this.YV += this.YG;

    this.X += this.XV;
    this.Y += this.YV;

    this.XV *= this.friction;
    this.YV *= this.friction;

    this.tileIndex++;
}

Effect.prototype.draw = function(displacementX, displacementY, cameraX, cameraY)
{
    context.drawImage(this.image, Math.floor(this.tileIndex / this.tickTime) * this.tileWidth, 0, this.tileWidth, this.tileHeight,
            displacementX + (this.X) - cameraX,
            displacementY + (this.Y) - cameraY,
            this.tileWidth * 16, this.tileHeight * 16);
}
