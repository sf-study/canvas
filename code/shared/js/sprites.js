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

var ImagePainter = function (imageUrl) {
   this.image = new Image;
   this.image.src = imageUrl;
};

ImagePainter.prototype = {
   image: undefined,

   paint: function (sprite, context) {
      if (this.image !== undefined) {
         if ( ! this.image.complete) {
            this.image.onload = function (e) {
               sprite.width = this.width;
               sprite.height = this.height;
               
               context.drawImage(this,  // this is image
                  sprite.left, sprite.top,
                  sprite.width, sprite.height);
            };
         }
         else {
           context.drawImage(this.image, sprite.left, sprite.top,
                             sprite.width, sprite.height); 
         }
      }
   }
};

SpriteSheetPainter = function (cells) {
   this.cells = cells;
};

SpriteSheetPainter.prototype = {
   cells: [],
   cellIndex: 0,

   advance: function () {
      if (this.cellIndex == this.cells.length-1) {
         this.cellIndex = 0;
      }
      else {
         this.cellIndex++;
      }
   },
   
   paint: function (sprite, context) {
      var cell = this.cells[this.cellIndex];
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

// SpriteAnimator对象包含一个精灵绘制器的数组，
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
   this.painters = painters;
   if (elapsedCallback) {
      this.elapsedCallback = elapsedCallback;
   }
};

SpriteAnimator.prototype = {
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
          if((time-lastUpdate)>period){
            sprite.painter=animator.painters[++animator.index];
            lastUpdate=time;
          }
          requestNextAnimationFrame(spriteAnimatorAnimate);
        }else{
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
     if (this.painter !== undefined && this.visible) {
        this.painter.paint(this, context);
     }
	},

   update: function (context, time) {
      for (var i = this.behaviors.length; i > 0; --i) {
         this.behaviors[i-1].execute(this, context, time);
      }
   }
};
