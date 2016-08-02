const tries = 10;

var config = require('../config.js');

var map = [];

var server = {};

var totalComputers = -1;

/*var images = [
	'server-top.png',
	'server-right.png',
	'server-bottom.png',
	'server-left.png',

	'computer-off-top.png',
	'computer-off-right.png',
	'computer-off-bottom.png',
	'computer-off-left.png',
	'computer-on-top.png',
	'computer-on-right.png',
	'computer-on-bottom.png',
	'computer-on-left.png',

	'vertical-line.png',
	'horizontal-line.png',

	'corner-1.png',
	'corner-2,png',
	'corner-3.png',
	'corner-4.png',

	't-1.png',
	't-2.png',
	't-3.png',
	't-4.png'
];*/

var getHead = function(){

	headItems = [
		'<link href="/css/style.css" type="text/css" rel="stylesheet"/>',
		'<script src="https://code.jquery.com/jquery-3.1.0.js" integrity="sha256-slogkvB1K3VOkzAI8QITxV3VzpOnkeNVsKvtkYLMjfk=" crossorigin="anonymous"></script>',
		'<script src="/js/index.js" type="text/javascript"></script>'
	];

	return headItems.join('');
}

var renderMap = function(){

	for (var i = 0; i < config.mapSizeX * 3; i++) {
		var row = [];
		for (var j = 0; j < config.mapSizeY * 3; j++) {
			row.push(0);
		}
		map.push(row);
	}
}

var fillBorders = function(){

	for(var i = 0; i < config.mapSizeX * 3; i++){
		map[i][0] = 1;
		map[i][config.mapSizeY * 3 - 1] = 1;
	}

	for(i = 0; i < config.mapSizeY * 3; i++){
		map[0][i] = 1;
		map[config.mapSizeX * 3 - 1][i] = 1;
	}
}

/*
We need to fill x-es with 1 (notAllowed css class)

  | 1 2 3 4 5 6 7 8 9 0 1 2
--------------------------
1 | 1 1 1 1 1 1 1 1 1 1 1 1
2 | 1 0 0 0 0 0 0 0 0 0 0 1
3 | 1 0 x x 0 x x 0 x x 0 1
4 | 1 0 x x 0 x x 0 x x 0 1
5 | 1 0 0 0 0 0 0 0 0 0 0 1
6 | 1 0 x x 0 x x 0 x x 0 1
7 | 1 0 x x 0 x x 0 x x 0 1
8 | 1 0 0 0 0 0 0 0 0 0 0 1
9 | 1 0 x x 0 x x 0 x x 0 1
0 | 1 0 x x 0 x x 0 x x 0 1
1 | 1 0 0 0 0 0 0 0 0 0 0 1
2 | 1 1 1 1 1 1 1 1 1 1 1 1
*/

var fillPieceCorners = function(){
	for(var i = 0; i < config.mapSizeX * 3; i++){
		for(var j = 0; j < config.mapSizeY * 3; j++){
			if( (i % 3 !== 1) && (j % 3 !== 1) ){
				map[i][j] = 1;
			}
		}
	}
}

var putTheServer = function(){
	
	var serverPositionX = Math.floor((Math.random() * config.mapSizeX));
	var serverPositionY = Math.floor((Math.random() * config.mapSizeY));

	server.x = serverPositionX * 3 + 1;
	server.y = serverPositionY * 3 + 1;

	map[serverPositionX * 3 + 1][serverPositionY * 3 + 1] = -1;

	var serverPossibleOutputs = [];

	if(map[serverPositionX * 3 + 1][serverPositionY * 3] === 0){
		serverPossibleOutputs.push('n');
	}

	if(map[serverPositionX * 3 + 2][serverPositionY * 3 + 1] === 0){
		serverPossibleOutputs.push('e');
	}

	if(map[serverPositionX * 3 + 1][serverPositionY * 3 + 2] === 0){
		serverPossibleOutputs.push('s');
	}

	if(map[serverPositionX * 3][serverPositionY * 3 + 1] === 0){
		serverPossibleOutputs.push('v');
	}

	var outputDirection = serverPossibleOutputs[Math.floor(Math.random() * serverPossibleOutputs.length)];

	switch(outputDirection){
		case 'n': map[serverPositionX * 3 + 1][serverPositionY * 3] = -2;
			break;
		case 'e': map[serverPositionX * 3 + 2][serverPositionY * 3 + 1] = -2;
			break;
		case 's': map[serverPositionX * 3 + 1][serverPositionY * 3 + 2] = -2;
			break;
		case 'v': map[serverPositionX * 3][serverPositionY * 3 + 1] = -2;
			break;
	}
}

