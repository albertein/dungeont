function Digger(game, initialWidth, initialHeight) {
    var room = new Room(
	game.horizontalCells / 2 - initialWidth / 2,
	game.verticalCells / 2 - initialHeight / 2, 
	initialWidth, initialHeight);
    game.rooms.push(room);
    room.paint();
    var direction = game.random(4);
    var positionX = game.random(room.width);
    var positionY = game.random(room.height);
    var offsetX = 0;
    var offsetY = 0;
    switch (direction) {
    case 0: offsetY = -1; positionY = 0; break;
    case 1: offsetX = 1; positionX = room.width - 1; break;
    case 2: offsetY = 1; positionY = room.height - 1; break;
    case 3: offsetX = -1;positionX = 0; break;
    }
   
    var corridor = new Corridor(room.x + positionX + offsetX, 
				room.y + positionY + offsetY);
    game.corridors.push(corridor);
    corridor.paint();
    for (var i = 0; i < 10; i++) {
	var oldCorridor = corridor;
	var newDirection;
	while((newDirection = game.random(4)) == direction);
	direction = newDirection;
	var step = 1;
	if (direction == 0 || direction == 3) step = -1;
	corridor = new Corridor(
	    (direction == 0 || direction == 2) ? oldCorridor.x + step :
		oldCorridor.x,
	    (direction == 1 || direction == 3) ? oldCorridor.y + step :
		oldCorridor.y);
	game.corridors.push(corridor);
	corridor.paint();
    }
}