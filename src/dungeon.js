function Game(canvas) {
    this.context = canvas.getContext("2d");
    var ctx = this.context;
    ctx.lineWidth = 1;
    this.width = 810;
    this.height = 600;
    this.cellSize = 30;
    this.horizontalCells = this.width / this.cellSize;
    this.verticalCells = this.height / this.cellSize;
    this.rooms = [];
    this.corridors = [];
    this.random = function(maxNumber) {
	return Math.floor(Math.random() * maxNumber);
    }

    this.init = function() {
        this.paintBackground();
	new Digger(this, 3, 2);
    };
   
    this.paintBackground = function() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.strokeStyle = "gray";
        for (var i = this.cellSize; i < this.width; i += this.cellSize) {
            ctx.moveTo(i, 0);
            ctx.lineTo(i, this.height);
            ctx.stroke();
        }
        for (var i = this.cellSize; i < this.height; i += this.cellSize) {
            ctx.moveTo(0, i);
            ctx.lineTo(this.width, i);
            ctx.stroke();
        }
    };

    this.paintCell = function(x, y, color) {
        if (color === undefined)
	    color = "blue";
	ctx.fillStyle = color;
        ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, 
		     this.cellSize);
    };

    this.log = function() {
	if (!console.log)
	    return;
	if ((arguments.length % 2) != 0) {
	    if (!console.error) 
		return;
	    console.error("Argument list must be even");
	}
	var output = "";
	for (var i = 0; i < arguments.length; i += 2) {
	    output += arguments[i] + ": " + arguments[i + 1] + "; ";
	}
	console.log(output);
    };
}
  