dungeont.room = function(x, y, width, height) {
    x = Math.floor(x);
    y = Math.floor(y);
    var id = 0;
    var contains = function(pointX, pointY) {
	return pointX >= x && pointX < x + width && pointY >= y && 
	    pointY < y + height;
    };
    return {
	x: x,
	y: y,
	width: width,
	height: height,
	id: -1,
	build: function() {
	    for (var i = -1; i <= width; i++) {
		for (var j = -1; j <= height; j++) {
		    var cellType = dungeont.MAP_ROOM;
		    if (i === -1 || i === width || j === -1 || j === height)
			cellType = dungeont.MAP_WALL; //perimetral wall
		    dungeont.game.map[x + i][y + j] = cellType;
		}
	    }
	    //generate doors
	    var doors = dungeont.random(4) + 1; //how many doors?
	    var positions = [
		dungeont.DIRECTION_NORTH,
		dungeont.DIRECTION_EAST,
		dungeont.DIRECTION_SOUTH,
		dungeont.DIRECTION_WEST
	    ];
	    dungeont.shuffle(positions);
	    //generate doors at room walls
	    for (var i = 0; i < positions.length; i++) {
		if (doors === 0)
		    break; //Break if we added the desired doors
		var position = positions[i];
		if (position === -1)
		    continue;
		var doorX = 0;
		var doorY = 0;
		var calcDoorPosition = function (baseCoord, baseDimention) {
		    var posibleDoors = [];
		    for (var j = 0; j < baseDimention; j++)  
			if (((baseCoord + j) - 1) % 
			    dungeont.game.corridorBaseSize === 0)
			    posibleDoors.push(baseCoord + j);
		    if (posibleDoors.length === 0)
			return -1;
		    return posibleDoors[dungeont.random(posibleDoors.length)]
		};
		if (position === dungeont.DIRECTION_NORTH) {
		    doorY = y - 1;
		    doorX = calcDoorPosition(x, width);
		} else if (position === dungeont.DIRECTION_EAST) {
		    doorX = x + width;
		    doorY = calcDoorPosition(y, height);
		} else if (position === dungeont.DIRECTION_SOUTH) {
		    doorY = y + height;
		    doorX = calcDoorPosition(x, width);
		} else { //DIRECTION_WEST
		    doorX = x - 1;
		    doorY = calcDoorPosition(y, height);
		}
		if (doorX === -1 || doorY === -1)
		    continue; //Cannot place door at this position
		doors--;
		dungeont.game.map[doorX][doorY] = dungeont.MAP_DOOR;
	    }

	    dungeont.game.rooms.push(this);
	    this.id = ++id;
	},
	hasIntersect: function() {
	    for (var i = -1; i <= width; i++) {
		for (var j = -1; j <= height; j++) {
		    if ((i + x) === -1 || 
			(i + x) === dungeont.horizontalCells ||
			(j + y) === -1 ||
			(j + y) === dungeont.verticalCells)
			return true; //avoid falling of the board
		    if (dungeont.game.map[x + i][y + j] & dungeont.MAP_MASK !== 
			dungeont.MAP_EMPTY)
			return true;
		}
	    }
	    return false;
	},
	intersects: function(room) {
	    if ((room.x < x || room.x > x) ||
		(room.x + room.width < x || room.x + room.width > x))
		return false; //no collision on X axis
	    if ((room.y < y || room.y > y) ||
		(room.y + room.height < y || room.y + room.height > y))
		return false; //no collision on Y axis
	    return true;
	},
	contains: contains
    };
};