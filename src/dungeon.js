var dungeont = {};
dungeont.DIRECTION_NORTH = 0;
dungeont.DIRECTION_EAST = 1;
dungeont.DIRECTION_SOUTH = 2;
dungeont.DIRECTION_WEST = 3;
dungeont.DIRECTION_NONE = 4;
dungeont.MAP_EMPTY = 0;
dungeont.MAP_WALL = 1;
dungeont.MAP_ROOM = 2;
dungeont.MAP_CORRIDOR = 3;
dungeont.MAP_DOOR = 4;
dungeont.MAP_SPECIAL = 5;
dungeont.MAP_MASK = 0x7;
dungeont.log = function() {
    if (!console)
	return;
    if (arguments.length % 2 !== 0) {
	console.error("Arguments must be even");
	return;
    };
    var log = "";
    for (var i = 0; i < arguments.length; i += 2)
	log += arguments[i] + ": " + arguments[i + 1] + "; ";
    console.log(log);
};
dungeont.random = function(maxNumber) {
    return Math.floor(Math.random() * maxNumber);
}
dungeont.shuffle = function(array) {
    for (var i = 0; i < array.length; i++) {
	var j = dungeont.random(array.length);
	var tmp = array[i];
	array[i] = array[j];
	array[j] = tmp;
    }
};
dungeont.game  = (function() {
    var canvas = null;
    var ctx = null;
    var width = 810;
    var height = 600;
    var cellSize = 10;
    var horizontalCells = width / cellSize;
    var verticalCells = height / cellSize;
    var rooms = [];
    var corridors = [];
    var map = new Array(horizontalCells);
    for (var i = 0; i < horizontalCells; i++) {
	map[i] = new Array(verticalCells);
	for (var j = 0; j < verticalCells; j++) {
	    if (i === 0 || i === horizontalCells - 1 ||
		j === 0 || j === verticalCells - 1)
		map[i][j] = dungeont.MAP_WALL; //build perimetral wall
	    else
		map[i][j] = dungeont.MAP_EMPTY;
	}
    }
    
    var paintBackground = function() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = "gray";
        for (var i = cellSize; i < width; i += cellSize) {
            ctx.beginPath();
	    ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
	    ctx.closePath();
            ctx.stroke();
        }
        for (var i = cellSize; i < height; i += cellSize) {
	    ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(width, i);
	    ctx.closePath();
            ctx.stroke();
        }
    };

    var paintCell = function(x, y, color) {
	x = Math.floor(x);
	y = Math.floor(y);
	ctx.fillStyle = color;
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    };

    var render = function() {
	dungeont.player.tick();
	var last = new Date();
	paintBackground();
	for (var i = 0; i < map.length; i++) {
	    for (var j = 0; j < map[i].length; j++) {
		var cell = map[i][j];
		var cellType = cell & dungeont.MAP_MASK;
		if (cellType === dungeont.MAP_EMPTY)
		    continue;
		var colors = [];
		colors[dungeont.MAP_WALL] = "rgb(60, 60, 60)";
		colors[dungeont.MAP_ROOM] = "white";
		colors[dungeont.MAP_CORRIDOR] = "white";
		colors[dungeont.MAP_DOOR] = "white";
		colors[dungeont.MAP_SPECIAL] = "red";
		paintCell(i, j, colors[cellType]);
	    }
	}


	var pp = dungeont.player.possiblePositions();
	for (var i = 0; i < pp.length; i++) {
	    paintCell(pp[i].x, pp[i].y, "blue");
	}
	paintCell(dungeont.player.x(), dungeont.player.y(), "yellow");
	paintCell(dungeont.mouse.x / cellSize, dungeont.mouse.y / cellSize,
		  "pink");
	setTimeout(render, 60 / 1000);
    }

    return {
	horizontalCells: horizontalCells,
	verticalCells: verticalCells,
	rooms: rooms,
	map: map,
	init: function(gameCanvas) {
	    canvas = gameCanvas;
	    ctx = canvas.getContext("2d");
	    ctx.lindeWidth = 1;
	    var digger = dungeont.digger();
	    digger.dig();
	    render(); 
	},
	getCellType: function(x, y) {
	    return map[x][y] & dungeont.MAP_MASK;
	},
	corridorBaseSize: 4,
	roomAtPoint: function(x, y, includeWall) {
	    for (var i = 0; i < rooms.length; i++)
		if (rooms[i].contains(x, y, includeWall))
		    return rooms[i];
	    return null;
	},
	cordsToCell: function(pointX, pointY) {
	    return {
		x: Math.floor(pointX / cellSize),
		y: Math.floor(pointY / cellSize)
	    };
	},
	render: render
    };
})();