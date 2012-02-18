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
			cellType = dungeont.MAP_WALL;
		    dungeont.game.map[x + i][y + j] = cellType;
		}
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
		    if (dungeont.game.map[x + i][y + j] & 0x3 !== 
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

dungeont.corridor = function(x, y, direction, length) {
    var width = 1;
    var height = 1;
    if (direction === dungeont.DIRECTION_NORTH) {
	height = length;
	y -= length - 1;
    } else if (direction === dungeont.DIRECTION_EAST) {
	width = length;
    } else if (direction === dungeont.DIRECTION_SOUTH) {
	height = length;
    } else { //DIRECTION_WEST
	width = length;
	x -= length - 1;
    }
    dungeont.log("W", width, "H", height, "L", length);
    var corridor = dungeont.room(x, y, width, height);
    var room_paint = corridor.paint;
    corridor.paint = function() {
	room_paint("green");
    };
    return corridor;
};