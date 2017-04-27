function ExteriorNode(x, y, position) {
	this.x = x;
	this.y = y;
	this.mouseOffsetX = 0;
	this.mouseOffsetY = 0;
	this.isJoint = false;
	this.position = position;
	this.text = (this.position == "startnode") ? "start" : "exit";
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
	if (!mouseout){
		// draw the circle
		c.beginPath();
		// c.arc(this.x, this.y, nodeRadius, 0, 2 * Math.PI, false);
		if (this.position === "startnode"){
			c.moveTo(this.x + nodeRadius, this.y);
			c.lineTo(this.x + nodeRadius*(2.5), this.y)
			
		} else {
			c.moveTo(this.x - nodeRadius, this.y);
			c.lineTo(this.x - nodeRadius*(2.5), this.y);
			
		}
		c.stroke();

		// draw the text
		if (this.position === "startnode"){
			drawArrow(c, this.x + nodeRadius*(2.3), this.y);
			drawText(c, this.text, this.x, this.y, null, selectedObject == this);
		} else {
			drawArrow(c, this.x - nodeRadius*(1.8), this.y);
			drawText(c, this.text, this.x, this.y, null, selectedObject == this);
		}
	}
};


ExteriorNode.prototype.intersectPointOnSquare = function(x, y) {
	return {
		'x': (this.position == "startnode") ? this.x + nodeRadius*(2.5) : this.x - nodeRadius*(2.5),
		'y': this.y,
	};
};

ExteriorNode.prototype.lateralPointOnSquare = function(x, y) {
	return {
		'x': (this.position == "startnode") ? this.x + nodeRadius*(2.5) : this.x - nodeRadius*(2.5),
		'y': this.y,
	};
};

ExteriorNode.prototype.containsPoint = function(x, y) {
	return (x - this.x)*(x - this.x) + (y - this.y)*(y - this.y) < nodeRadius*nodeRadius;
};
