
window.drawio = {
    shapes: [],
	unDoneShapes: [],
    selectedShape: 'pen',
    lineWidth: document.getElementById("drawing-line-width"),
    colorPick: document.getElementById('colorPicker'),
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
    //selecting tool
    $('.icon').on('click', function () {
        $('.icon').removeClass('selected');
        $(this).addClass('selected');
        drawio.selectedShape = $(this).data('shape');
    });

    $('.save').on('click',function () {
        var nameOfTemplate = prompt('Name of template to save: ');
        const shapesToSave = drawio.shapes.map(s => ({
            ...s,
            type: s.constructor.name,
        }));
        localStorage.setItem(nameOfTemplate,JSON.stringify(shapesToSave));
        
    });
    $('.load').on('click',function () {
        var loadTemplateName = prompt('Name of template to load: ');
        var lines = JSON.parse(localStorage.getItem(loadTemplateName));
        if(lines == null){
            alert('Sorry! File does not exist!');
        }else{
            drawio.shapes = [];
            drawio.selectedElement = null;

            // Recreate all elements within localStorage and insert into shapes array
            lines.forEach(line => {
               switch (line.type) {
                   case 'Circle': drawio.shapes.push(new Circle(line.position,line.width,line.height,line.color,line.lineWeight));
                   break;
                   case 'Rectangle': drawio.shapes.push(new Rectangle(line.position,line.width,line.height,line.color,line.lineWeight));
                   break;
                   case 'Line': drawio.shapes.push(new Line(line.position,line.width,line.height,line.color,line.lineWeight));
                   break;
                   case 'Pen': drawio.shapes.push(new Pen(line.position,line.width,line.height,line.color,line.lineWeight));
                   break; //check the pen. Everything else is working
                   case 'Text': drawio.shapes.push(new Text(line.position,line.text,8,line.color));
                   break;
               }
            });
            drawCanvas();
        }
    });

    $('#my-canvas').on('mousedown', function (mouseEvent) {
        switch (drawio.selectedShape) {
            case drawio.availableShapes.RECTANGLE:
                drawio.selectedElement = new Rectangle({ x: mouseEvent.offsetX, y: mouseEvent.offsetY }, 0, 0, drawio.colorPick.value, drawio.lineWidth.value);
                break;
            case drawio.availableShapes.CIRCLE:
                drawio.selectedElement = new Circle({x: mouseEvent.offsetX, y: mouseEvent.offsetY}, 0, 0, drawio.colorPick.value, drawio.lineWidth.value);
                break;
            case drawio.availableShapes.LINE:
                drawio.selectedElement = new Line({x: mouseEvent.offsetX, y: mouseEvent.offsetY}, 0, 0, drawio.colorPick.value, drawio.lineWidth.value);
                break;
            case drawio.availableShapes.PEN:
                drawio.selectedElement = new Pen({x: mouseEvent.offsetX, y: mouseEvent.offsetY}, 0, 0, drawio.colorPick.value, drawio.lineWidth.value);
                break;
            case drawio.availableShapes.TEXT:
                drawio.selectedElement = new Text({x: mouseEvent.offsetX, y: mouseEvent.offsetY}, prompt("Enter your text."), 8 , drawio.colorPick.value);
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

    var lineWidthRange = document.getElementById("drawing-line-width");
    var lineWidthOutput = document.getElementById("lineWidthInfo");
    lineWidthOutput.innerHTML = lineWidthRange.value;
    lineWidthRange.oninput = function() {
        lineWidthOutput.innerHTML = this.value;
    }
});

