
function Shape(position) {
    this.position = position;
};

Shape.prototype.render = function () {};

Shape.prototype.move = function (position) {
    this.position = position;
};

Shape.prototype.resize = function () {};

//Rectangle
function Rectangle(position, width, height, color) {
    Shape.call(this, position);
    this.width = width;
    this.height = height;
	this.color = color;
};

Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.render = function () {
    //drawio.ctx.fillStyle = this.color;
    drawio.ctx.beginPath();
    drawio.ctx.rect(this.position.x, this.position.y, this.width, this.height);
    drawio.ctx.stroke();
    drawio.ctx.strokeStyle=this.color;
    drawio.ctx.closePath();
};

Rectangle.prototype.resize = function(x, y) {
    this.width = x - this.position.x;
    this.height = y - this.position.y;
};

//Circle
function Circle(position, width, height, color) {
    Shape.call(this, position);
    this.width = width;
    this.height = height;
    this.color = color;
};

Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;

Circle.prototype.render = function() {
    drawio.ctx.beginPath();
    drawio.ctx.arc(this.position.x, this.position.y, Math.sqrt(this.width * this.width), 0, 2 * Math.PI);
    drawio.ctx.fillStyle = this.color;
    drawio.ctx.fill();
};

Circle.prototype.resize = function(x, y) {
    this.width = x - this.position.x;
    this.height = y - this.position.y;
};

//Line
function Line(position, width, height, color, lineWeight) {
    Shape.call(this, position);
    this.width = width;
    this.height = height;
    this.color = color;
    this.lineWeight = lineWeight;
};

Line.prototype = Object.create(Shape.prototype);
Line.prototype.constructor = Line;

Line.prototype.render = function() {
    drawio.ctx.beginPath();
    drawio.ctx.lineTo(this.position.x, this.position.y);
    drawio.ctx.lineTo(this.width, this.height);
    drawio.ctx.strokeStyle = this.color;
    drawio.ctx.lineWidth = this.lineWeight;
    drawio.ctx.stroke();
};

Line.prototype.resize = function(x, y) {
    this.width = x;
    this.height = y;
};

//Pen
function Pen(position, width, height, color, lineWeight) {
    Shape.call(this, position);
    this.width = width;
    this.height = height;
    this.xPoint = new Array;
    this.yPoint = new Array;
    this.color = color;
    this.lineWeight = lineWeight;
};

Pen.prototype = Object.create(Shape.prototype);
Pen.prototype.constructor = Pen;

Pen.prototype.render = function() {
    drawio.ctx.beginPath();
    drawio.ctx.lineTo(this.position.x, this.position.y);
    if(this.xPoint.length == this.yPoint.length){
        for (var i = 0; i < this.xPoint.length; i++) {
            drawio.ctx.lineTo(this.xPoint[i], this.yPoint[i]);
        }
    }
    drawio.ctx.strokeStyle = this.color;
    drawio.ctx.lineWidth = this.lineWeight;
    drawio.ctx.stroke();
};

Pen.prototype.resize = function(x, y) {
    this.xPoint.push(x);
    this.yPoint.push(y);
};

//https://codepen.io/saradogg95/collab/rNVOwmm?editors=0010#0
