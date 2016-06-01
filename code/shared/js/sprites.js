/*
 * Copyright (C) 2012 David Geary. This code is from the book
 * Core HTML5 Canvas, published by Prentice-Hall in 2012.
 *
 * License:
 *
 * Permission is hereby granted, free of charge, to any person 
 * obtaining a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * The Software may not be used to create training material of any sort,
 * including courses, books, instructional videos, presentations, etc.
 * without the express written consent of David Geary.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
*/

// Painters...................................................................

// Painters paint sprites with a paint(sprite, context) method. ImagePainters
// paint an image for their sprite.

// 图像绘制器
// 在创建图像绘制器时需要将指向图像URL的引用传给ImagePainter构造器，只有当图像完全载入后，图像绘制器的paint()方法才会将其绘制出来
var ImagePainter = function (imageUrl) {
  // 创建一个图像对象，并指定图像的地址
   this.image = new Image;
   this.image.src = imageUrl;
};

ImagePainter.prototype = {
   image: undefined,

   // paint()方法，接受两个参数
   paint: function (sprite, context) {
    // 如果image图像存在并加载完毕
      if (this.image !== undefined) {
         if ( ! this.image.complete) {
          // 在图像加载过程中，设置图像的宽高
            this.image.onload = function (e) {
               sprite.width = this.width;
               sprite.height = this.height;
               // 绘制图像
               context.drawImage(this,  // this is image
                  sprite.left, sprite.top,
                  sprite.width, sprite.height);
            };
         }
         else {
          // 绘制图像
           context.drawImage(this.image, sprite.left, sprite.top,
                             sprite.width, sprite.height); 
         }
      }
   }
};

// 精灵表绘制器
// 精灵表绘制器接受一个数组，该数组的每一项都是精灵表中每一个单元格的位置信息，和精灵尺寸
SpriteSheetPainter = function (cells) {
   this.cells = cells;
};

SpriteSheetPainter.prototype = {
  // 一开始时精灵表索引是0
   cells: [],
   cellIndex: 0,

   advance: function () {
    // advance函数，将索引值加1
      if (this.cellIndex == this.cells.length-1) {
        // 如果当前索引值==cells.length-1，也就是已经到了最后一个精灵
        // 从0开始，cellIndex = 0
         this.cellIndex = 0;
      }
      else {
         this.cellIndex++;
      }
   },
   
   paint: function (sprite, context) {
    // paint函数用于绘制精灵
    // cell取得当前索引所对应的精灵的位置信息和尺寸
      var cell = this.cells[this.cellIndex];
      // 绘制精灵
      context.drawImage(spritesheet, cell.left, cell.top,
                                     cell.width, cell.height,
                                     sprite.left, sprite.top,
                                     cell.width, cell.height);
   }
};

// Sprite Animators...........................................................

// Sprite animators have an array of painters that they succesively apply
// to a sprite over a period of time. Animators can be started with 
// start(sprite, durationInMillis, restoreSprite)

// SpriteAnimator，精灵动画制作器，包含一个精灵绘制器的数组，
// 数组中的每个元素都是一个实现了paint(sprite,context)方法的对象，
// 这些对象都可以绘制精灵，
// 每个精灵对象都有一个专门负责其绘制的精灵绘制器
// 
// 精灵动画制作器对象每隔一段时间，
// 就会从数组中按次序选出一个绘制器对象，
// 同时还可以根据需要传入一个回调函数
// 用于在动画播放完毕时执行
// 
// 调用SpriteAnimator.start，开始播放动画，
// 该方法需要知道动画播放的精灵对象以及动画持续的毫秒数

var SpriteAnimator = function (painters, elapsedCallback) {
  // 接收两个参数：绘制器数组，回调函数，回调函数是在动画执行完毕时调用
   this.painters = painters;
   if (elapsedCallback) {
      this.elapsedCallback = elapsedCallback;
   }
};

SpriteAnimator.prototype = {
  // 设置初始值，动画持续时间为1000毫秒，开始时间0，索引0
   painters: [],
   duration: 1000,
   startTime: 0,
   index: 0,
   elapsedCallback: undefined,

   end: function (sprite, originalPainter) {
      sprite.animating = false;

      if (this.elapsedCallback) {
         this.elapsedCallback(sprite);
      }
      else {
         sprite.painter = originalPainter;
      }              
   },
   
   start: function (sprite, duration) {
    // endTime，将动画持续时间与当前事件相加，计算出动画停止时间
    // period，动画的周期，分配给每张动画图像的显示时间
      var endTime = +new Date() + duration,
          period = duration / (this.painters.length),
          interval = undefined,
          animator = this, // for setInterval() function
          originalPainter = sprite.painter,
          lastUpdate=0;

      this.index = 0;
      sprite.animating = true;
      sprite.painter = this.painters[this.index];

      requestNextAnimationFrame(function spriteAnimatorAnimate(time){
        if(time<endTime){
          // 如果当前时间小于动画结束的时间，还没到结束时间
          if((time-lastUpdate)>period){
            // 如果动画显示的时间大于应该显示的时间，绘制下一个图像
            sprite.painter=animator.painters[++animator.index];
            lastUpdate=time;
          }
          requestNextAnimationFrame(spriteAnimatorAnimate);
        }else{
          // 绘制第一张图像
          animator.end(Sprite.originalPainter);
        }
      });

      // interval = setInterval(function() {
      //    if (+new Date() < endTime) {
      //       sprite.painter = animator.painters[++animator.index];
      //    }
      //    else {
      //       animator.end(sprite, originalPainter);
      //       clearInterval(interval);
      //    }
      // }, period); 
   },
};

// Sprites....................................................................

// Sprites have a name, a painter, and an array of behaviors. Sprites can
// be updated, and painted.
//
// A sprite's painter paints the sprite: paint(sprite, context)
// A sprite's behavior executes: execute(sprite, context, time)

// 精灵
// painter属性指向Painter对象的引用
// behaviors属性指向一个对象数组
// 精灵对象有两个方法：paint，update
// update方法用于执行每个精灵的行为，执行的顺序就是这些行为被加入精灵之中的顺序
// paint方法则将精灵的绘制器代理给绘制器来做，visible属性值为true时，该方法才会生效

// Sprite构造器接收三个参数：精灵的名称，绘制器，行为数组
var Sprite = function (name, painter, behaviors) {
   if (name !== undefined)      this.name = name;
   if (painter !== undefined)   this.painter = painter;
   if (behaviors !== undefined) this.behaviors = behaviors;
 
   return this;//Sprite {name: "ball", painter: Object}
};

Sprite.prototype = {
   left: 0,
   top: 0,
   width: 10,
   height: 10,
	velocityX: 0,
	velocityY: 0,
   visible: true,
   animating: false,
   painter: undefined, // object with paint(sprite, context)
   behaviors: [], // objects with execute(sprite, context, time)

	paint: function (context) {
    // paint方法接收一个参数，绘图环境上下文
    // 如果有绘制器，并且可见
     if (this.painter !== undefined && this.visible) {
      // 执行传入精灵对象的绘制器函数，函数又一个paint()方法
      // this是sprite，context绘图环境
        this.painter.paint(this, context);
     }
	},

   update: function (context, time) {
      for (var i = this.behaviors.length; i > 0; --i) {
         this.behaviors[i-1].execute(this, context, time);
      }
   }
};
