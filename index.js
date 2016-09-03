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
    lookback = 32,
    touchhistory = [0,1,2,3,4].map(function(x) { return new Float32Array(lookback); }),
    ticker = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 },
    events = ['mousemove', 'touchmove'],
    labels = [],
    points = [],
    editor = document.querySelector("#editor"),
    err = document.querySelector("#error"),
    log = document.querySelector("#log"),
    input = document.querySelector("#input"),
    preset = document.querySelector("#preset"),
    stats = document.querySelector("#stats"),
    orientation = [0,0,0],
    limits = [1,1], // one char
    edit = false;

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
      button = el.querySelector("#eval"),
      pathname = win.location.pathname;
  el.addEventListener('keydown', toggleF);
  preset.addEventListener('change', load);
  input.addEventListener('input', showLast(err));
  el.addEventListener('keydown', shiftReturn(replaceF));
  button.addEventListener('click', replaceF);
  orientate(win);
  events.forEach(function(e) {
    el.addEventListener(e, track);
  });
}

function load(e) {
  var s = this;
  loadpreset(s.value);
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


// FIXME: somehow, this will not do what I want and leave labels/points empty afterwards
function parseNetwork(text) {
  var ast = acorn.parse(text, {
    locations: true,
    sourceFile: text,
    onToken: store(limits)
  });
  // clear existing network
  labels = [];
  points = [];
  function store(lim) {
    return function(token) {
      // store token as x,y coords with origin in top-left
      var col = token.loc.start.column,
          line = token.loc.start.line;
      lim[0] = Math.max(lim[0], col); // x
      lim[1] = Math.max(lim[1], line); // y
      labels.push(token.value || token.type.label);
      points.push(col);
      points.push(line);
    };
  }

}

function toggle() {
  var els = [editor, log, err, stats];
  if (edit) {
    edit = false;
    els.forEach(hideDOM);
  }
  else {
    edit = true;
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
    parseNetwork(text);
    console.log(limits, points, labels);
    res = eval(text);
  }
  catch (e) {
    err.innerText += e.toString();
  }
}

function toggleF(e) {
  var code = e.keyCode;
  if (code === 9) {
    e.preventDefault(true);
    toggle();
  }
}

function replaceF(e) {
  replaceRoot(editor.value);
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

function emitter(m, n, f) {
  return function (emit, x, y, t) {
    var st = f(t),
        px = m[n][x],
        py = m[n][(x+1)],
        pz = st;
    p = rot(px,py,pz);
    emit(p.x, p.y, p.z, 1);
  };
}

cache.init(window);
setup(el, window);

// routes
function loadpreset(name) {
  var req = new XMLHttpRequest(),
      path = presets[name];

  req.open('GET', path, true);
  req.addEventListener('readystatechange', function() {
    if (req.readyState === XMLHttpRequest.DONE) {
      if (req.status === 200) {
        err.innerText += "[js:load] " + path + "\n";
        editor.innerHTML = req.responseText;
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

loadpreset(preset.value);

// DSL
window.v = v;
window.m = touchhistory;
window.max = lookback;
window.viewer = function() {
  return v.viewer(window.innerWidth,window.innerHeight)
};
window.stream = function(n,f) {
  return emitter(touchhistory, n, f);
};
window.camera = v.camera;
window.orientation = orientation;
window.rot = applyorient;
window.points = points;
window.labels = labels;
window.limits = limits;
window.presets = presets;
