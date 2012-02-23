dungeont.digger = function() {
    return {
	dig: function() {
	    var cells = dungeont.game.horizontalCells * 
		dungeont.game.verticalCells;
	    var averageRoomArea = 50;
	    var averageWhiteSpace = .6;
	    var rooms = Math.floor(
		cells * (1 - averageWhiteSpace) / averageRoomArea);
	    console.log(rooms);
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
		room.build();
	    }

	    //Build corridors
	    var createPath = function(startX, startY, comesFrom) {
		var directions = [ 
		    dungeont.DIRECTION_NORTH,
		    dungeont.DIRECTION_EAST,
		    dungeont.DIRECTION_SOUTH,
		    dungeont.DIRECTION_WEST
		];
		//shuffle the direction array to spice a little bit the dungeon
		dungeont.shuffle(directions);
		console.log(directions);
		var cellType = dungeont.game.map[startX][startY] &
		    dungeont.MAP_MASK;
		if (cellType !== dungeont.MAP_CORRIDOR &&
		    cellType !== dungeont.MAP_EMPTY)
		    return false;
		dungeont.game.map[startX][startY] = dungeont.MAP_CORRIDOR;
		var foundDoor = false;
		for (var i = 0; i < directions.length; i++) {
		    if (directions[i] === comesFrom)
			continue;
		    var deltaX = 0;
		    var deltaY = 0;
		    if (directions[i] === dungeont.DIRECTION_NORTH) 
			deltaY = -1;
		    else if (directions[i] === dungeont.DIRECTION_EAST)
			deltaX = 1;
		    else if (directions[i] === dungeont.DIRECTION_SOUTH)
			deltaY = 1;
		    else //DIRECTION_WEST
			deltaX = -1;
		    var x = startX;
		    var y = startY;
		    var points = [];
		    var doorInPath = false;
		    for (var j = 0; j < dungeont.game.corridorBaseSize; j++) {
			x += deltaX;
			y += deltaY;
			var cellType = dungeont.game.getCellType(x, y);
			if (cellType === dungeont.MAP_DOOR) {
			    doorInPath = true;
			    break; //Stop digging, found door
			}
			if (cellType === dungeont.MAP_WALL)
			    break; //Stop digging in this direction
			if (cellType === dungeont.MAP_CORRIDOR) 
			    break; //Stop digging in this direction
			//If there is any door in the adjacent cells find it
			//and mark the door on the current path
			if (dungeont.game.getCellType(x + 1, y) === 
			    dungeont.MAP_DOOR ||
			    dungeont.game.getCellType(x - 1, y) === 
			    dungeont.MAP_DOOR ||
			    dungeont.game.getCellType(x, y + 1) ===
			    dungeont.MAP_DOOR ||
			    dungeont.game.getCellType(x, y - 1) ===
			    dungeont.MAP_DOOR)
			    doorInPath = true;
			points.push({x: x, y: y});
			dungeont.game.map[x][y] = dungeont.MAP_CORRIDOR;
		    }
		    if (j !== 0) { 
			var doorInChild = 
			    createPath(x, y, (directions[i] + 2) % 4);
			doorInPath = doorInPath || doorInChild;
		    }
		    foundDoor = foundDoor || doorInPath;
		    //If the current path or any of its children were unable to find
		    //a door, we need to destroy de unnesesary path
		    if (!doorInPath) {
			for (var z = 0; z < points.length; z++) {
			    dungeont.game.map[points[z].x][points[z].y] =
				dungeont.MAP_EMPTY;
			}
		    }

		}

		return foundDoor;
	    };
	    createPath(1, 1, dungeont.DIRECTION_NORTH);
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