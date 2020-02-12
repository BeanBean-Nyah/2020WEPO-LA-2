
window.drawio = {
  shapes: [],
	unDoneShape: [],
    selectedShape: 'rectangle',
	//color: "Black"
	//LineWeight: TODO
	canvas: document.getElementById('my-canvas'),
  ctx: document.getElementById('my-canvas').getContext('2d'),
  selectedElement: null,
  availableShapes: {
      RECTANGLE: 'rectangle',
      CIRCLE: 'circle',
      LINE: 'line',
      PEN: 'pen',
      TEXT: 'text'
  }
};

$(function () {

	//all objects drawn
    function drawCanvas() {
        drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
        if (drawio.selectedElement) {
            drawio.selectedElement.render();
        }
        for (var i = 0; i < drawio.shapes.length; i++) {
            drawio.shapes[i].render();
        }
    };

    $('.icon').on('click', function () {
        $('.icon').removeClass('selected');
        $(this).addClass('selected');
        drawio.selectedShape = $(this).data('shape');
    });

    $('#my-canvas').on('mousedown', function (mouseEvent) {
        switch (drawio.selectedShape) {
            case drawio.availableShapes.RECTANGLE:

                drawio.selectedElement = new Rectangle({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, 0, 0,);
                break;
			case drawio.availableShapes.CIRCLE:
                drawio.selectedElement = new Circle({x: mouseEvent.offsetX, y: mouseEvent.offsetY}, 0, 0 );
                break;
            case drawio.availableShapes.LINE:
                drawio.selectedElement = new Line({x: mouseEvent.offsetX, y: mouseEvent.offsetY}, 0, 0);
                break;
            case drawio.availableShapes.PEN:
                drawio.selectedElement = new Pen({x: mouseEvent.offsetX, y: mouseEvent.offsetY}, 0, 0);
                break;
            case drawio.availableShapes.TEXT:
                drawio.selectedElement = new Text({x: mouseEvent.offsetX, y: mouseEvent.offsetY}, prompt("Enter your text."));
                drawio.shapes.push(drawio.selectedElement);
                drawio.selectedElement = null;
                drawCanvas();
                break;
        }
    });

    $('#my-canvas').on('mousemove', function (mouseEvent) {
        if (drawio.selectedElement) {
            drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
            drawio.selectedElement.resize(mouseEvent.offsetX, mouseEvent.offsetY);
            drawCanvas();
        }

    });

    $('#my-canvas').on('mouseup', function (mouseEvent) {
        drawio.shapes.push(drawio.selectedElement);
        console.log(drawio.shapes);
        drawio.selectedElement = null;
    });

	 //undo
    $('.undo').on('click', function () {
        if (drawio.shapes.length > 0) {
            drawio.unDoneShapes.push(drawio.shapes.pop());
            drawCanvas();
        } else {
            alert("Nothing to undo");
        }

    });

    //redo
    $('.redo').on('click', function () {
        if (drawio.unDoneShapes.length > 0) {
            drawio.shapes.push(drawio.unDoneShapes.pop());
            drawCanvas();
        } else {
              alert("Nothing to redo");
        }
    });

});

// #############################
function Shape(position) {
    this.position = position;
};
function clearCanvas(){
	ctx.clearRect(0, 0, 900, 700);
	drawio.shapes = [];
}

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
	//this.color = color;
};

Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.render = function () {
    //drawio.ctx.fillStyle = this.color;
    drawio.ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
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
