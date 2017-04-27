function Link(a, b) {
	this.nodeA = a;
	this.nodeB = b;
	this.text = '';
	this.isAngled = true;
	this.lineAngleAdjust = 0; // value to add to textAngle when link is straight line

	// make anchor point relative to the locations of nodeA and nodeB
	this.parallelPart = 0.5; // percentage from nodeA to nodeB
	this.perpendicularPart = 0; // pixels from line between nodeA and nodeB
}

Link.prototype.getAnchorPoint = function() {
	var dx = this.nodeB.x - this.nodeA.x;
	var dy = this.nodeB.y - this.nodeA.y;
	var scale = Math.sqrt(dx * dx + dy * dy);
	return {
		'x': this.nodeA.x + dx * this.parallelPart - dy * this.perpendicularPart / scale,
		'y': this.nodeA.y + dy * this.parallelPart + dx * this.perpendicularPart / scale
	};
};

Link.prototype.setAnchorPoint = function(x, y) {
	var dx = this.nodeB.x - this.nodeA.x;
	var dy = this.nodeB.y - this.nodeA.y;
	var scale = Math.sqrt(dx * dx + dy * dy);
	this.parallelPart = (dx * (x - this.nodeA.x) + dy * (y - this.nodeA.y)) / (scale * scale);
	this.perpendicularPart = (dx * (y - this.nodeA.y) - dy * (x - this.nodeA.x)) / scale;
	// snap to a straight line
	if(this.parallelPart > 0 && this.parallelPart < 1 && Math.abs(this.perpendicularPart) < snapToPadding) {
		this.lineAngleAdjust = (this.perpendicularPart < 0) * Math.PI;
		this.perpendicularPart = 0;
	}
};

Link.prototype.getEndPointsAndCircle = function() {

	var midX = (this.nodeA.x + this.nodeB.x) / 2;
	var midY = (this.nodeA.y + this.nodeB.y) / 2;
	if (this.isAngled){
		var start = this.nodeA.lateralPointOnSquare(midX, midY);
	    var end = this.nodeB.lateralPointOnSquare(midX, midY);
	} else {
		var start = this.nodeA.intersectPointOnSquare(midX, midY);
	    var end = this.nodeB.intersectPointOnSquare(midX, midY);
	}
    return {
			'hasCircle': false,
			'startX': start.x,
			'startY': start.y,
			'endX': end.x,
			'endY': end.y,
			'midX': (start.x+end.x)/2,
			'midY': (start.y+end.y)/2,
	};
};

Link.prototype.draw = function(c) {
	var stuff = this.getEndPointsAndCircle();
	// draw lines
	c.beginPath();
	c.moveTo(stuff.startX, stuff.startY);
	if(this.isAngled) {
		c.lineTo(stuff.midX, stuff.startY);
		c.lineTo(stuff.midX, stuff.endY);		
		c.lineTo(stuff.endX, stuff.endY);
	} else {
		c.lineTo(stuff.endX, stuff.endY);
	}
	c.stroke();

	// draw the text
	if(stuff.hasCircle) {
		var startAngle = stuff.startAngle;
		var endAngle = stuff.endAngle;
		if(endAngle < startAngle) {
			endAngle += Math.PI * 2;
		}
		var textAngle = (startAngle + endAngle) / 2 + stuff.isReversed * Math.PI;
		var textX = stuff.circleX + stuff.circleRadius * Math.cos(textAngle);
		var textY = stuff.circleY + stuff.circleRadius * Math.sin(textAngle);
		drawText(c, this.text, textX, textY, textAngle, selectedObject == this);
	} else {
		var textX = (stuff.startX + stuff.endX) / 2;
		var textY = (stuff.startY + stuff.endY) / 2;
		var textAngle = Math.atan2(stuff.endX - stuff.startX, stuff.startY - stuff.endY);
		drawText(c, this.text, textX, textY, textAngle + this.lineAngleAdjust, selectedObject == this);
	}
};

inRangeofLine = function(x, y, x1, y1, x2, y2){ //determines if point (x,y) is in range of line between (x1,y1) (x2,y2)
	var dx = x1 - x2;
	var dy = y1 - y2;
	var length = Math.sqrt(dx*dx + dy*dy);
	var percent = (dx * (x - x2) + dy * (y - y2)) / (length * length);
	var distance = (dx * (y - y2) - dy * (x - x2)) / length;
	return (percent > 0 && percent < 1 && Math.abs(distance) < hitTargetPadding);
}

Link.prototype.containsPoint = function(x, y) {
	var stuff = this.getEndPointsAndCircle();
	if(this.isAngled) {
		nearFirst = inRangeofLine(x, y, stuff.midX, stuff.startY, stuff.startX, stuff.startY);
		nearSecond = inRangeofLine(x, y, stuff.midX, stuff.endY, stuff.midX, stuff.startY);
		nearThird = inRangeofLine(x, y, stuff.endX, stuff.endY, stuff.midX, stuff.endY);
		return nearFirst || nearSecond || nearThird;
	} else {
		return inRangeofLine(x, y, stuff.endX, stuff.endY, stuff.startX, stuff.startY);
	}
	return false;
};