var buildThePath = function(cable){
	var availableMovements = [];
	availableMovements.push({x: cable.cableX, y: cable.cableY});

	var foundServer = false;

	while(availableMovements.length){
		var coords = availableMovements.shift();

		// check the north square

		if(map[coords.x][coords.y - 1] === 0){
			availableMovements.push({x: coords.x, y: coords.y - 1});
			map[coords.x][coords.y - 1] = map[coords.x][coords.y] + 1;
		}else if(map[coords.x][coords.y - 1] === -2){
			foundServer = true;
			break;
		}

		// check the east square

		if(map[coords.x + 1][coords.y] === 0){
			availableMovements.push({x: coords.x + 1, y: coords.y});
			map[coords.x + 1][coords.y] = map[coords.x][coords.y] + 1;
		}else if(map[coords.x + 1][coords.y] === -2){
			foundServer = true;
			break;
		}

		// check the south square

		if(map[coords.x][coords.y + 1] === 0){
			availableMovements.push({x: coords.x, y: coords.y + 1});
			map[coords.x][coords.y + 1] = map[coords.x][coords.y] + 1;
		}else if(map[coords.x][coords.y + 1] === -2){
			foundServer = true;
			break;
		}

		// chech the vest

		if(map[coords.x - 1][coords.y] === 0){
			availableMovements.push({x: coords.x - 1, y: coords.y});
			map[coords.x - 1][coords.y] = map[coords.x][coords.y] + 1;
		}else if(map[coords.x - 1][coords.y] === -2){
			foundServer = true;
			break;
		}
	}

	// build teh path

	var pathBuilded = false;

	if(foundServer){
		var value = map[coords.x][coords.y];
		while(value !== 1){
			if(map[coords.x - 1][coords.y] === value - 1){ // north
				// console.log('North');
				map[coords.x][coords.y] = -2;
				value = map[coords.x - 1][coords.y];
				coords.x = coords.x - 1;
			}else if(map[coords.x][coords.y - 1] === value - 1){ // east
				// console.log('East');
				map[coords.x][coords.y] = -2;
				value = map[coords.x][coords.y - 1];
				coords.y = coords.y - 1;
			}else if(map[coords.x + 1][coords.y] === value - 1){ // south
				// console.log('South');
				map[coords.x][coords.y] = -2;
				value = map[coords.x + 1][coords.y];
				coords.x = coords.x + 1;
			}else if(map[coords.x][coords.y + 1] === value - 1){ // vest
				// console.log('West');
				map[coords.x][coords.y] = -2;
				value = map[coords.x][coords.y + 1];
				coords.y = coords.y + 1;
			}
		}
		map[cable.cableX][cable.cableY] = -2;
		pathBuilded = true;
	}

	// clear the path

	for(var i = 0; i < config.mapSizeX * 3; i++){
		for(var j = 0; j < config.mapSizeY * 3; j++){
			if(map[i][j] > 1){
				map[i][j] = 0;
			}
		}
	}

	// returbn response

	if(pathBuilded){
		return true
	}

	return false;
}

