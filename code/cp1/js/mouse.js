/**
 * @author Administrator
 */
var canvas=document.getElementById('canvas'),
readout=document.getElementById('readout'),
context=canvas.getContext('2d'),
spritesheet=new Image();
//functions
function windowToCanvas(canvas,x,y){
	
	var bbox=canvas.getBoundingClientRect();
	//canvas有两套尺寸，一套是元素本身的宽高，另一套是绘图表面的宽高；若两者一样大小(canvas.width/bbox.width)=1
	return{x:x-bbox.left*(canvas.width/bbox.width),
		y:y-bbox.top*(canvas.height/bbox.height)};
		
}
//把鼠标的左边写入readout
function updataReadout(x,y){
	readout.innerText='('+x.toFixed(0)+','+y.toFixed(0)+')';
	//toFixed() 方法可把 Number 四舍五入为指定小数位数的数字。此处把数字四舍五入为没有小数点的整数
}
function darwVerticalLine(x){
	context.beginPath();//beginPath()选择一条路径，或者重置当前路径
	context.moveTo(x+0.5,0);//moveTo(),把路径移动到指定地点,不绘制路线
	context.lineTo(x+0.5,context.canvas.height);//lineTo(),添加一个新的点，然后在画布中创建从改点到最后指定的线条
	context.stroke();//绘制以定义的路径
}
function drawHorizentaLine(y){
	context.beginPath();//beginPath()选择一条路径，或者重置当前路径
	context.moveTo(0,y+0.5);//moveTo(),把路径移动到指定地点,不绘制路线
	context.lineTo(context.canvas.width,y+0.5);//lineTo(),添加一个新的点，然后在画布中创建从改点到最后指定的线条
	context.stroke();//绘制以定义的路径
}
function drawGuidelines(x,y){
	context.strokeStyle='(0,0,230,0.8)';
	//strokeStyle,用于返回笔触的颜色，模式或者渐变
	context.lineWidth=0.5;
	darwVerticalLine(x);
	drawHorizentaLine(y);
	
}

function drawBackground() {
   var VERTICAL_LINE_SPACING = 12,
       i = context.canvas.height;
   
   context.clearRect(0,0,canvas.width,canvas.height);
   context.strokeStyle='(0,0,230,0.8)';
   context.lineWidth = 0.5;

   while(i > VERTICAL_LINE_SPACING*4) {
      context.beginPath();
      context.moveTo(0, i);
      context.lineTo(context.canvas.width, i);
      context.stroke();
      i -= VERTICAL_LINE_SPACING;
   }
}

canvas.onmousemove=function(e){
	var loc=windowToCanvas(canvas,e.clientX,e.clientY);
	drawBackground();
	updataReadout(loc.x,loc.y);
	drawGuidelines(loc.x,loc.y);
};
drawBackground();