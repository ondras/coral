onmessage = function(e) {
	var rounds = e.data.rounds;
	var index = 0;
	var data1 = e.data.data;
	var data2 = [];
	var w = data1.length;
	var h = data1[0].length;
	
	
	for (var i=0;i<w;i++) {
		data2.push([]);
		for (var j=0;j<h;j++) { data2[i].push(0); }
	}
	
	for (var i=0;i<rounds;i++) {
		postMessage(rounds-i);
		(i % 2 ? round(data2, data1, w, h) : round(data1, data2, w, h));
	}
	
	postMessage(i % 2 ? data2 : data1);
}

var dir = [
	[ 0, -1],
	[ 1, -1],
	[ 1,  0],
	[ 1,  1],
	[ 0,  1],
	[-1,  1],
	[-1,  0],
	[-1, -1]
];


var round = function(source, target, w, h) {
	var d = dir;
	var x, y, i, j;
	
	for (i=0;i<w;i++) {
		for (j=0;j<h;j++) {
			var value = source[i][j];
			var neighbors = 0;
			for (var k=0;k<8;k++) {
				x = (i+d[k][0]+w) % w;
				y = (j+d[k][1]+h) % h;
				if (source[x][y]) { neighbors++; }
			}
			
			if (value) {
				target[i][j] = (neighbors > 3 ? value+1 : 0);
			} else {
				target[i][j] = (neighbors == 3 ? 1 : 0);
			}
			
		}
	}

}