var putTheComputers = function(count, tries){
	if(count >= config.mapSizeX * config.mapSizeY){
		return '[Error]: Too many computers';
	}

	for(var i = 1; i <= count; i++){

		var computerPositionX = Math.floor((Math.random() * config.mapSizeX));
		var computerPositionY = Math.floor((Math.random() * config.mapSizeY));

		// console.log('Coords: ', computerPositionX, computerPositionY);

		if(map[computerPositionX * 3 + 1][computerPositionY * 3 + 1] === 0){

			map[computerPositionX * 3 + 1][computerPositionY * 3 + 1] = -3;

			var computerPossibleOutputs = [];

			if(map[computerPositionX * 3 + 1][computerPositionY * 3] === 0){
				computerPossibleOutputs.push('n');
			}

			if(map[computerPositionX * 3 + 2][computerPositionY * 3 + 1] === 0){
				computerPossibleOutputs.push('e');
			}

			if(map[computerPositionX * 3 + 1][computerPositionY * 3 + 2] === 0){
				computerPossibleOutputs.push('s');
			}

			if(map[computerPositionX * 3][computerPositionY * 3 + 1] === 0){
				computerPossibleOutputs.push('v');
			}

			var outputDirection = computerPossibleOutputs[Math.floor(Math.random() * computerPossibleOutputs.length)];

			if(outputDirection === 'n'){
				map[computerPositionX * 3 + 1][computerPositionY * 3] = 1;
				if(!buildThePath({
						cableX: computerPositionX * 3 + 1,
						cableY: computerPositionY * 3
				})){
					// console.log('Can\'t build the path');
					map[computerPositionX * 3 + 1][computerPositionY * 3] = 0;
					map[computerPositionX * 3 + 1][computerPositionY * 3 + 1] = 0;
					if(!tries){
						putTheComputers(1, tries - 1);
					}else{
						continue;
					}
				}else{
					totalComputers++;
				}
			}else if(outputDirection === 'e'){
				map[computerPositionX * 3 + 2][computerPositionY * 3 + 1] = 1;
				if(!buildThePath({
						cableX: computerPositionX * 3 + 2,
						cableY: computerPositionY * 3 + 1
				})){
					// console.log('Can\'t build the path');
					map[computerPositionX * 3 + 2][computerPositionY * 3 + 1] = 0;
					map[computerPositionX * 3 + 1][computerPositionY * 3 + 1] = 0;
					if(!tries){
						putTheComputers(1, tries - 1);
					}else{
						continue;
					}
				}else{
					totalComputers++;
				}
			}else if(outputDirection === 's'){
				map[computerPositionX * 3 + 1][computerPositionY * 3 + 2] = 1;
				if(!buildThePath({
						cableX: computerPositionX * 3 + 1,
						cableY: computerPositionY * 3 + 2
				})){
					// console.log('Can\'t build the path');
					map[computerPositionX * 3 + 1][computerPositionY * 3 + 2] = 0;
					map[computerPositionX * 3 + 1][computerPositionY * 3 + 1] = 0;
					if(!tries){
						putTheComputers(1, tries - 1);
					}else{
						continue;
					}
				}else{
					totalComputers++;
				}
			}else if(outputDirection === 'v'){
				map[computerPositionX * 3][computerPositionY * 3 + 1] = 1;
				if(!buildThePath({
						cableX: computerPositionX * 3,
						cableY: computerPositionY * 3 + 1
				})){
					// console.log('Can\'t build the path');
					map[computerPositionX * 3][computerPositionY * 3 + 1] = 0;
					map[computerPositionX * 3 + 1][computerPositionY * 3 + 1] = 0;
					if(!tries){
						putTheComputers(1, tries - 1);
					}else{
						continue;
					}
				}else{
					totalComputers++;
				}
			}
		}else{
			if(!tries){
				putTheComputers(1, tries - 1);
			}
		}
	}
}

var shuffleMap = function(){
	for(var i = 0; i < config.mapSizeX; i++){
		for(var j = 0; j < config.mapSizeY; j++){
			if(map[i * 3 + 1][j * 3 + 1] === -2){
				// randomly generated value
				var rotationNumber = Math.floor(Math.random() * 4);

				for(var k = 0; k < rotationNumber; k++){
					var temp = map[i * 3][j * 3 + 1];
					map[i * 3][j * 3 + 1] = map[i * 3 + 1][j * 3 + 2];
					map[i * 3 + 1][j * 3 + 2] = map[i * 3 + 2][j * 3 + 1];
					map[i * 3 + 2][j * 3 + 1] = map[i * 3 + 1][j * 3];
					map[i * 3 + 1][j * 3] = temp;
				}
			}
		}
	}
}

