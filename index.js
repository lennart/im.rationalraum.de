var view = require('./view'),
    cache = require('./appcache'),
    css = require('./style.css'),
    v = view.init(),
    el = document.body,
    lookback = 3 * 128,
    points = new Float32Array(lookback),
    tick = 0,
    events = ['mousemove', 'touchmove'],
    editor = document.querySelector("#editor"),
    err = document.querySelector("#error"),     
    log = document.querySelector("#log"),
    orientation = [0,0,0];

function orientate(win) {
  if (window.DeviceOrientationEvent) {
    win.addEventListener('deviceorientation', orient, false);
  }
  else {
    err.innerText += "Device Orientation not supported, meh";
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
  var editor = el.querySelector("#editor"),
      button = el.querySelector("#eval");
  editor.addEventListener('keydown', shiftReturn(replaceF));
  button.addEventListener('click', replaceF);
  orientate(win);
  events.forEach(function(e) {
    el.addEventListener(e, track);
  });
}


function shiftReturn(f) {
  return function(e) {
    var self = this
    if (e.keyCode === 13
        && e.shiftKey) {
      return f.apply(self, [e]);
    }
  };
}

function replaceF(e) {
  var res, text = editor.innerHTML;
  try {
    shuffle(v.$);
    res = eval(text);
    err.innerText += res;
  }
  catch (e) {
    err.innerText += e.toString();
  }    
  e.preventDefault(true);
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
    err.innerText += ('invalid orientation event');
  }
}

function orientprime(e) {
  log.innerText = "gamma: " + e.gamma + "\n"
    + "beta: "
    + e.beta + "\n"
    + "alpha: " + e.alpha;  
  orientation = [e.beta, e.alpha, e.gamma]
    .map(function(x) { return THREE.Math.degToRad(x); });  
}

function track(e) {
  var i = 0, touches = e.touches, t, x, y, p, a;
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
    p = new THREE.Vector3(x, y, 0);
    a = new THREE.Euler(orientation[0],
                        orientation[1],
                        orientation[2]);
    p.applyEuler(a);
    points[next()] = p.x
    points[next()] = p.y
    points[next()] = p.z
  }
}

// erase current root
function shuffle($) {
  debugger;
  $.remove("root")
  debugger;
}

cache.init(window);

setup(el, window);
window.points = points;
//console.log("[mb]", mb);

window.lookback = lookback;
window.viewer = v.viewer;
window.camera = v.camera;

