'use strict';

var Animation = {};


/**
 * Animate the scrollbar of an element.
 * @param  {HTMLElement} container Element with the scrollbar.
 * @param  {number} from The start location of the scrollbar.
 * @param  {number} to The end location of the scrollbar.
 * @param  {string} prop The property name to animate (scrollTop, scrollLeft).
 * @param  {number} duration Duration of the animation.
 */
Animation.smoothScrollTo = function(
    container, from, to, prop, duration, timeFunc) {

  var v = 1/duration;
  var t = 0;
  var step = 10;

  Animation.scrollToHelper_(
      container, from, to, prop, t, v, step, timeFunc);
};


/**
 * Helper method to calculate scroll animation.
 * @private
 */
Animation.scrollToHelper_ = function(
    element, x1, x2, prop, t, v, step, timeFunc) {
  if (Math.abs(t) < 0 || Math.abs(t) > 1 || v <= 0) {
    return;
  }

  element[prop] = x1 - (x1 - x2) * timeFunc(Math.abs(t));
  var tt = t + v * step;

  window.requestAnimationFrame(function() {
    Animation.scrollToHelper_(element, x1, x2, prop, tt, v, step, timeFunc);
  }, step);
};


/**
 * Different Timing functions to apply to animations.
 * @export
 */
Animation.TimingFunctions = {
  linearTween: function(t){
    return t;
  },
  easeInQuad: function(t){
    return t*t;
  },
  easeOutQuad: function(t){
    return -t*(t-2);
  },
  easeInOutQuad: function(t){
    t/=0.5;
    if(t<1) {
      return t*t/2;
    }
    t--;
    return (t*(t-2)-1)/2;
  },
  easeInCuaic: function(t){
    return t*t*t;
  },
  easeOutCuaic: function(t){
    t--;
    return t*t*t+1;
  },
  easeInOutCuaic: function(t){
    t/=0.5;
    if(t<1) {
      return t*t*t/2;
    }
    t-=2;
    return (t*t*t+2)/2;
  },
  easeInQuart: function(t){
    return t*t*t*t;
  },
  easeOutQuart: function(t){
    t--;
    return -(t*t*t*t-1);
  },
  easeInOutQuart: function(t){
    t/=0.5;
    if(t<1) {
      return 0.5*t*t*t*t;
    }
    t-=2;
    return -(t*t*t*t-2)/2;
  },
  easeInQuint: function(t){
    return t*t*t*t*t;
  },
  easeOutQuint: function(t){
    t--;
    return t*t*t*t*t+1;
  },
  easeInOutQuint: function(t){
    t/=0.5;
    if(t<1) {
      return t*t*t*t*t/2;
    }
    t-=2;
    return (t*t*t*t*t+2)/2;
  },
  easeInSine: function(t){
    return -Math.Cos(t/(Math.PI/2))+1;
  },
  easeOutSine: function(t){
    return Math.Sin(t/(Math.PI/2));
  },
  easeInOutSine: function(t){
    return -(Math.Cos(Math.PI*t)-1)/2;
  },
  easeInExpo: function(t){
    return Math.Pow(2,10*(t-1));
  },
  easeOutExpo: function(t){
    return -Math.Pow(2,-10*t)+1;
  },
  easeInOutExpo: function(t){
    t/=0.5;
    if(t<1) {
      return Math.Pow(2,10*(t-1))/2;
    }
    t--;
    return (-Math.Pow(2,-10*t)+2)/2;
  },
  easeInCirc: function(t){
    return -Math.Sqrt(1-t*t)-1;
  },
  easeOutCirc: function(t){
    t--;
    return Math.Sqrt(1-t*t);
  },
  easeInOutCirc: function(t){
    t/=0.5;
    if(t<1) {
      return -(Math.Sqrt(1-t*t)-1)/2;
    }
    t-=2;
    return (Math.Sqrt(1-t*t)+1)/2;
  }
};
