require('mathbox');
var view = require('./view'),
    cache = require('./appcache'),
    css = require('./style.css'),
    acorn = require('acorn'),
    presets = {
      ast: require('file!./presets/ast.js'),
      water: require('file!./presets/water.js'),
      points: require('file!./presets/points.js'),
      surface: require('file!./presets/surface.js')
    },
    v = view.init(),
    el = document.body,
    events = ['mousemove', 'touchmove'],
    editor = document.querySelector("#editor"),
    err = document.querySelector("#error"),
    log = document.querySelector("#log"),
    input = document.querySelector("#input"),
    preset = document.querySelector("#preset"),
    stats = document.querySelector("#stats"),
    orientation = [0,0,0],
    limits = [1,1], // one char
    state;

function State() {
  var editing = false,
      drawing = true,
      lookback = 256,
      touchhistory = [0,1,2,3,4].map(function(x) { return new Float32Array(lookback); }),
      ticker = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 },
      labels = [],
      points = [];

  this.past = lookback;
  this.m = touchhistory;
  this.ticker = ticker;
  Object.defineProperties(this, {
    "drawing": {
      get: function() { return drawing; },
      set: function(on) {
        if (on !== drawing) {
          drawing = on;
          err.innerText += "[drawing]: " + on + "\n";
          el.dispatchEvent(new Event("drawing:changed"));
        }},
      enumerable: true
    },
    "editing": {
      get: function() { return editing; },
      set: function(on) {
        if (on !== editing) {
          editing = on;
          err.innerText += "[editing]: " + on + "\n";
          el.dispatchEvent(new Event("editing:changed"));
        }
      },
      enumerable: true
    },
    "labels": {
      get: function() { return labels; },
      set: function(l) { if (l != labels) { labels = l; } }
    },
    "points": {
      get: function() { return points; },
      set: function(p) { if (p != points) { points = p; } }
    }
  });
}

State.prototype.track = function track(touches) {
  for (i = 0; i < Math.min(this.m.length, touches.length); i++) {
    t = touches[i];
    x = t.clientX / window.innerWidth;
    y = t.clientY / window.innerHeight;
    this.m[i][advance(this.ticker, i, this.past)] = x;
    this.m[i][advance(this.ticker, i, this.past)] = 1 - y;    
  }
}

state = new State();

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
  var button = el.querySelector("#eval"),
      toggler = document.querySelector("#edit-toggle"),
      drawer = document.querySelector("#draw-toggle"),
      pathname = win.location.pathname;
  drawer.addEventListener('change', drawC);
  el.addEventListener('drawing:changed', reflect(state, "drawing", drawer));
  el.addEventListener('keydown', toggleon(9, toggle));
  el.addEventListener('keydown', shiftReturn(replaceF));
  el.addEventListener('keydown', toggleon(32, draw));
  input.addEventListener('input', showLast(err));
  preset.addEventListener('change', load);
  button.addEventListener('click', replaceF);
  toggler.addEventListener('change', toggleC);
  el.addEventListener('editing:changed', reflect(state, "editing", toggler));
  orientate(win);
  events.forEach(function(e) {
    el.addEventListener(e, trackF);
  });
}

function reflect(s, key, el) {
  return function(e) {
    var current = s[key];
    if (current !== el.checked) {
      el.checked = current;
    }
  }
}

function go(text) {
  editor.value = text;
  replaceRoot(text);
}

