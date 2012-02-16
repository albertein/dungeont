var dungeont = {};
dungeont.DIRECTION_NORTH = 0;
dungeont.DIRECTION_EAST = 1;
dungeont.DIRECTION_SOUTH = 2;
dungeont.DIRECTION_WEST = 3;
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
dungeont.game  = (function() {
    var canvas = null;
    var ctx = null;
    var width = 810;
    var height = 600;
    var cellSize = 30;
    var horizontalCells = width / cellSize;
    var verticalCells = height / cellSize;
    var rooms = [];
    var corridors = [];
    var paintBackground = function() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = "gray";
        for (var i = cellSize; i < width; i += cellSize) {
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            ctx.stroke();
        }
        for (var i = cellSize; i < height; i += cellSize) {
            ctx.moveTo(0, i);
            ctx.lineTo(width, i);
            ctx.stroke();
        }
    };

    return {
	horizontalCells: horizontalCells,
	verticalCells: verticalCells,
	rooms: rooms,
	corridors: corridors,
	init: function(gameCanvas) {
	    canvas = gameCanvas;
	    ctx = canvas.getContext("2d");
	    ctx.lindeWidth = 1;
	    paintBackground();
	    var digger = dungeont.digger();
	    digger.init(3, 2);
	},
	random: function(maxNumber) {
	    return Math.floor(Math.random() * maxNumber);
	},
	paintCell: function(x, y, color) {
            if (color === undefined)
		color = "blue";
	    ctx.fillStyle = color;
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
	}
    };
})();