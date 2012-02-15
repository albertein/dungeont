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
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                game.paintCell(this.x + i, this.y + j);
            }
        }
    };
}
function Corridor(x, y, direction) {
    this.x = x;
    this.y = y;
    this.north = null;
    this.west = null;
    this.south = null;
    this.east = null;
    this.paint = function() {
	game.paintCell(this.x, this.y, "green");
    }
}