/**
 * @author Administrator
 */
var context = document.getElementById('canvas').getContext('2d');
function drawDashedLine(context, x1, y1, x2, y2, dashedLength) {
	dashedLength = dashedLength === undefined ? 5 : dashedLength;

	var deltaX = x2 - x1;
	var deltaY = y2 - y1;
	var numDashes = Math.floor(Math.sqrt(deltaX * deltaX + deltaY * deltaY) / dashedLength);
	for (var i = 0; i < numDashes; i++) {
		context[i%2===0?'moveTo':'lineTo'](x1 + (deltaX / numDashes) * i, y1 + (deltaY / numDashes) * i);
	}
	context.stroke();
}

context.lineWidth = 3;
context.strokeStyle = 'pink';
drawDashedLine(context, 20, 20, context.canvas.width-20, 20); 
drawDashedLine(context, context.canvas.width-20, 20, context.canvas.width-20, context.canvas.height-20, 20);
drawDashedLine(context, context.canvas.width-20, context.canvas.height-20, 20,context.canvas.height-20,15);
drawDashedLine(context, 20, context.canvas.height-20, 20,20 , 2);