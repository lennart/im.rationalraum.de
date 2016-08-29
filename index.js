var view = require('./view'),
    cache = require('./appcache'),
    css = require('./style.css'),
    v = view.init(),
    el = document.body,
    lookback = 32,
    touchhistory = [0,1,2,3,4].map(function(x) { return new Float32Array(lookback); }),
    ticker = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 },
    events = ['mousemove', 'touchmove'],
    editor = document.querySelector("#editor"),
    err = document.querySelector("#error"),     
    log = document.querySelector("#log"),
    input = document.querySelector("#input"),
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
  input.addEventListener('input', showLast(err));
  editor.addEventListener('keydown', shiftReturn(replaceF));
  button.addEventListener('click', replaceF);
  orientate(win);
  events.forEach(function(e) {
    el.addEventListener(e, track);
  });
}

function showLast(el) {
  return function(e) {
    el.scrollTop = el.scrollHeight;
  };
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
  var res, text = editor.value;
  try {
    shuffle(v.$);
    err.innerText += "[eval>] " + text + "\n";
    res = eval(text);
    err.innerText += "[eval<] " + res + "\n";
  }
  catch (e) {
    err.innerText += e.toString();
  }
  input.dispatchEvent(new Event("input"));
  e.preventDefault(true);
}

function advance(state, i, size) {
  state[i] = (state[i] + 1) % size;
  return state[i];
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

function applyorient(x, y, z) {
    p = new THREE.Vector3(x, y, z);
    a = new THREE.Euler(orientation[0],
                        orientation[1],
                        orientation[2]);
  p.applyEuler(a);
  return p;
}

function track(e) {
  var i = 0, touches = e.touches, t, x, y, p, a;
  e.preventDefault(true);
  if (!touches) {
    touches = [e];
  }
  for (i = 0; i < Math.min(touchhistory.length, touches.length); i++) {
    t = touches[i];
    x = t.clientX / window.innerWidth;
    x *= 2;
    x -= 1;
    y = t.clientY / window.innerHeight;
    y *= -2;
    y += 1;
    touchhistory[i][advance(ticker, i, lookback)] = x;
    touchhistory[i][advance(ticker, i, lookback)] = y;
  }
}

function shuffle($) {
  $.remove("*")
}

function emitter(m, n, max) {
  return function (emit, x, y, t) {
    var st = 0.25 * Math.sin(t),
        px = m[n][x % max],
        py = m[n][(x+1) % max],
        pz = st;
        p = rot(px,py,pz);
    emit(p.x, p.y, p.z, 1);    
  };
}

cache.init(window);
setup(el, window);

// DSL
window.m = touchhistory;
window.max = lookback;
window.viewer = function() {
  return v.viewer(window.innerWidth,window.innerHeight)
};
window.stream = function(n) {
  return emitter(touchhistory, n, lookback);
};
window.camera = v.camera;
window.orientation = orientation;
window.rot = applyorient;
