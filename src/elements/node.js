function Node(x, y) {
	this.x = x;
	this.y = y;
	this.mouseOffsetX = 0;
	this.mouseOffsetY = 0;
	this.isAcceptState = false;
	this.text = '';
}

Node.prototype.setMouseStart = function(x, y) {
	this.mouseOffsetX = this.x - x;
	this.mouseOffsetY = this.y - y;
};

Node.prototype.setAnchorPoint = function(x, y) {
	this.x = x + this.mouseOffsetX;
	this.y = y + this.mouseOffsetY;
};

Node.prototype.draw = function(c) {
	// draw the circle
	c.beginPath();
	// c.arc(this.x, this.y, nodeRadius, 0, 2 * Math.PI, false);
	c.rect(this.x-nodeRadius, this.y-nodeRadius, nodeRadius*2, nodeRadius*2)
	c.stroke();

	// draw the text
	drawText(c, this.text, this.x, this.y, null, selectedObject == this);

	// draw a double circle for an accept state
	if(this.isAcceptState) {
		c.beginPath();
		c.arc(this.x, this.y, nodeRadius - 6, 0, 2 * Math.PI, false);
		c.stroke();
	}
};

// Node.prototype.closestPointOnCircle = function(x, y) {
// 	var dx = x - this.x;
// 	var dy = y - this.y;
// 	var scale = Math.sqrt(dx * dx + dy * dy);
// 	return {
// 		'x': this.x + dx * nodeRadius / scale,
// 		'y': this.y + dy * nodeRadius / scale,
// 	};
// };

Node.prototype.intersectPointOnSquare = function(x, y) {
	normx = x - this.x;
	normy = y - this.y;
	slope = (x-this.x)/(y-this.y);
	if (normx > 0 && -normx <= normy && normy <= normx){ //right
		retx = this.x + nodeRadius;
		rety = slope*(retx - this.x) - this.y
	} else if (normx < 0 && normx <= normy && normy <= -normx){ //left
		retx = this.x - nodeRadius;
		rety = slope*(retx - this.x) - this.y
	} else if (normy > 0 && -normy < normx && normx < normy){ //top
		rety = this.y + nodeRadius;
		retx = (rety - this.y + slope*this.x)/slope
	} else if (normy < 0 && normy < normx && normx < -normy){ //bottom
		rety = this.y - nodeRadius;
		retx = (rety - this.y + slope*this.x)/slope
	}
	return {
		'x': retx,
		'y': rety,
	};
};

Node.prototype.lateralPointOnSquare = function(x, y) {
	var closex = this.x;
	var closey = this.y;

	if (x < this.x - nodeRadius){
		closex = this.x - nodeRadius;
	} else if (x > this.x + nodeRadius){
		closex = this.x + nodeRadius;
	} else if (y < this.y){
		closey = this.y - nodeRadius
	} else if (y > this.y){
		closey = this.y + nodeRadius
	}

	return {
		'x': closex,
		'y': closey,
	};
};

Node.prototype.containsPoint = function(x, y) {
	return (x - this.x)*(x - this.x) + (y - this.y)*(y - this.y) < nodeRadius*nodeRadius;
};
