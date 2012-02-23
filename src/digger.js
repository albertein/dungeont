dungeont.digger = function() {
    return {
	dig: function() {
	    var cells = dungeont.game.horizontalCells * 
		dungeont.game.verticalCells;
	    var averageRoomArea = 50;
	    var averageWhiteSpace = .6;
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
		room.build();
	    }
	    
	    //Build corridors
	    var createPath = function(startX, startY, comesFrom, secondTake) {
		var directions = [ 
		    dungeont.DIRECTION_NORTH,
		    dungeont.DIRECTION_EAST,
		    dungeont.DIRECTION_SOUTH,
		    dungeont.DIRECTION_WEST
		];
		//shuffle the direction array to spice a little bit the dungeon
		dungeont.shuffle(directions);
		var cellType = dungeont.game.map[startX][startY] &
		    dungeont.MAP_MASK;
		if (cellType !== dungeont.MAP_CORRIDOR &&
		    cellType !== dungeont.MAP_EMPTY && cellType !== dungeont.MAP_SPECIAL)
		    return false;
		dungeont.game.map[startX][startY] = dungeont.MAP_CORRIDOR;
		if (secondTake)
		    dungeont.game.map[startX][startY] = dungeont.MAP_SPECIAL;
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
			    var room = dungeont.game.roomAtPoint(x, y, true);
			    room.doorAtPoint(x, y).connected = true;
			    doorInPath = true;
			    if (secondTake)
				return true;
			    break; //Stop digging, found door
			}
			if (cellType === dungeont.MAP_WALL)
			    break; //Stop digging in this direction
			if (cellType === dungeont.MAP_CORRIDOR || cellType === dungeont.MAP_SPECIAL) {
			    if(secondTake) return true;
			    break; //Stop digging in this direction
			}
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
			if (secondTake)
			    dungeont.game.map[x][y] = dungeont.MAP_SPECIAL;		
    }
		    if (j !== 0) { 
			var doorInChild = createPath(x, y, 
						     (directions[i] + 2) % 4,
						    secondTake);
			doorInPath = doorInPath || doorInChild;
		    }
		    foundDoor = foundDoor || doorInPath;
		    if (foundDoor && secondTake) return true;
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
	    //Fix the unconnected doors to try to connect them to the main dungeon
	    for (var i = 0; i < dungeont.game.rooms.length; i++) {
		var room = dungeont.game.rooms[i];
		for (var j = 0; j < room.doors.length; j++) {
		    var door = room.doors[j];
		    var dX = 0;
		    var dY = 0;
		    if (door.direction === dungeont.DIRECTION_NORTH)
			dY--;
		    else if (door.direction === dungeont.DIRECTION_EAST)
			dX++;
		    else if (door.direction === dungeont.DIRECTION_SOUTH)
			dY++;
		    else
			dX--;
		    if (!door.connected)
			createPath(door.x + dX, door.y + dY, 
				   (door.direction + 2) % 4, true);
		}
	    }
	}
    };
};