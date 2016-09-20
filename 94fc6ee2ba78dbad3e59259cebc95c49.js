camera()

v.mathbox.select("camera").bind("position", function(t) { 
  return [
    sin(m[0][floor(t) % max]),
    cos(m[0][(floor(t) + 1) % max]),
    1];
})

viewer()
  .transform({ rotation: orientation })
  .matrix({
    id: "first", history: max,
    expr: stream(0, function(t) { return [sin(t),cos(t),sin(t)] }),
    width: 24, height: 24,
  })
  .rtt({
    history: 2,
    type: 'unsignedByte',
  })
  .shader({
    code: '#rtt-water',
  })
  .resample({
    indices:    3,
    channels: 4,
  })
  .compose({
    color: '#ffffff',
    zWrite: false,
  })
  .matrix({
    id: "second", history: max,
    expr: stream(1, function(t) {return [sin(t),cos(t),sin(t)*0.1]; }),
    width: 24, height: 24,
  })
  .point({
    points: "#first",
    colors: "#second", color: '#ffffff'
  })
  .end()
  .end()
  .compose({
    color: '#fff',
    zWrite: false,
  })