var turnComputersOn = function(){
	var connectedComputers = -1;

	for(var i = 0; i < config.mapSizeX * 3; i++){
		for(var j = 0; j < config.mapSizeY * 3; j++){
			if(map[i][j] === -5){
				map[i][j] = -3;
			}
		}
	}

	var path = [{'x': server.x, 'y': server.y}];

	var cell = path.shift();

	// console.log('Server:', cell);

	if(map[cell.x - 1][cell.y] === -2){ // server top
		path.push({'x': cell.x - 1, 'y': cell.y});
		map[cell.x - 1][cell.y] = -6;
	}else if(map[cell.x][cell.y + 1] === -2){ // server right
		path.push({'x': cell.x, 'y': cell.y + 1});
		map[cell.x][cell.y + 1] = -6;
	}else if(map[cell.x + 1][cell.y] === -2){ // server bottom
		path.push({'x': cell.x + 1, 'y': cell.y});
		map[cell.x + 1][cell.y] = -6;
	}else if(map[cell.x][cell.y - 1] === -2){ // server left
		path.push({'x': cell.x, 'y': cell.y - 1});
		map[cell.x][cell.y - 1] = -6;
	}

	while(path.length){
		// console.log('Path:', path);
		cell = path.shift();
		// console.log('Cell', map[cell.x][cell.y]);

		if(map[cell.x][cell.y] === -6){ // wire
			if(cell.x !== 0){ // no wall on top
				if(
					map[cell.x - 1][cell.y] === -2
				){
					map[cell.x - 1][cell.y] = -6;
					path.push({'x': cell.x - 1, 'y': cell.y});
				}else if(map[cell.x - 1][cell.y] === -3){
					path.push({'x': cell.x - 1, 'y': cell.y});
				}
			}

			if(cell.y !== config.mapSizeY * 3 - 1){ // no wall on right
				if(
					map[cell.x][cell.y + 1] === -2
				){
					map[cell.x][cell.y + 1] = -6;
					path.push({'x': cell.x, 'y': cell.y + 1});
				}else if(map[cell.x][cell.y + 1] === -3){
					path.push({'x': cell.x, 'y': cell.y + 1});
				}
			}

			if(cell.x !== config.mapSizeX * 3 - 1){ // no wall on bottom
				if(
					map[cell.x + 1][cell.y] === -2
				){
					map[cell.x + 1][cell.y] = -6;
					path.push({'x': cell.x + 1, 'y': cell.y});
				}else if(map[cell.x + 1][cell.y] === -3){
					path.push({'x': cell.x + 1, 'y': cell.y});
				}
			}

			if(cell.y !== 0){ // no wall on left
				if(
					map[cell.x][cell.y - 1] === -2
				){
					map[cell.x][cell.y - 1] = -6;
					path.push({'x': cell.x, 'y': cell.y - 1});
				}else if(map[cell.x][cell.y - 1] === -3){
					path.push({'x': cell.x, 'y': cell.y - 1});
				}
			}
		}else if(map[cell.x][cell.y] === -3){ // computer
			map[cell.x][cell.y] = -5;
			connectedComputers++;
		}
	}

	for(var i = 0; i < config.mapSizeX * 3; i++){
		for(var j = 0; j < config.mapSizeY * 3; j++){
			if(map[i][j] === -6){
				map[i][j] = -2;
			}
		}
	}

	// console.log(connectedComputers, totalComputers);

	if(connectedComputers === totalComputers){
		console.log('Winner!');
		return 'win';
	}else{
		return 0;
	}
}