function load(e) {
  var s = this;
  loadpreset(s.value, go);
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

function space(f) {
  return function(e) {
    var self = this
    if (e.keyCode === 32) {
      return f.apply(self, [e]);
    }        
  };
}

function clearNetwork() {
  // clear existing network
  state.labels = [];
  state.points = [];
}

// FIXME: somehow, this will not do what I want and leave labels/points empty afterwards
function parseNetwork(text) {
  var ast = acorn.parse(text, {
    locations: true,
    sourceFile: text,
    onToken: store(limits)
  });
  function store(lim) {
    return function(token) {
      // store token as x,y coords with origin in top-left
      var col = token.loc.start.column,
          line = token.loc.start.line;
      lim[0] = Math.max(lim[0], col); // x
      lim[1] = Math.max(lim[1], line); // y
      state.labels.push((token.value || token.type.label) + " (" + col + ", " + line + ")");
      state.points.push(col);
      state.points.push(line);
    };
  }
}

function normalizeNetwork(limits) {
  state.points = state.points.map(function(p,i) {
    if ((i % 2) == 0) {
      return p / parseFloat(limits[0]);
    }
    else {
      return p / parseFloat(limits[1]);
    }x
  });
}

function draw() {
  if (state.drawing) {
    state.drawing = false;
  }
  else {
    state.drawing = true;
  }
  // when we draw, three is not controlled!
  spectate(!state.drawing)
}

function spectate(on) {
  mathbox.three.controls.enabled = on;
}

function toggle() {
  var els = [editor, log, err, stats];
  if (state.editing) {
    state.editing = false;
    els.forEach(hideDOM);
  }
  else {
    state.editing = true;
    els.forEach(showDOM);
  }
  function showDOM(el) { el.classList.add("enabled"); }
  function hideDOM(el) {
    el.classList.remove("enabled");
  }
}

function replaceRoot(text) {
  var res;
  try {
    shuffle(v.$);
    clearNetwork();
    parseNetwork(text);
    normalizeNetwork(limits);
    res = eval(text);
    err.innerText += "[eval]\n";
  }
  catch (e) {
    err.innerText += e.toString();
  }
}


function drawC(e) {
  var check = this;

  draw();
  check.checked = state.drawing ? "checked" : null;
}

function toggleC(e) {
  var check = this;

  toggle();
  check.checked = state.editing ? "checked" : null;
}

function toggleon(keycode, f) {
  return function (e) {
    var code = e.keyCode;
    if (code === keycode) {
      e.preventDefault(true);
      f.apply(f, [e]);
    }
  };
}

function replaceF(e) {
  replaceRoot(editor.value);
  input.dispatchEvent(new Event("input"));
  e.preventDefault(true);
}

function advance(s, i, size) {
  var current = s[i];
  s[i] = (s[i] + 1) % size;
  return current;
}

function orient(e) {
  if (typeof e.gamma === "number"
      && typeof e.beta === "number"
      && typeof e.alpha === "number") {
    orientprime(e);
  }
  else {
    err.innerText += ('[err] invalid orientation event\n');
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
  a = new THREE.Euler(-orientation[0],
                      -orientation[1],
                      -orientation[2]);
  p.applyEuler(a);
  return p;
}

function trackF(e) {
  var i = 0, touches = e.touches, t, x, y, p, a;
  if (state.drawing) { // tracking history only updated when not in "lookaround" mode
    e.preventDefault(true);
    if (!touches) {
      touches = [e];
    }
    state.track(touches);
  }
}

function shuffle($) {
  $.remove("*")
}

function emitter(m, n, f) {
  return function (emit, x, y, t) {
    var p = rot(m[n][x],m[n][x+1],0.0);
    l = f(t, m[n][x], m[n][x+1], 1.0);
    emit(l[0],l[1],l[2],1.0);
  };
}

function loadpreset(name, done) {
  if (typeof done !== "function") throw "missing done callback in second argument";
  var req = new XMLHttpRequest(),
      path = presets[name];
  req.open('GET', path, true);
  req.addEventListener('readystatechange', function() {
    if (req.readyState === XMLHttpRequest.DONE) {
      if (req.status === 200) {
        err.innerText += "[js:load] " + path + "\n";
        done(req.responseText);
      }
      else {
        err.innerText += "[js:err:code " + req.status + " <]\n";
      }
    }
    else {
      err.innerText += "[js:err:state <]" + req.readyState + "\n";
    }
  });
  req.send();
}

cache.init(window);
setup(el, window);
spectate(false);
loadpreset(preset.value, go)

// DSL
window.v = v;
window.viewer = function() {
  return v.viewer(window.innerWidth,window.innerHeight)
};
window.s = state;
window.camera = v.camera;
window.orientation = orientation;
window.rot = applyorient;
window.state = state;
window.limits = limits
window.presets = state.presets;
window.sin = Math.sin;
window.cos = Math.cos;
window.tan = Math.tan;
window.sqrt = Math.sqrt;
window.exp = Math.exp;
window.floor = Math.floor;
