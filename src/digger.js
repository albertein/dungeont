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

    game.log("A", 3);
    var corridor = new Corridor(room.x + positionX + offsetX,
				room.y + positionY + offsetY,
				direction,
				game.random(7) + 1);
   
    game.corridors.push(corridor);
    corridor.paint();
}