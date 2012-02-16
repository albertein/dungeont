dungeont.digger = function() {
    var initialWidth; 
    var initialHeight;
    return {
	init: function(initialWidth, initialHeight) {
	    var room = dungeont.room(
		dungeont.game.horizontalCells / 2 - initialWidth / 2,
		dungeont.game.verticalCells / 2 - initialHeight / 2, 
		initialWidth, initialHeight);
	    dungeont.game.rooms.push(room);
	    room.paint();
	    var direction = dungeont.game.random(4);
	    var positionX = dungeont.game.random(room.width);
	    var positionY = dungeont.game.random(room.height);
	    var offsetX = 0;
	    var offsetY = 0;
	    if (direction === dungeont.DIRECTION_NORTH) {
		offsetY = -1;
		positionY = 0;
	    } else if (direction === dungeont.DIRECTION_EAST) {
		offsetX = 1; 
		positionX = room.width - 1;
	    } else if (direction === dungeont.DIRECTION_SOUTH) {
		offsetY = 1;
		positionY = room.height - 1;
	    } else { //DIRECTION_WEST
		offsetX = -1;
		positionX = 0;
	    }

	    var corridorDirection = (direction + 2) % 4;
	    while (corridorDirection === (direction + 2) % 4)
		corridorDirection = dungeont.game.random(4);
	    var length = dungeont.game.random(7) + 3;
	    dungeont.log("l", length);
	    var corridor = dungeont.corridor(room.x + positionX + offsetX, 
					     room.y + positionY + offsetY,
					     corridorDirection,
					     length);
   
	    dungeont.game.corridors.push(corridor);
	    corridor.paint();
	}
    };
};