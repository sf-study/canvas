/**
 * @author Administrator
 */
var context = document.getElementById('canvas').getContext('2d');
//获取指向绘图环境对象中moveTo（）方法 的引用
var moveToFunction = CanvasRenderingContext2D.prototype.moveTo;
//像canvas绘图环境中增加一个名为lastMoveToLocation的属性
CanvasRenderingContext2D.prototype.lastMoveToLocation = {};
//重新定义绘图环境中moveTo()方法，将传给该方法的坐标点保存到lastMoveToLocation的属性中
CanvasRenderingContext2D.prototype.moveTo = function(x, y) {
	moveToFunction.apply(context, [x, y]);
	this.lastMoveToLocation.x = x;
	this.lastMoveToLocation.y = y;
};
CanvasRenderingContext2D.prototype.dashedLineTo = function(x, y, deshLength) {
	var dashLength = dashLength === undefined ? 5 : dashLength;

	var startX = this.lastMoveToLocation.x;
	var startY = this.lastMoveToLocation.y;

	var deltaX = x - startX;
	var deltaY = y - startY;
	var numDashes = Math.floor(Math.sqrt(deltaX * deltaX + deltaY * deltaY) / dashLength);
	for (var i = 0; i < numDashes; i++) {
		this[i%2===0?'moveTo':'lineTo'](startX + (deltaX / numDashes) * i, startY + (deltaY / numDashes) * i);
	}
	this.moveTo(x, y);
};

context.lineWidth = 3;
context.strokeStyle = 'pink';
context.moveTo(20, 20);
context.dashedLineTo(context.canvas.width-20, 20);
context.dashedLineTo(context.canvas.width - 20, context.canvas.height - 20);
context.stroke(); 