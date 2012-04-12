dungeont.camera = (function() {
    var x = 0;
    var y = 0;
    var pointOnCamera = function(pointX, pointY) {
	return pointX >= x && pointX < x + dungeont.game.sceneWidth &&
	    pointY >= y && pointY < y + dungeont.game.sceneHeight;
    };
    var characterMoved = function(charX, charY) {
	var offScreenPercent = .2;
	var offLeft = dungeont.game.sceneWidth * offScreenPercent;
	var offRight = dungeont.game.sceneWidth - offLeft;
	var offTop = dungeont.game.sceneHeight * offScreenPercent;
	var offBottom = dungeont.game.sceneHeight - offTop;
	var pixX = charX * dungeont.game.cellSize - x;
	var pixY = charY * dungeont.game.cellSize - y;
	var newX = x;
	var newY = y;
	if (pixX < offLeft)
	    newX = x - dungeont.game.cellSize * 5;
	if (pixX > offRight)
	    newX = x + dungeont.game.cellSize * 5;
	if (pixY < offTop)
	    newY = y - dungeont.game.cellSize * 5;
	if (pixY > offBottom)
	    newY = y + dungeont.game.cellSize * 5;
	if (newX < 0)
	    newX = 0;
	if (newY < 0)
	    newY = 0;
	var gameWidth = dungeont.game.horizontalCells * dungeont.game.cellSize;
	var gameHeight = dungeont.game.verticalCells * dungeont.game.cellSize;
	if (newX + dungeont.game.sceneWidth > gameWidth)
	    newX = gameWidth - dungeont.game.sceneWidth;
	if (newY + dungeont.game.sceneHeight > gameHeight)
	    newY = gameHeight - dungeont.game.sceneHeight;
	x = newX;
	y = newY;
	console.log("Camera x: " + x + " , y: " + y);
    };
    return {
	x: function() { return x; },
	y: function() { return y; },
	pointOnCamera: pointOnCamera,
	characterMoved: characterMoved
    };
})();