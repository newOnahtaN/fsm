function Node(x, y) {
	this.x = x;
	this.y = y;
	this.mouseOffsetX = 0;
	this.mouseOffsetY = 0;
	this.isJoint = false;
	this.position = "interiornode"
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
	if (!this.isJoint){
		c.rect(this.x-nodeRadius, this.y-nodeRadius, nodeRadius*2, nodeRadius*2)
	} else {
		c.rect(this.x-(nodeRadius/4), this.y-(nodeRadius/4), nodeRadius/2, nodeRadius/2)
	}
	c.stroke();

	// draw the text
	if (!this.isJoint){
		drawText(c, this.text, this.x, this.y, null, selectedObject == this);
	}

};

Node.prototype.intersectPointOnSquare = function(x, y) {
	if (this.isJoint) {
		retx = this.x;
		rety = this.y;
	} else if (this.x == x){
		retx = this.x;
		rety = (y > this.y) ? this.y + nodeRadius : this.y - nodeRadius;
	} else {
		this.y = -this.y,  y = -y;
		normx = x - this.x;
		normy = y - this.y;
		slope = (y-this.y)/(x-this.x);
		
		if (normx > 0 && (-normx <= normy) && (normy <= normx)){ //right
			retx = this.x + nodeRadius;
			rety = slope*(retx - this.x) + this.y;
		} else if (normx < 0 && (normx <= normy) && (normy <= -normx)){ //left
			retx = this.x - nodeRadius;
			rety = slope*(retx - this.x) + this.y;
		} else if (normy > 0 && (-normy < normx) && (normx < normy)){ //top
			rety = this.y + nodeRadius;
			retx = (rety - this.y + slope*this.x)/slope;
		} else if (normy < 0 && (normy < normx) && (normx < -normy)){ //bottom
			rety = this.y - nodeRadius;
			retx = (rety - this.y + slope*this.x)/slope;
		}
		this.y = -this.y,  rety = -rety;
	}
	return {
		'x': retx,
		'y': rety,
	};
};

Node.prototype.lateralPointOnSquare = function(x, y) {
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

Node.prototype.containsPoint = function(x, y) {
	return (x - this.x)*(x - this.x) + (y - this.y)*(y - this.y) < nodeRadius*nodeRadius;
};
