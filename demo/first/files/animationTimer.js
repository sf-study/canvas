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

// AnimationTimer..................................................................
//
// An animation runs for a duration, in milliseconds. It's up to you,
// however, to start and stop the animation -- animations do not stop
// automatically. You can check to see if an animation is over with the
// isOver() method, and you can see if an animation is running with
// isRunning(). Note that animations can be over, but still running.
//
// You can also supply an optional timeWarp function that warps the percent
// completed for the animation. That warping lets you do easily incorporate
// non-linear motion, such as: ease-in, ease-out, elastic, etc.

// 接受两个参数，
// duration，动画的持续时间
// timeWarp
AnimationTimer = function (duration, timeWarp)  {
   this.timeWarp = timeWarp;

   if (duration !== undefined) this.duration = duration;
   else                        this.duration = 1000;

   // 创建一个对象
   this.stopwatch = new Stopwatch();
};

AnimationTimer.prototype = {
   // 开始
   start: function () {
      this.stopwatch.start();
   },

   // 结束
   stop: function () {
      this.stopwatch.stop();
   },

   // 获取经过的时间
   getRealElapsedTime: function () {
      return this.stopwatch.getElapsedTime();
   },
   
   // 
   getElapsedTime: function () {
      // elapsedTime，获取经过的时间
      // percentComplete，已经完成的百分比
      var elapsedTime = this.stopwatch.getElapsedTime(),
          percentComplete = elapsedTime / this.duration;

      // 如果动画正在播放，return undefined
      if (!this.stopwatch.running)    return undefined;
      // 
      if (this.timeWarp == undefined) return elapsedTime;

      return elapsedTime * (this.timeWarp(percentComplete) / percentComplete);
   },

   // 该函数用于获取动画是否在执行
   isRunning: function() {
      return this.stopwatch.running;
   },
   
   // 动画已经播放的秒数是否大于动画持续的时间，判断动画是否结束
   isOver: function () {
      return this.stopwatch.getElapsedTime() > this.duration;
   },

   // 重置已经过去的时间
   reset: function() {
      this.stopwatch.reset();
   }
};

AnimationTimer.makeEaseOut = function (strength) {
   return function (percentComplete) {
      return 1 - Math.pow(1 - percentComplete, strength*2);
   };
};

AnimationTimer.makeEaseIn = function (strength) {
   return function (percentComplete) {
      return Math.pow(percentComplete, strength*2);
   };
};

AnimationTimer.makeEaseInOut = function () {
   return function (percentComplete) {
      return percentComplete - Math.sin(percentComplete*2*Math.PI) / (2*Math.PI);
   };
};

AnimationTimer.makeElastic = function (passes) {
   passes = passes || 3;
   return function (percentComplete) {
       return ((1-Math.cos(percentComplete * Math.PI * passes)) *
               (1 - percentComplete)) + percentComplete;
   };
};

AnimationTimer.makeBounce = function (bounces) {
   var fn = AnimationTimer.makeElastic(bounces);
   return function (percentComplete) {
      percentComplete = fn(percentComplete);
      return percentComplete <= 1 ? percentComplete : 2-percentComplete;
   }; 
};

AnimationTimer.makeLinear = function () {
   return function (percentComplete) {
      return percentComplete;
   };
};
