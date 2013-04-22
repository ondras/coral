var Coral = OZ.Class();
Coral.prototype.init = function(e) {
	this._button = OZ.Event.target(e);
	this._buttonValue = this._button.innerHTML;
	this._button.innerHTML = "0";
	this._button.disabled = true;
	
	this._size = [parseInt(OZ.$("width").value), parseInt(OZ.$("height").value)];
	var canvas = OZ.$("canvas");
	canvas.width = this._size[0];
	canvas.height = this._size[1];
	this._context = canvas.getContext("2d");
	
	this._data = [];
	this._timeout = null;

	this._simulate();
}

Coral.prototype._draw = function() {
	var id = this._context.createImageData(this._size[0], this._size[1]);
	var index = 0;
	var color = parseInt(OZ.$("color").value);
	var age = parseInt(OZ.$("age").value)* 4 / 3;
	
	for (var j=0;j<this._size[1];j++) {
		for (var i=0;i<this._size[0];i++) {
			var value = this._data[i][j];
			id.data[index+3] = 255;
			if (value) {
				id.data[index+0] = 0;
				id.data[index+1] = 0;
				id.data[index+2] = 0;
				switch (color) {
					case 0: break;
					case 1:
					case 2:
					case 3:
						id.data[index+color-1] = Math.round(255*value/age);
					break;
					case 4:
						var hue = 360*value/age;
						var rgb = hsv2rgb(hue % 360, 1, 0.8);
						id.data[index+0] = Math.round(256*rgb[0]);
						id.data[index+1] = Math.round(256*rgb[1]);
						id.data[index+2] = Math.round(256*rgb[2]);
					break;
				}
			} else {
				id.data[index+0] = 255;
				id.data[index+1] = 255;
				id.data[index+2] = 255;
			}
			
			
			index+=4;		
		}
	}
	this._context.putImageData(id, 0, 0);
}

Coral.prototype._simulate = function() {
	this._initData();
	this._draw();

	this._worker = new Worker("worker.js");
	OZ.Event.add(this._worker, "message", this._response.bind(this));
	
	var rounds = parseInt(OZ.$("age").value);
	this._worker.postMessage({rounds:rounds, data:this._data});
}

Coral.prototype._response = function(e) {
	if (typeof(e.data) == "number") {
		this._button.innerHTML = e.data;
		return;
	}
	
	this._button.disabled = false;
	this._button.innerHTML = this._buttonValue;
	
	this._data = e.data;
	this._draw();
}

Coral.prototype._initData = function() {
	var cx = this._size[0]/2;
	var cy = this._size[1]/2;
	
	/*
	var pool = [];
	var r = OZ.$("random").value.split("");
	while (r.length) {
		var val = r.shift().charCodeAt(0) & 0xFF;
		var binary = val.toString(2).split("");
		while (binary.length < 0) { binary.unshift("0"); }
		while (binary.length) {
			pool.push(binary.shift() == "1" ? 1 : 0);
		}
	}
	*/
	
	for (var i=0;i<this._size[0];i++) {
		this._data.push([]);
		for (var j=0;j<this._size[1];j++) {
			var distx = (i-cx)/cx; 
			var disty = (j-cy)/cy;
			var dist = Math.sqrt(distx*distx + disty*disty); /* 0 - center, 1 - distant */


			var value = (Math.random() > dist ? 1 : 0);
			this._data[i].push(value);
		}
	}
}

function hsv2rgb(h,s,v) {
	var hi = Math.floor(h/60) % 6;
	var f = h/60 - hi;
	var p = v * (1 - s);
	var q = v * (1 - f*s);
	var t = v * (1 - (1 - f)*s);
	switch (hi) {
		case 0: return [v,t,p]; break;
		case 1: return [q,v,p]; break;
		case 2: return [p,v,t]; break;
		case 3: return [p,q,v]; break;
		case 4: return [t,p,v]; break;
		case 5: return [v,p,q]; break;
	}
}

if (window.Worker) {
	OZ.Event.add(OZ.$("go"), "click", function(e) { new Coral(e); });
} else {
	alert("Web Workers not supported, sorry.");
}
