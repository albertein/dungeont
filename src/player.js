dungeont.player = (function() {
    var posX = 1;
    var posY = 1;
    var inited = false;
    var possiblePositions = [];
    var move = function() {
	dungeont.camera.characterMoved(posX, posY);
	var doorPositions = [
	    {x: posX + 1, y: posY},
	    {x: posX - 1, y: posY},
	    {x: posX, y: posY + 1},
	    {x: posX, y: posY - 1}];
	for (var i = 0; i < doorPositions.length; i++) {
	    var pos = doorPositions[i];
	    if ((dungeont.game.map[pos.x][pos.y] & dungeont.MAP_MASK) ===
		dungeont.MAP_DOOR)
		dungeont.game.map[pos.x][pos.y] = dungeont.MAP_OPEN_DOOR;
	}
	possiblePositions = [];
	var walker = function(x, y, direction, steps, initial) {
	    var cell = dungeont.game.map[x][y] & dungeont.MAP_MASK;
	    if (steps == 0)
		return;
	    steps--;
	    var next = function(x, y, direction) {
		possiblePositions.push({x: x, y: y});
		if (direction !== dungeont.DIRECTION_SOUTH)
		    walker(x, y - 1, dungeont.DIRECTION_NORTH, steps);
		if (direction !== dungeont.DIRECTION_NORTH) 		
		    walker(x, y + 1, dungeont.DIRECTION_SOUTH, steps);
		if (direction !== dungeont.DIRECTION_EAST)
		    walker(x + 1, y, dungeont.DIRECTION_WEST, steps);
		if (direction !== dungeont.DIRECTION_WEST)
		    walker(x - 1, y, dungeont.DIRECTION_EAST, steps);
	    };
	    if (cell === dungeont.MAP_CORRIDOR) {
		next(x, y, direction);
	    } else if (cell === dungeont.MAP_OPEN_DOOR ||
		       (cell === dungeont.MAP_ROOM && initial)) {
		var room = dungeont.game.roomAtPoint(x, y, true);
		for (var i = 0; i < room.width; i++)
		    for (var j = 0; j < room.height; j++)
			possiblePositions.push({x: room.x + i, y: room.y + j});
		for(var i = 0; i < room.doors.length; i++) {
		    var door = room.doors[i];
		    if ((dungeont.game.map[door.x][door.y] & dungeont.MAP_MASK)
			=== dungeont.MAP_DOOR)
			continue;
		    next(door.x, door.y, dungeont.DIRECTION_NONE);
		}
	    }
	};

	walker(posX, posY, dungeont.DIRECTION_NONE, 6, true);
    };

    return {
	x: function() { return posX;},
	y: function() { return posY;},
	tick: function() {
	    if (!inited) {
		inited = true;
		posX = dungeont.game.initialPosition.x;
		posY = dungeont.game.initialPosition.y;
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