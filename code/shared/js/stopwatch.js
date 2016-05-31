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

// Stopwatch..................................................................
//
// Like the real thing, you can start and stop a stopwatch, and you can
// find out the elapsed time the stopwatch has been running. After you stop
// a stopwatch, it's getElapsedTime() method returns the elapsed time
// between the start and stop.
//
// Stopwatches are used primarily for timing animations.

// 创建对象
Stopwatch = function ()  {
};

// You can get the elapsed time while the timer is running, or after it's
// stopped.

Stopwatch.prototype = {
   // 开始时间，是否动画，
   startTime: 0,
   running: false,
   elapsed: undefined,

   // 开始动画，this.running = true
   // 开始动画时获取时间
   // elapsedTime，已经过去的时间，undefined
   start: function () {
      this.startTime = +new Date();
      this.elapsedTime = undefined;
      this.running = true;
   },

   // 设置this.running = false，停止动画
   // 当前过去的时间elapsed，为当前时间减去开始时间
   stop: function () {
      this.elapsed = (+new Date()) - this.startTime;
      this.running = false;
   },

   // 获取过去的时间
   // 如果动画还在执行，当前时间减去开始时间
   // 如果动画已经结束，elapsed
   getElapsedTime: function () {
      if (this.running) {
         return (+new Date()) - this.startTime;
      }
      else {
        return this.elapsed;
      }
   },

   // 该函数用于获取动画是否在执行
   isRunning: function() {
      return this.running;
   },

   // 重置已经过去的时间
   reset: function() {
     this.elapsed = 0;
   }
};
