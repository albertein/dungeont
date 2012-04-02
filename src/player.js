dungeont.player = (function() {
    var posX = 1;
    var posY = 1;
    var inited = false;
    var possiblePositions = [];
    var move = function() {
	possiblePositions = [];
	var walker = function(x, y, direction, steps) {
	    var cell = dungeont.game.map[x][y] & dungeont.MAP_MASK;
	    if (steps == 0)
		return;
	    if (cell === dungeont.MAP_CORRIDOR) {
		possiblePositions.push({x: x, y: y});
		steps--;
		if (direction !== dungeont.DIRECTION_NORTH)
		    walker(x, y - 1, dungeont.DIRECTION_SOUTH, steps);
		if (direction !== dungeont.DIRECTION_SOUTH) 		
		    walker(x, y + 1, dungeont.DIRECTION_NORTH, steps);
		if (direction !== dungeont.DIRECTION_WEST)
		    walker(x + 1, y, dungeont.DIRECTION_EAST, steps);
		if (direction !== dungeont.DIRECTION_EAST)
		    walker(x - 1, y, dungeont.DIRECTION_WEST, steps);
	    }
	};

	walker(posX, posY, dungeont.DIRECTION_NONE, 6);
    };

    return {
	x: function() { return posX;},
	y: function() { return posY;},
	tick: function() {
	    if (!inited) {
		inited = true;
		move();
	    }
	    if (!dungeont.mouse.clicked) 
		return;
	    dungeont.mouse.clicked = false;
	    var cell = dungeont.game.cordsToCell(dungeont.mouse.x, 
						 dungeont.mouse.y);
	    for (var i = 0; i < possiblePositions.length; i++) {
		var point = possiblePositions[i];
		if (point.x === cell.x && point.y === cell.y) {
		    posX = cell.x;
		    posY = cell.y;
		    move();
		    break;
		}
	    }
	},
	possiblePositions: function() { return possiblePositions; }
    };
})();