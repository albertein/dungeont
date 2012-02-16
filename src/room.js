function Room(x, y, width, height) {
    this.x = Math.floor(x);
    this.y = Math.floor(y);
    this.width = width;
    this.height = height;
    this.doors = [];
    this.intersect = function(room) {
        if (
            (room.x < this.x || room.x > this.x) ||
            (room.x + room.width < this.x || room.x + room.width > this.x))
            return false; //no collision on X axis
        if (
            (room.y < this.y || room.y > this.y) ||
            (room.y + room.height < this.y || room.y + room.height > this.y))
            return false; //no collision on Y axis
        return true;
    };
    this.paint = function() {
	game.log("X", 0, "Y", 1, "A", 2, "B", 3);
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                game.paintCell(this.x + i, this.y + j);
            }
        }
    };
}
function Corridor(left, top, direction, length) {
    this.top = top;
    this.left = left;
    this.length = length;
    this.direction = direction;
    this.north = null;
    this.west = null;
    this.south = null;
    this.east = null;
    this.paint = function() {
	var x = this.left;
	var y = this.top;
	var deltaX = 0;
	var deltaY = 0;
	if (direction == 0)
	    deltaY = -1;
	else if (direction == 1)
	    deltaX = 1;
	else if (direction == 2)
	    deltaY = 1;
	else
	    deltaX = -1;
	for (var i = 0; i < this.length; i++) {
	    game.paintCell(x, y, "green");
	    x += deltaX;
	    y += deltaY;
	}
    }
}