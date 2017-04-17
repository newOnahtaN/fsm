function ExteriorExteriorNode(x, y, isStart) {
	this.x = x;
	this.y = y;
	this.mouseOffsetX = 0;
	this.mouseOffsetY = 0;
	this.isStart = isStart;
	this.text = '';
}

ExteriorNode.prototype.setMouseStart = function(x, y) {
	this.mouseOffsetX = this.x - x;
	this.mouseOffsetY = this.y - y;
};

ExteriorNode.prototype.setAnchorPoint = function(x, y) {
	this.x = x + this.mouseOffsetX;
	this.y = y + this.mouseOffsetY;
};

ExteriorNode.prototype.draw = function(c) {
	// draw the circle
	c.beginPath();
	// c.arc(this.x, this.y, nodeRadius, 0, 2 * Math.PI, false);
	c.moveTo(this.x + nodeRadius, this.y);
	c.lineTo(this.x + nodeRadius*3, this.y)
	c.stroke();

	// draw the text
	drawText(c, this.text, this.x, this.y, null, selectedObject == this);
};

// ExteriorNode.prototype.closestPointOnCircle = function(x, y) {
// 	var dx = x - this.x;
// 	var dy = y - this.y;
// 	var scale = Math.sqrt(dx * dx + dy * dy);
// 	return {
// 		'x': this.x + dx * nodeRadius / scale,
// 		'y': this.y + dy * nodeRadius / scale,
// 	};
// };

ExteriorNode.prototype.intersectPointOnSquare = function(x, y) {
	return {
		'x': this.x + nodeRadius*3,
		'y': this.y,
	};
};

ExteriorNode.prototype.lateralPointOnSquare = function(x, y) {
	var closex = this.x;
	var closey = this.y;

	if (this.isJoint) {
	} else if (x < this.x - nodeRadius){
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

ExteriorNode.prototype.containsPoint = function(x, y) {
	return (x - this.x)*(x - this.x) + (y - this.y)*(y - this.y) < nodeRadius*nodeRadius;
};
