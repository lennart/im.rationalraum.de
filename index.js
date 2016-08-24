var view = require('./view'),
    ui = view.init(),
    el = document.body,
    lookback = 512,
    points = new Float32Array(lookback),
    tick = 0;


ui.field.set({
  data: points
});


function setup(el) {
//  el.addEventListener('mousedown', tracked(el));
  //  el.addEventListener('mouseup', untracked(el));
  el.addEventListener('mousemove', track);
}

function tracked(el) {
  el.addEventListener('mousemove', track);
}

function untracked(el) {
  ui.$.print();
  el.removeEventListener('mousemove', track);
}

function next() {
  tick = (tick + 1) % lookback;

  return tick;
}

function track(e) {
  points[next()] = e.clientX;
  points[next()] = e.clientY;
  ui.$.print();  
}



setup(el)
window.points = points;