var renderResponse = function(state){

	var response = '';

	var settings = '<div class="settings show"></div><div class="settings-panel">' +
				       '<div class="hide-panel">Hide Settings</div>' +
				       '<form action="/render" method="post" class="settings-form">' +
				       '<label>Level</label>' +
				       '<br/>' +
				       '<div class="level-radio">' +
				       '<input type="radio" name="level" value="easy">Easy' +
				       '</div>' +
				       '<div class="level-radio">' +
				       '<input type="radio" name="level" value="medium">Medium' +
				       '</div>' +
				       '<div class="level-radio">' +
				       '<input type="radio" name="level" value="pro">Pro' +
				       '</div>' +
				       '<label class="custom-settings-fieldset">Custom settings</label>' +
				       '<div class="settings-map-size">' +
					       '<div>Map Size:</div>' +
					       '<label>X-Axis: </label><span id="size-x"></span>' +
					       '<div id="map-size-x"></div>' +
					       '<label>Y-Axis: </label><span id="size-y"></span>' +
					       '<div id="map-size-y"></div>' +
				       '</div>' +
				       '<div class="computers-number">' +
					       '<div>Computers:</div>' +
					       '<label>Max Number: </label><span id="computers-number"></span>' +
					       '<div id="computers"></div>' +
				       '</div>' +
				       '<input type="button" id="render" value="Restart Game"/>' +
				       '</form>' +
				   '</div>';

	response += settings;

	if(state === 'win'){
		console.log('State', state);
		response += '<h1 class="win-msg">Congratulation! You won the game!</h1><div class="map">';
	}else{
		response += '<div class="map">';
	}

	// var computers = 0;

	for (var i = 0; i < config.mapSizeX; i++){
		response += '<div class="row-' + i + '" data-row="' + i + '">';
		for (var j = 0; j < config.mapSizeY; j++){
			columnClasses = '';
			// console.log(i * 3 + 1, j * 3 + 1, map[i * 3 + 1][j * 3 + 1]);
			if(map[i * 3 + 1][j * 3 + 1] === -1){ // central square =?= server
				if(map[i * 3][j * 3 + 1] === -2){ // server top
					columnClasses = ' serverTop';
				}else if(map[i * 3 + 1][j * 3 + 2] === -2){ // server right
					columnClasses = ' serverRight';
				}else if(map[i * 3 + 2][j * 3 + 1] === -2){ // server bottom
					columnClasses = ' serverBottom';
				}else if(map[i * 3 + 1][j * 3] === -2){ // server left
					columnClasses = ' serverLeft';
				}
				// response += '<div class="column-' + j + ' ' + columnClasses + '"></div>';
			}else if(map[i * 3 + 1][j * 3 + 1] === -3){  // central square =?= computer
				if(map[i * 3][j * 3 + 1] === -2){ // computer top
					columnClasses = ' computerOffTop';
				}else if(map[i * 3 + 1][j * 3 + 2] === -2){ // computer right
					columnClasses = ' computerOffRight';
				}else if(map[i * 3 + 2][j * 3 + 1] === -2){ // computer bottom
					columnClasses = ' computerOffBottom';
				}else if(map[i * 3 + 1][j * 3] === -2){ // computer left
					columnClasses = ' computerOffLeft';
				}
				// response += '<div class="column-' + j + ' ' + columnClasses + '"></div>';
			}else if(map[i * 3 + 1][j * 3 + 1] === -5){ // connected computer
				if(map[i * 3][j * 3 + 1] === -2){ // computer top
					columnClasses = ' computerOnTop';
				}else if(map[i * 3 + 1][j * 3 + 2] === -2){ // computer right
					columnClasses = ' computerOnRight';
				}else if(map[i * 3 + 2][j * 3 + 1] === -2){ // computer bottom
					columnClasses = ' computerOnBottom';
				}else if(map[i * 3 + 1][j * 3] === -2){ // computer left
					columnClasses = ' computerOnLeft';
				}
			}else if(map[i * 3 + 1][j * 3 + 1] === -2){ // wire
				if(map[i * 3][j * 3 + 1] === -2){ // vertical-line, corner-1, corner-4, t-1, t-3, t-4, cross
					if(map[i * 3 + 1][j * 3] === -2){ // corner-4, t-3, t-4, cross
						if(map[i * 3 + 1][j * 3 + 2] === -2){ // t-4, cross
							if(map[i * 3 + 2][j * 3 + 1] === -2){
								columnClasses = ' cross';
							}else{
								columnClasses = ' wireT4';
							}
						}else{ // corner-4, t-3
							if(map[i * 3 + 2][j * 3 + 1] === -2){ // t-3
								columnClasses = ' wireT3';
							}else{ // corner-4
								columnClasses = ' wireCorner4';
							}
						}
					}else{ // vertical-line, corner-1, t-1
						if(map[i * 3 + 1][j * 3 + 2] === -2){ // corner-1, t-1
							if(map[i * 3 + 2][j * 3 + 1] === -2){ // t-1
								columnClasses = ' wireT1';
							}else{ // corner-1
								columnClasses = ' wireCorner1';
							}
						}else{ // vertical-line
							columnClasses = ' wireVerticalLine';
						}
					}
				}else{ // horizontal-line, corner-2, corner-3, t-2
					if(map[i * 3 + 1][j * 3] === -2){ // horizontal-line, corner-3, t-2
						if(map[i * 3 + 1][j * 3 + 2] === -2){ // horizontal-line, t-2
							if(map[i * 3 + 2][j * 3 + 1] === -2){ // t-2
								columnClasses = ' wireT2';
							}else{ // horizontal-line
								columnClasses = ' wireHorizontalLine';
							}
						}else{ // corner-3
							columnClasses = ' wireCorner3';
						}
					}else{ // corner-2
						columnClasses = ' wireCorner2';
					}
				}
				// response += '<div class="column-' + j + ' ' + columnClasses + '"></div>';
			}
			response += '<div class="wrapper"><div class="column-' + j + columnClasses + '" data-column="' + j + '"></div></div>';
		}
		response += '</div>';
	}
	response += '</div>';

	// render schema

	schema = '<br/><br/>';

	schema += '<div class="minimap">';
		for (i = 0; i < config.mapSizeX * 3; i++){
			schema += '<div class="minirow">';
			for (j = 0; j < config.mapSizeY * 3; j++){
				schema += '<div class="minicolumn">' + map[i][j] + '</div>';
			}
			schema += '</div>';
		}
	schema += '</div>';

	// return response += schema;
	return response;
}

