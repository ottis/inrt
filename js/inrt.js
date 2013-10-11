_ns("inrt.scroller");

//
// Initialization
//

inrt.scroller = function(cfg)
{
  this.el = document.getElementById(cfg.elementId);

  this.startX = 0;
  this.startY = 0;
  this.offsetX = 0;
  this.offsetY = 0;
  this.velocity = { x: 0, y: 0 };
  this.scrollTimer = 0;

  this.invertMovement = cfg.invertMovement || false;
  this.defaultDrag = cfg.defaultDrag || 0.9;
  this.maxScrollSpeed = cfg.maxScrollSpeed || 40;

  this.el.onmousedown = delegate(this, this.onMouseDown);

  // touch device support
  this.el.addEventListener("touchstart", delegate(this, this.onTouchStart));
};

//
// Events
//

// on mouse down
inrt.scroller.prototype.onMouseDown = function(e)
{
  if(e == null)
  {
    e = window.event;
  }

  var t = e.target != null ? e.target : e.srcElement;

  if(e.button == 1 && window.event != null || e.button == 0)
  {
    this.setStartPos(e.clientX, e.clientY);

    document.onmousemove = delegate(this, this.onMouseMove);
    document.onmouseup = delegate(this,this.onMouseUp);
    
    return false;
  }
};

// on mouse move
inrt.scroller.prototype.onMouseMove = function(e)
{
  if(e == null)
  {
    e = window.event;
  }

  this.updateScrollPos(e.clientX, e.clientY);
};

// on mouse up
inrt.scroller.prototype.onMouseUp = function(e)
{
  document.onmousemove = null;
  document.onmouseup = null;

  this.finish();
};

// on touch start
inrt.scroller.prototype.onTouchStart = function(e)
{
  e.preventDefault();

  if(e.changedTouches)
  {
    var t = e.changedTouches[0];

    this.setStartPos(t.clientX, t.clientY);

    this.tempMove = delegate(this, this.onTouchMove);
    this.tempEnd = delegate(this, this.onTouchEnd);

    document.addEventListener("touchmove", this.tempMove);
    document.addEventListener("touchend", this.tempEnd);
  }
};

// on touch move
inrt.scroller.prototype.onTouchMove = function(e)
{
  e.preventDefault();

  if(e.changedTouches)
  {
    var t = e.changedTouches[0];
    this.updateScrollPos(t.clientX, t.clientY);
  }
};

// on touch end
inrt.scroller.prototype.onTouchEnd = function(e)
{
  e.preventDefault();

  document.removeEventListener("touchmove", this.tempMove);
  document.removeEventListener("touchend", this.tempEnd);

  this.tempMove = this.tempEnd = null;

  this.finish();
};

//
// Implementation
//

// update scroll pos
inrt.scroller.prototype.updateScrollPos = function(x, y)
{
  var oldX = this.el.scrollLeft;
  var oldY = this.el.scrollTop;

  var invert = this.invertMovement ? -1 : 1;
  this.el.scrollLeft = (this.offsetX + invert * (- x + this.startX));
  this.el.scrollTop = (this.offsetY + invert * (- y + this.startY));

  this.velocity = { x: this.el.scrollLeft - oldX, y: this.el.scrollTop - oldY };
};

// set start pos
inrt.scroller.prototype.setStartPos = function(x, y)
{
  this.startX = x;
  this.startY = y;

  this.velocity = {x: 0, y: 0};

  this.offsetX = this.el.scrollLeft;
  this.offsetY = this.el.scrollTop;
};

// cap speed
inrt.scroller.prototype.capSpeed = function(value)
{
  var res = 0;

  if(Math.abs(value) > this.maxScrollSpeed)
  {
    res = this.maxScrollSpeed;
    res *= (value < 0 ? -1 : 1);
    return res;
  }

  return value;
};

// finish
inrt.scroller.prototype.finish = function()
{
  this.velocity = { x: this.capSpeed(this.velocity.x), y: this.capSpeed(this.velocity.y) };

  if(this.velocity.x != 0 || this.velocity.y != 0)
  {
    requestAnimFrame(delegate(this, this.update));
  }
};

// update movement
inrt.scroller.prototype.update = function()
{
  // decelerate
  this.velocity.x = this.velocity.x * this.defaultDrag;
  this.velocity.y = this.velocity.y * this.defaultDrag;

  this.velocity.x = Math.round(this.velocity.x * 10) / 10;
  this.velocity.y = Math.round(this.velocity.y * 10) / 10;

  // make sure on full pixel
  this.el.scrollLeft = Math.round(this.el.scrollLeft + this.velocity.x);
  this.el.scrollTop = Math.round(this.el.scrollTop + this.velocity.y);

  // stop if hits bounds
  var maxTopScroll = this.el.scrollHeight - this.el.clientHeight;
  var maxLeftScroll = this.el.scrollWidth - this.el.clientWidth;

  if((Math.floor(Math.abs(this.velocity.x)) != 0 ||  Math.floor(Math.abs(this.velocity.y)) != 0) && 
     !((this.el.scrollTop == maxTopScroll) || (this.el.scrollLeft == maxLeftScroll)))
  {
    requestAnimFrame(delegate(this, this.update));
  }
};

//
// Helpers
//

// Namespace creator
function _ns(id)
{
  var t = window;
  var path = id.split(".");

  while(path.length != 0)
  {
    var p = path.shift();
    t[p] = t[p] || {};
    t = t[p];
  }
};

// Bind context
function delegate(ctx, func)
{
  return function() { return func.apply(ctx,arguments); };
};

// request animation polyfill
// http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

