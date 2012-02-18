dungeont.digger = function() {
    return {
	dig: function() {
	    var cells = dungeont.game.horizontalCells * 
		dungeont.game.verticalCells;
	    var averageRoomArea = 36;
	    var averageWhiteSpace = .2;
	    var rooms = Math.floor(
		cells * (1 - averageWhiteSpace) / averageRoomArea);
	    var room = null;
	    for (var i = 0; i < rooms; i++) {
		var width, height, x, y;
		var tryCreateRoom = function() {
		    width = dungeont.random(3) + 3;
		    height = dungeont.random(3) + 3;
		    x = dungeont.random(dungeont.game.horizontalCells);
		    y = dungeont.random(dungeont.game.verticalCells);
		    room = dungeont.room(x, y, width, height);
		};
		tryCreateRoom();
		while(room.hasIntersect()) {
		    tryCreateRoom();
		}
		dungeont.log("x", room.x, "y", room.y, "w", room.width, "h", room.height);
		room.build();
	    }
	},
	init: function(initialWidth, initialHeight) {	
	    var room = dungeont.room(
		dungeont.game.horizontalCells / 2 - initialWidth / 2,
		dungeont.game.verticalCells / 2 - initialHeight / 2, 
		initialWidth, initialHeight);
	    dungeont.game.rooms.push(room);
	    room.paint();
	    var direction = dungeont.random(4);
	    var positionX = dungeont.random(room.width);
	    var positionY = dungeont.random(room.height);
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
		corridorDirection = dungeont.random(4);
	    var length = dungeont.random(7) + 3;
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