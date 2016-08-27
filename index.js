var view = require('./view'),
    css = require('./style.css'),
    ui = view.init(),
    el = document.body,
    lookback = 512,
    points = new Float32Array(lookback),
    tick = 0,
    events = ['mousemove', 'touchmove'],
    log = document.querySelector("#log");

ui.field.set({
  data: points
});

function orientate(win) {
  if (window.DeviceOrientationEvent) {
    win.addEventListener('deviceorientation', orient, false);
  }
  else {
    alert("Device Orientation not supported, meh");
  }
}

function fullscreen(el) {
  el.webkitRequestFullscreen();
}

function gofullscreen(el) {
  return function() {
    el.removeEventListener('click', gofullscreen);
    fullscreen(document.documentElement);
  };
}

function setup(el, win) {
  orientate(win);
  events.forEach(function(e) {
    el.addEventListener(e, track);
  });
}

function next() {
  tick = (tick + 1) % lookback;
  return tick;
}

function orient(e) {
  if (typeof e.gamma === "number"
      && typeof e.beta === "number"
      && typeof e.alpha === "number") {
    orientprime(e);
  }
  else {
    alert('invalid orientation event');
  }
}

function orientprime(e) {
  log.innerText = "gamma: " + e.gamma + "\n"
    + "beta: "
    + e.beta + "\n"
    + "alpha: " + e.alpha;
  ui.orient.set({
    rotation: [e.beta,e.alpha,e.gamma].map(function(x) { return THREE.Math.degToRad(x); })
  })
}

function track(e) {
  var i = 0, touches = e.touches, t, x, y;
  e.preventDefault(true);
  if (!touches) {
    touches = [e];
  }
  for (i = 0; i < touches.length; i++) {
    t = touches[i];
    x = t.clientX / window.innerWidth;
    x *= 2;
    x -= 1;
    y = t.clientY / window.innerHeight;
    y *= -2;
    y += 1;    
    points[next()] = x
    points[next()] = y
    ui.$.print();
  }
}

setup(el, window);
window.points = points;


