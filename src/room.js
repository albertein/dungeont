dungeont.room = function(x, y, width, height) {
    x = Math.floor(x);
    y = Math.floor(y);
    return {
	x: x,
	y: y,
	width: width,
	height: height,
	intersects: function(room) {
	    if ((room.x < x || room.x > x) ||
		(room.x + room.width < x || room.x + room.width > x))
		return false; //no collision on X axis
	    if ((room.y < y || room.y > y) ||
		(room.y + room.height < y || room.y + room.height > y))
		return false; //no collision on Y axis
	    return true;
	},
	paint: function(color) {
	    for (var i = 0; i < width; i++)
		for (var j = 0; j < height; j++)
		    dungeont.game.paintCell(x + i, y + j, color);
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