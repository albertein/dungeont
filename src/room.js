dungeont.room = function(x, y, width, height) {
    x = Math.floor(x);
    y = Math.floor(y);
    var id = 0;
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

	    //remove door positions that will not be needed
	    //at random
	    for (var i = 0; i < 4 - doors; i++) { 
		var delete_position = dungeont.random(4); 
		console.log(delete_position);
		while(positions[delete_position] === -1)
		    delete_position = dungeont.random(4);
		positions[delete_position] = -1;
	    }

	    //generate doors at room walls
	    for (var i = 0; i < positions.length; i++) {
		var position = positions[i];
		if (position === -1)
		    continue;
		var doorX = 0;
		var doorY = 0;
		if (position === dungeont.DIRECTION_NORTH) {
		    doorY = y - 1;
		    doorX = x + dungeont.random(width);
		} else if (position === dungeont.DIRECTION_EAST) {
		    doorX = x + width;
		    doorY = y + dungeont.random(height);
		} else if (position === dungeont.DIRECTION_SOUTH) {
		    doorY = y + height;
		    doorX = x + dungeont.random(width);
		} else { //DIRECTION_WEST
		    doorX = x - 1;
		    doorY = y + dungeont.random(height);
		}
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
	contains: function(x, y) {
	    return this.x <= x && this.x + width >= x &&
		this.y <= y && this.y + height >= y;
	}
    };
};