var renderContent = function(){
	// rendering algorythm

	renderMap();
	fillBorders();
	fillPieceCorners();

	putTheServer();

	putTheComputers(config.computersCount, tries);

	// shuffle map

	shuffleMap();

	// turn on connected computers

	var state = turnComputersOn();

	// prepare response

	return renderResponse(state);
}

module.exports = {
	'render': function(options){
		map = [];
		totalComputers = -1;

		if(typeof(options.game.level) !== 'undefined'){
			config.level = options.game.level;
			if(options.game.level === 'easy'){
				config.mapSizeX = 12;
				config.mapSizeY = 12;
				config.cellSize = 51;
				config.computersCount = 143;
			}else if(options.game.level === 'medium'){
				config.mapSizeX = 24;
				config.mapSizeY = 24;
				config.cellSize = 38;
				config.computersCount = 575;
			}else if(options.game.level === 'pro'){
				config.mapSizeX = 30;
				config.mapSizeY = 30;
				config.cellSize = 30;
				config.computersCount = 899;
			}
		}else{
			if(
				typeof(options.game.columnLength) !== 'undefined' &&
				typeof(options.game.rowLength) !== 'undefined'
			){
				config.mapSizeX = options.game.columnLength;
				config.mapSizeY = options.game.rowLength;

				if(
					typeof(options.game.computersCount) !== 'undefined' &&
					options.game.computersCount < options.game.columnLength * options.game.rowLength
				){
					config.computersCount = options.game.computersCount;
				}
			}

			if(
				typeof(options.game.cellSize) !== 'undefined'
			){
				config.cellSize = options.game.cellSize;
			}
		}

		return {"html": renderContent(), "config": config};
	},
	'rotate': function(req){

		i = req.body.row;
		j = req.body.column;
		if(map[i * 3 + 1][j * 3 + 1] === -2){
			// rotate to the right one time
			var temp = map[i * 3][j * 3 + 1];
			map[i * 3][j * 3 + 1] = map[i * 3 + 1][j * 3];
			map[i * 3 + 1][j * 3] = map[i * 3 + 2][j * 3 + 1];
			map[i * 3 + 2][j * 3 + 1] = map[i * 3 + 1][j * 3 + 2];
			map[i * 3 + 1][j * 3 + 2] = temp;
		}

		var state = turnComputersOn();

		return renderResponse(state);
	}
}